import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Atom } from "react-loading-indicators";
import { useNavigate, useParams } from "react-router-dom";

interface Week {
  week_id: number;
  week_number: number;
}

export default function WeekPage() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [newWeek, setNewWeek] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { semesterId } = useParams(); // sudah ada di kode kamu

  useEffect(() => {
    if (semesterId) fetchWeeks(semesterId);
  }, [semesterId]);

  const fetchWeeks = async (id: string | number) => {
    if (!API_URL) {
      console.error("API_URL tidak ditemukan");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/week/${id}`);
      // Pastikan data selalu array
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setWeeks(data);
    } catch (err) {
      setWeeks([]); // Jika error, tetap set array kosong agar halaman tetap tampil
      alert("Gagal mengambil data week");
    }
    setLoading(false);
  };

  const handleAddWeek = async () => {
    if (!newWeek) {
      alert("Week tidak boleh kosong");
      return;
    }
    if (isNaN(Number(newWeek))) {
      alert("Week harus berupa angka");
      return;
    }
    const isWeekExists = weeks.some(
      (w) => w.week_number === Number(newWeek)
    );
    if (isWeekExists) {
      alert("Week sudah ada");
      return;
    }
    const token = Cookies.get("token");
    if (!token) {
      alert("Token login tidak ditemukan. Silakan login ulang.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/week/`,
        { week_number: Number(newWeek) },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setNewWeek("");
      fetchWeeks(semesterId!);
    } catch (err: any) {
      alert("Gagal menambah week");
    }
  };

  // Modal konfirmasi hapus
  const handleDeleteWeek = async () => {
    if (!deleteId) return;
    const token = Cookies.get("token");
    if (!token) {
      alert("Token login tidak ditemukan. Silakan login ulang.");
      return;
    }
    try {
      await axios.delete(`${API_URL}/week/${deleteId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchWeeks(semesterId!);
    } catch (err: any) {
      alert("Gagal menghapus week");
    }
  };

  const startEdit = (week: Week) => {
    setEditId(week.week_id);
    setEditValue(String(week.week_number));
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValue("");
  };

  const saveEdit = async (week_id: number) => {
    if (!editValue || isNaN(Number(editValue))) {
      alert("Week harus berupa angka");
      return;
    }
    const token = Cookies.get("token");
    if (!token) {
      alert("Token login tidak ditemukan. Silakan login ulang.");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/week/${week_id}`,
        { week_number: Number(editValue) },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setEditId(null);
      setEditValue("");
      fetchWeeks(semesterId!);
    } catch (err: any) {
      alert("Gagal update week");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Week</h2>
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
        {weeks.length > 0 ? (
          weeks.map((w) => (
            <div key={w.week_id} className="mb-2">
              <div
                className="cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow transition-all duration-300 hover:ring-2 hover:ring-blue-400"
                onClick={() => navigate(`/task/${semesterId}/${w.week_id}`)}
                title="Lihat Task"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Week {w.week_number}
                  </h3>
                  <span className="text-xs text-blue-500">Lihat Task</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-all"
                    onClick={e => {
                      e.stopPropagation();
                      startEdit(w);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                    onClick={e => {
                      e.stopPropagation();
                      setShowDeleteModal(true);
                      setDeleteId(w.week_id);
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
              {/* Card Edit muncul di bawah card week dengan animasi */}
              {editId === w.week_id && (
                <div className="animate-fade-in-up transition-all duration-300">
                  <div className="mt-2 border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900 p-4 rounded shadow flex items-center gap-2">
                    <input
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded w-20"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                    />
                    <button
                      className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                      onClick={() => saveEdit(w.week_id)}
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
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-400">Belum ada week tersedia.</div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in-up min-w-[300px]">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Konfirmasi Hapus</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Apakah kamu yakin ingin menghapus week ini?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteWeek}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

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

