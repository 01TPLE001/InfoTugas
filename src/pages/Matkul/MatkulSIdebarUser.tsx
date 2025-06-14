import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ThreeDot } from "react-loading-indicators";

interface MatkulData {
  matkul_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function MatkulSidebar() {
  const [matkuls, setMatkuls] = useState<MatkulData[]>([]);
  const [loading, setLoading] = useState(false);
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
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Semua Mata Kuliah
      </h2>
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
              <div className="font-semibold text-blue-700 dark:text-blue-300 break-all">
                {m.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Dibuat: {new Date(m.created_at).toLocaleString()}
              </div>
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
    </div>
  );
}