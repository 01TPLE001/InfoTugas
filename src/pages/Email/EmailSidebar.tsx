import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ThreeDot } from "react-loading-indicators";
import AlertCard from "../../components/Alert/alert";

interface UserData {
  user_id: string;
  nim: string;
  role: string;
}

interface EmailData {
  email_id: string;
  email: string;
  user_id: string;
}

interface MemberData {
  user_id: string;
  nim: string;
  role: string;
  email: string | null;
  email_id: string | null;
}

export default function EmailSidebar() {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // State untuk tambah user
  const [newNim, setNewNim] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // State untuk edit email
  const [editEmailId, setEditEmailId] = useState<string | null>(null);
  const [editEmailValue, setEditEmailValue] = useState("");
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const [userRes, emailRes] = await Promise.all([
        axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }),
        axios.get(`${API_URL}/email`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }),
      ]);
      const users: UserData[] = userRes.data.data;
      const emails: EmailData[] = emailRes.data.data;

      // Gabungkan user dengan email berdasarkan user_id
      const members: MemberData[] = users.map((u) => {
        const emailObj = emails.find((e) => e.user_id === u.user_id);
        return {
          user_id: u.user_id,
          nim: u.nim,
          role: u.role,
          email: emailObj ? emailObj.email : null,
          email_id: emailObj ? emailObj.email_id : null,
        };
      });
      setMembers(members);
    } catch (error) {
      setMembers([]);
      setAlertMsg("Gagal mengambil data anggota");
    }
    setLoading(false);
  };

  // Tambah user baru
  const handleAddUser = async () => {
    if (!newNim || !newEmail || !newPassword) {
      setAlertMsg("NIM, Email, dan Password tidak boleh kosong");
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(newEmail)) {
      setAlertMsg("Format email tidak valid");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/user/auth/register`,
        { nim: newNim, email: newEmail, password: newPassword },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      setNewNim("");
      setNewEmail("");
      setNewPassword("");
      fetchMembers();
    } catch (err: any) {
      setAlertMsg(err?.response?.data?.message || "Gagal menambah user");
    }
  };

  // Mulai edit email
  const startEditEmail = (member: MemberData) => {
    setEditEmailId(member.email_id);
    setEditUserId(member.user_id);
    setEditEmailValue(member.email || "");
  };

  // Simpan email (edit atau tambah)
  const saveEditEmail = async () => {
    if (!editUserId) return;
    if (!editEmailValue) {
      setAlertMsg("Email tidak boleh kosong");
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(editEmailValue)) {
      setAlertMsg("Format email tidak valid");
      return;
    }
    try {
      if (editEmailId) {
        // Update email
        await axios.put(
          `${API_URL}/email/${editEmailId}`,
          { email: editEmailValue },
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
      } else {
        // Tambah email baru untuk user ini
        await axios.post(
          `${API_URL}/email`,
          { email: editEmailValue, user_id: editUserId },
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
      }
      setEditEmailId(null);
      setEditUserId(null);
      setEditEmailValue("");
      fetchMembers();
    } catch (err: any) {
      setAlertMsg(err?.response?.data?.message || "Gagal menyimpan email");
    }
  };

  const cancelEditEmail = () => {
    setEditEmailId(null);
    setEditUserId(null);
    setEditEmailValue("");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Semua Anggota
      </h2>
      {/* Form tambah user */}

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newNim}
          onChange={(e) => setNewNim(e.target.value)}
          placeholder="NIM"
        />
        <input
          type="password"
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1 rounded"
          onClick={handleAddUser}
        >
          Tambah User
        </button>
      </div>
      {loading && (
        <ThreeDot color="#32cd32" size="medium" text="" textColor="" />
      )}
      {members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((m) => (
            <div
              key={m.user_id}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow transition-all"
            >
              <div className="font-semibold text-blue-700 dark:text-blue-300 break-all">
                NIM: {m.nim}
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100 break-all">
                Email:{" "}
                {editUserId === m.user_id ? (
                  <span>
                    <input
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded"
                      value={editEmailValue}
                      onChange={(e) => setEditEmailValue(e.target.value)}
                      placeholder="Email"
                    />
                    <button
                      className="ml-2 px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                      onClick={saveEditEmail}
                    >
                      Simpan
                    </button>
                    <button
                      className="ml-2 px-2 py-1 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded"
                      onClick={cancelEditEmail}
                    >
                      Batal
                    </button>
                  </span>
                ) : (
                  <>
                    {m.email || (
                      <span className="italic text-gray-400">
                        Belum ada email
                      </span>
                    )}
                    <button
                      className="ml-2 px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      onClick={() => startEditEmail(m)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Role: {m.role}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-gray-500 dark:text-gray-400">
            Belum ada anggota tersedia.
          </div>
        )
      )}
      <AlertCard
        open={!!alertMsg}
        message={alertMsg}
        onClose={() => setAlertMsg(null)}
      />
    </div>
  );
}