import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ThreeDot } from "react-loading-indicators";
import AlertCard from "../../components/Alert/alert";

interface MatkulData {
  matkul_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function MatkulSidebar() {
  const [matkuls, setMatkuls] = useState<MatkulData[]>([]);
  const [newMatkul, setNewMatkul] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editMatkul, setEditMatkul] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchMatkuls();
  }, []);

  const fetchMatkuls = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/matkul`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      });
      if (Array.isArray(res.data.data)) {
        setMatkuls(res.data.data);
      } else {
        setMatkuls([]);
      }
    } catch (error) {
      setMatkuls([]);
      setAlertMsg("Gagal mengambil data matkul");
    }
    setLoading(false);
  };

  const handleAddMatkul = async () => {
    if (!newMatkul) {
      setAlertMsg("Nama matkul tidak boleh kosong");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/matkul`,
        { name: newMatkul },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        }
      );
      setNewMatkul("");
      fetchMatkuls();
    } catch (err: any) {
      setAlertMsg(
        err?.response?.data?.message ||
        "Gagal menambah matkul"
      );
    }
  };

  const startEdit = (matkul: MatkulData) => {
    setEditId(matkul.matkul_id);
    setEditMatkul(matkul.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditMatkul("");
  };

  const saveEdit = async (matkul_id: string) => {
    if (!editMatkul) {
      setAlertMsg("Nama matkul tidak boleh kosong");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/matkul/${matkul_id}`,
        { name: editMatkul },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` }
        }
      );
      setEditId(null);
      setEditMatkul("");
      fetchMatkuls();
    } catch (err: any) {
      setAlertMsg(
        err?.response?.data?.message ||
        "Gagal update matkul"
      );
    }
  };

  const handleDeleteMatkul = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/matkul/${deleteId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchMatkuls();
    } catch (err: any) {
      setAlertMsg(
        err?.response?.data?.message ||
        "Gagal menghapus matkul"
      );
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Semua Mata Kuliah
      </h2>
      {/* Form tambah matkul */}
      <div className="flex gap-2 mb-4">
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newMatkul}
          onChange={e => setNewMatkul(e.target.value)}
          placeholder="Tambah Mata Kuliah"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1 rounded"
          onClick={handleAddMatkul}
        >
          Add
        </button>
      </div>
      {loading && (
        <ThreeDot color="#32cd32" size="medium" text="" textColor="" />
      )}
      {matkuls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matkuls.map((m) => (
            <div
              key={m.matkul_id}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow transition-all"
            >
              {editId === m.matkul_id ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
                    value={editMatkul}
                    onChange={ev => setEditMatkul(ev.target.value)}
                    placeholder="Nama Mata Kuliah"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                      onClick={() => saveEdit(m.matkul_id)}
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
                  <div className="font-semibold text-blue-700 dark:text-blue-300 break-all">
                    {m.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Dibuat: {new Date(m.created_at).toLocaleString()}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-all"
                      onClick={() => startEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setDeleteId(m.matkul_id);
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-gray-500 dark:text-gray-400">
            Belum ada mata kuliah tersedia.
          </div>
        )
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in-up min-w-[300px]">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Konfirmasi Hapus</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Apakah kamu yakin ingin menghapus mata kuliah ini?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteMatkul}
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
    </div>
  );
}