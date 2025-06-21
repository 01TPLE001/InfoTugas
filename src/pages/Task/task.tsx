import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import Cookies from "js-cookie";
import AlertCard from "../../components/Alert/alert";

interface Task {
  task_id: number;
  user_id: string;
  week_id: number;
  name: string;
  matkul: string;
  link: string;
  deadline: string;
  semester_id: number;
  task_code : any;
}

interface MatkulData {
  matkul_id: string;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// Komponen countdown deadline
function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState(
    () => new Date(deadline).getTime() - Date.now()
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(new Date(deadline).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  if (timeLeft <= 0)
    return <span className="text-red-500 text-xs">Deadline lewat</span>;
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  return (
    <span className="text-xs text-green-600">
      {days}d {hours}h {minutes}m {seconds}s
    </span>
  );
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
  const [editId, setEditId] = useState<number | null>(null);
  const [editTask, setEditTask] = useState({
    name: "",
    matkul: "",
    link: "",
    deadline: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [matkuls, setMatkuls] = useState<MatkulData[]>([]);
  const [doneTasks, setDoneTasks] = useState<number[]>(() => {
    try {
      const data = localStorage.getItem("admin_done_tasks");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });
  const { semesterId, weekId } = useParams();

  useEffect(() => {
    fetchMatkuls();
    if (semesterId && weekId) fetchTasks();
  }, [semesterId, weekId]);

  const fetchMatkuls = async () => {
    try {
      const res = await axios.get(`${API_URL}/matkul`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      if (Array.isArray(res.data.data)) {
        setMatkuls(res.data.data);
      } else {
        setMatkuls([]);
      }
    } catch {
      setMatkuls([]);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      console.log(`Fetching tasks for semester ${semesterId} week ${weekId}`); // Debug log
      const res = await axios.get(`${API_URL}/task/${semesterId}/${weekId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      
      // Pastikan response data valid
      if (res.data && Array.isArray(res.data.data)) {
        setTasks(res.data.data);
      } else {
        console.warn('Invalid response format:', res.data);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error); // Debug log
      setTasks([]);
    }
    setLoading(false);
  };

  // Tambah task baru
  const handleAddTask = async () => {
    if (!newTask.name || !newTask.matkul || !newTask.deadline) {
      setAlertMsg("Nama, matkul, dan deadline wajib diisi");
      return;
    }
    
    try {
      await axios.post(
        `${API_URL}/task/${semesterId}/${weekId}`,
        {
          name: newTask.name,
          matkul: newTask.matkul,
          link: newTask.link,
          deadline: newTask.deadline,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      
      // Reset form
      setNewTask({ name: "", matkul: "", link: "", deadline: "" });
      window.location.reload()
      
      // Tunggu sebentar sebelum fetch ulang (untuk memastikan database sudah update)


      
      // Atau alternatif: langsung tambahkan ke state tanpa fetch ulang
      // if (response.data && response.data.data) {
      //   setTasks(prevTasks => [...prevTasks, response.data.data]);
      // }
      
    } catch (err: any) {
      console.error("Error add task:", err?.response?.data || err);
      setAlertMsg(err?.response?.data?.message || "Gagal menambah task");
    }
  };

  // Mulai edit task
  const startEdit = (task: Task) => {
    setEditId(task.task_id);
    setEditTask({
      name: task.name,
      matkul: task.matkul,
      link: task.link,
      deadline: task.deadline,
    });
  };

  // Batal edit
  const cancelEdit = () => {
    setEditId(null);
    setEditTask({ name: "", matkul: "", link: "", deadline: "" });
  };

  // Simpan edit
  const saveEdit = async (semester_id : number,week_id : number,task_code: any) => {
    if (!editTask.name || !editTask.matkul || !editTask.deadline) {
      setAlertMsg("Nama, matkul, dan deadline wajib diisi");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/task/${semester_id}/${week_id}/${task_code}`,
        {
          name: editTask.name,
          matkul: editTask.matkul,
          link: editTask.link,
          deadline: editTask.deadline,
        },
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      setEditId(null);
      setEditTask({ name: "", matkul: "", link: "", deadline: "" });
      
      // Tunggu sebentar sebelum fetch ulang
      setTimeout(() => {
        fetchTasks();
      }, 100);
      
    } catch (error) {
      console.error('Error updating task:', error);
      setAlertMsg("Gagal update task");
    }
  };

  // Modal konfirmasi hapus
  const handleDeleteTask = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(
        `${API_URL}/task/${semesterId}/${weekId}/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          data: { task_id: deleteId },
        }
      );
      setShowDeleteModal(false);
      setDeleteId(null);
      
      // Tunggu sebentar sebelum fetch ulang
      setTimeout(() => {
        fetchTasks();
      }, 100);
      
    } catch (error) {
      console.error('Error deleting task:', error);
      setAlertMsg("Gagal menghapus task");
    }
  };

  // Tambahkan fungsi toggle selesai
  const toggleDone = (task_id: number) => {
    let updated: number[];
    if (doneTasks.includes(task_id)) {
      updated = doneTasks.filter((id) => id !== task_id);
    } else {
      updated = [...doneTasks, task_id];
    }
    setDoneTasks(updated);
    localStorage.setItem("admin_done_tasks", JSON.stringify(updated));
  };

  // Hitung progress
const expiredCount = tasks.filter(
  (t) => new Date(t.deadline).getTime() < Date.now()
).length;
const expiredProgress =
  tasks.length > 0 ? Math.round((expiredCount / tasks.length) * 100) : 0;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-2 text-gray-950 dark:text-white margin">
        Admin Dashboard
      </h1>
      <hr
        style={{
          border: "none",
          height: "2px",
          backgroundColor: "#333",
        }}
      />



<h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white flex items-center justify-between">
  Daftar Tugas
  <span className="ml-4 text-sm text-red-600 dark:text-red-400">
    {expiredProgress}% Tugas Kadaluarsa
  </span>
</h2>
<div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
  <div
    className="bg-red-500 h-2.5 rounded-full transition-all duration-300"
    style={{ width: `${expiredProgress}%` }}
  ></div>
</div>

      {/* Form tambah task */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newTask.name}
          onChange={(e) => setNewTask((t) => ({ ...t, name: e.target.value }))}
          placeholder="Nama Tugas"
        />
        <select
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newTask.matkul}
          onChange={(e) =>
            setNewTask((t) => ({ ...t, matkul: e.target.value }))
          }
        >
          <option value="">Pilih Mata Kuliah</option>
          {matkuls.map((matkul) => (
            <option key={matkul.matkul_id} value={matkul.name}>
              {matkul.name}
            </option>
          ))}
        </select>
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newTask.link}
          onChange={(e) => setNewTask((t) => ({ ...t, link: e.target.value }))}
          placeholder="Link"
        />
        <input
          type="date"
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newTask.deadline}
          onChange={(e) =>
            setNewTask((t) => ({ ...t, deadline: e.target.value }))
          }
          placeholder="Deadline"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1 rounded"
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>

      {loading && (
        <ThreeDot color="#32cd32" size="medium" text="" textColor="" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tasks.length > 0
          ? tasks.map((task) => (
              <div
                key={task.task_id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5 flex flex-col gap-2 animate-fade-in-up"
              >
                {editId === task.task_id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
                      value={editTask.name}
                      onChange={(e) =>
                        setEditTask((t) => ({ ...t, name: e.target.value }))
                      }
                      placeholder="Nama Tugas"
                    />
                    <input
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
                      value={editTask.matkul}
                      onChange={(e) =>
                        setEditTask((t) => ({ ...t, matkul: e.target.value }))
                      }
                      placeholder="Mata Kuliah"
                    />
                    <input
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
                      value={editTask.link}
                      onChange={(e) =>
                        setEditTask((t) => ({ ...t, link: e.target.value }))
                      }
                      placeholder="Link"
                    />
                    <input
                      type="date"
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
                      value={editTask.deadline}
                      onChange={(e) =>
                        setEditTask((t) => ({ ...t, deadline: e.target.value }))
                      }
                      placeholder="Deadline"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                        onClick={() => saveEdit(task.semester_id,task.week_id,task.task_code)}
                      >
                        Simpan
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded"
                        onClick={cancelEdit}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                        {task.matkul}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {task.name}
                    </h3>
                    <a
                      href={task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all text-sm"
                    >
                      {task.link}
                    </a>
                    <div className="flex justify-between items-center mt-2">
                      <Countdown deadline={task.deadline} />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-all"
                        onClick={() => startEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setDeleteId(task.task_code);
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          : !loading && (
              <div className="text-gray-500 dark:text-gray-400 col-span-full">
                Tidak ada tugas untuk minggu ini.
              </div>
            )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in-up min-w-[300px]">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Konfirmasi Hapus
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Apakah kamu yakin ingin menghapus tugas ini?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteTask}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      <AlertCard
        open={!!alertMsg}
        message={alertMsg}
        onClose={() => setAlertMsg(null)}
      />
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