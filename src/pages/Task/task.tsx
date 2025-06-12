import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Atom } from "react-loading-indicators";

interface Task {
  task_id: number;
  user_id: string;
  week_id: number;
  name: string;
  matkul: string;
  link: string;
  deadline: string;
  semester_id: number;
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    matkul: "",
    link: "",
    deadline: "",
  });
  const [newWeek, setNewWeek] = useState("");
  const { semesterId, weekId } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (semesterId && weekId) fetchTasks();
  }, [semesterId, weekId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/task/${semesterId}/${weekId}`);
      setTasks(res.data.data);
    } catch {
      setTasks([]);
    }
    setLoading(false);
  };

  // Tambah task baru
  const handleAddTask = async () => {
    if (!newTask.name || !newTask.matkul || !newTask.deadline) {
      alert("Nama, matkul, dan deadline wajib diisi");
      return;
    }
    try {
      await axios.post(`${API_URL}/task`, {
        name: newTask.name,
        matkul: newTask.matkul,
        link: newTask.link,
        deadline: newTask.deadline,
        semester_id: Number(semesterId),
        week_id: Number(weekId),
      });
      setNewTask({ name: "", matkul: "", link: "", deadline: "" });
      fetchTasks();
    } catch {
      alert("Gagal menambah task");
    }
  };

  // Tambah week baru
  const handleAddWeek = async () => {
    if (!newWeek) {
      alert("Week wajib diisi");
      return;
    }
    try {
      await axios.post(`${API_URL}/week`, {
        week: newWeek,
        semester_id: Number(semesterId),
      });
      setNewWeek("");
      fetchTasks();
    } catch {
      alert("Gagal menambah week");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Daftar Tugas</h2>

      {/* Form tambah task */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newTask.name}
          onChange={e => setNewTask(t => ({ ...t, name: e.target.value }))}
          placeholder="Nama Tugas"
        />
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newTask.matkul}
          onChange={e => setNewTask(t => ({ ...t, matkul: e.target.value }))}
          placeholder="Mata Kuliah"
        />
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newTask.link}
          onChange={e => setNewTask(t => ({ ...t, link: e.target.value }))}
          placeholder="Link"
        />
        <input
          type="date"
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newTask.deadline}
          onChange={e => setNewTask(t => ({ ...t, deadline: e.target.value }))}
          placeholder="Deadline"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1 rounded"
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>

      {/* Form tambah week */}
      <div className="flex gap-2 mb-4">
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newWeek}
          onChange={(e) => setNewWeek(e.target.value)}
          placeholder="Tambah Week"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1 rounded"
          onClick={handleAddWeek}
        >
          Add
        </button>
      </div>

      {loading && (
        <Atom color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} text="LOADING" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.task_id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5 flex flex-col gap-2 animate-fade-in-up"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                  {task.matkul}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{task.name}</h3>
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all text-sm"
              >
                {task.link}
              </a>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">Task ID: {task.task_id}</span>
                <span className="text-xs text-gray-400">Week: {task.week_id}</span>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className="text-gray-500 dark:text-gray-400 col-span-full">
              Tidak ada tugas untuk minggu ini.
            </div>
          )
        )}
      </div>
      {/* Animasi fade-in-up */}
      <style>
        {`
          .animate-fade-in-up {
            animation: fadeInUp 0.3s;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
