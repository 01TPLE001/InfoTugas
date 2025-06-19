import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ThreeDot } from "react-loading-indicators";
import AlertCard from "../../components/Alert/alert";

interface EmailData {
  email_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function EmailSidebar() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/email`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      if (Array.isArray(res.data.data)) {
        setEmails(res.data.data);
      } else {
        setEmails([]);
      }
    } catch (error) {
      setEmails([]);
      setAlertMsg("Gagal mengambil data email");
    }
    setLoading(false);
  };

  const handleAddEmail = async () => {
    if (!newEmail) {
      setAlertMsg("Email tidak boleh kosong");
      return;
    }
    // Validasi sederhana email
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(newEmail)) {
      setAlertMsg("Format email tidak valid");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/email`,
        { email: newEmail },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      setNewEmail("");
      fetchEmails();
    } catch (err: any) {
      setAlertMsg(err?.response?.data?.message || "Gagal menambah email");
    }
  };

  const startEdit = (email: EmailData) => {
    setEditId(email.email_id);
    setEditEmail(email.email);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditEmail("");
  };

  const saveEdit = async (email_id: string) => {
    if (!editEmail) {
      setAlertMsg("Email tidak boleh kosong");
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(editEmail)) {
      setAlertMsg("Format email tidak valid");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/email/${email_id}`,
        { email: editEmail },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      setEditId(null);
      setEditEmail("");
      fetchEmails();
    } catch (err: any) {
      setAlertMsg(err?.response?.data?.message || "Gagal update email");
    }
  };

  const handleDeleteEmail = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/email/${deleteId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchEmails();
    } catch (err: any) {
      setAlertMsg(err?.response?.data?.message || "Gagal menghapus email");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Semua Email
      </h2>
      {/* Form tambah email */}
      {/* <div className="flex gap-2 mb-4">
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Tambah Email"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1 rounded"
          onClick={handleAddEmail}
        >
          Add
        </button>
      </div> */}
      {loading && (
        <ThreeDot color="#32cd32" size="medium" text="" textColor="" />
      )}
      {emails.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {emails.map((e) => (
            <div
              key={e.email_id}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow transition-all"
            >
              {editId === e.email_id ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
                    value={editEmail}
                    onChange={(ev) => setEditEmail(ev.target.value)}
                    placeholder="Email"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                      onClick={() => saveEdit(e.email_id)}
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
                    {e.email}
                  </div>
                  {/* <div className="text-xs text-gray-500 mt-1">
                    Dibuat: {new Date(e.created_at).toLocaleString()}
                  </div> */}
                  <div className="flex gap-2 mt-3">
                    <button
                      className="px-2 w-full h-8 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-all"
                      onClick={() => startEdit(e)}
                    >
                      Edit
                    </button>
                    {/* <button
                      className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-all"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setDeleteId(e.email_id);
                      }}
                    >
                      Hapus
                    </button> */}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-gray-500 dark:text-gray-400">
            Belum ada email tersedia.
          </div>
        )
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in-up min-w-[300px]">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Konfirmasi Hapus
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Apakah kamu yakin ingin menghapus email ini?
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
                onClick={handleDeleteEmail}
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