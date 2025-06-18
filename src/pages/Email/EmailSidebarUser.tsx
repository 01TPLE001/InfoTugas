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

export default function EmailSidebarUser() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
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


  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Semua Email
      </h2>
      {loading && (
        <ThreeDot color="#32cd32" size="medium" text="" textColor="" />
      )}

      <AlertCard
        open={!!alertMsg}
        message={alertMsg}
        onClose={() => setAlertMsg(null)}
      />
    </div>
  );
}