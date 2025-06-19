import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Atom } from "react-loading-indicators";
import { parseISO, differenceInMilliseconds } from "date-fns";
import Cookies from "js-cookie";

interface Task {
  task_id: number;
  user_id: string;
  week_id: number;
  name: string;
  matkul: string;
  link: string;
  deadline: string;
  semester_id: number;
  status?: boolean; // status dari backend (opsional, tergantung API)
}
const API_URL = import.meta.env.VITE_API_URL;

// Komponen countdown deadline
function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState(
    differenceInMilliseconds(parseISO(deadline), new Date())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(differenceInMilliseconds(parseISO(deadline), new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft <= 0) {
    return <span className="text-red-500 text-xs">Deadline passed</span>;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <span className="text-xs text-green-600">
      {days}d {hours}h {minutes}m {seconds}s left
    </span>
  );
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { semesterId, weekId } = useParams();

  useEffect(() => {
    if (semesterId && weekId) fetchTasks();
  }, [semesterId, weekId]);

  const fetchTasks = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    try {
      const res = await axios.get(`${API_URL}/task/${semesterId}/${weekId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.data);
    } catch (err: any) {
      setTasks([]);
    }
    setLoading(false);
  };

  // Fungsi untuk mengubah status tugas (selesai/belum) di database
  const handleChangeStatus = async (taskId: number, status: boolean) => {
    const token = Cookies.get("token");
    try {
      await axios.post(
        `${API_URL}/task/change_status/${semesterId}/${weekId}/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchTasks();
    } catch (err) {
      alert("Gagal mengubah status tugas");
    }
  };

  // Hitung progress
  const doneCount = tasks.filter(t => t.status === true).length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-2 text-gray-950 dark:text-white margin">Student Dashboard</h1>
      <hr
        style={{
          border: "none",
          height: "2px",
          backgroundColor: "#333",
        }}
      />
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white flex items-center justify-between">
        Daftar Tugas
        <span className="ml-4 text-sm text-blue-600">{progress}% selesai</span>
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {loading && (
        <Atom
          color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
          text="LOADING"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tasks.length > 0
          ? tasks.map((task) => (
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
                  <span className="text-xs text-gray-400">
                    Week: {task.week_id}
                  </span>
                  <Countdown deadline={task.deadline} />
                </div>
                <div className="items-center gap-2 mt-2 grid">
<button
  className={`mt-2 px-3 py-1 w-full rounded text-xs h-10 font-semibold transition-all duration-200 ${
    task.status
      ? "bg-green-500 text-white"
      : "bg-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white"
  }`}
  onClick={() => handleChangeStatus(task.task_id, !task.status)}
>
  {task.status ? "Sudah Dikerjakan" : "Tandai Selesai"}
</button>
                  <span className="text-sm text-end">
                    {task.status ? "Selesai" : "Belum selesai"}
                  </span>
                </div>
              </div>
            ))
          : !loading && (
              <div className="text-gray-500 dark:text-gray-400 col-span-full">
                Tidak ada tugas untuk minggu ini.
              </div>
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