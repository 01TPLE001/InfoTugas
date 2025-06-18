import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { ThreeDot } from "react-loading-indicators";

interface Week {
  week_id: number;
  week_number: number;
  semester_id: number;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function WeekUserPage() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { semesterId } = useParams();

  useEffect(() => {
    if (semesterId) fetchWeeks(semesterId);
  }, [semesterId]);

const fetchWeeks = async (id: string | number) => {
  setLoading(true);
  try {
    const token = Cookies.get("token");
    const res = await axios.get(`${API_URL}/week/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setWeeks(Array.isArray(res.data.data) ? res.data.data : []);
  } catch {
    setWeeks([]);
  }
  setLoading(false);
};
  // ADMIN ONLY: Tambah week
  // const [newWeek, setNewWeek] = useState("");
  // const handleAddWeek = async () => { ... }

  // ADMIN ONLY: Edit week
  // const [editId, setEditId] = useState<number | null>(null);
  // const [editValue, setEditValue] = useState<string>("");
  // const startEdit = (week: Week) => { ... }
  // const cancelEdit = () => { ... }
  // const saveEdit = async (week_id: number) => { ... }

  // ADMIN ONLY: Hapus week
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [deleteId, setDeleteId] = useState<number | null>(null);
  // const handleDeleteWeek = async () => { ... }

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
    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Daftar Week</h2>

      {/* ADMIN ONLY: Form tambah week */}
      {/*
      <div className="flex gap-2 mb-4">
        <input ... />
        <button onClick={handleAddWeek}>Add</button>
      </div>
      */}

      {loading && <ThreeDot color="#32cd32" size="medium" text="Loading..." textColor="#ffffff" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {weeks.length > 0 ? (
          weeks.map((w) => (
            <div
              key={w.week_id}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
              onClick={() => navigate(`/task-user/${w.semester_id}/${w.week_id}`)}
            >
              <span className="text-sm text-blue-500">Week {w.week_number}</span>
            </div>
          ))
        ) : (
          !loading && (
            <div className="text-gray-500 dark:text-gray-400">
              Belum ada week tersedia.
            </div>
          )
        )}
      </div>

      {/* ADMIN ONLY: Modal Edit & Hapus */}
      {/*
      {showDeleteModal && (
        <div>Modal Hapus Week</div>
      )}
      */}
    </div>
  );
}