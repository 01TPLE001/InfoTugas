import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import Cookies from "js-cookie";

interface Week {
  week_id: number;
  week_number: number;
  semester_id: number;
  semester_number: number;
}

interface Semester {
  semester_id: number;
  semester_number: number;
}

export default function WeekSidebar() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllWeeksFromAllSemesters();
  }, []);

  const fetchAllWeeksFromAllSemesters = async () => {
    setLoading(true);
    const allWeeks: Week[] = [];
    const token = Cookies.get("token");

    try {
      const semesterRes = await axios.get(`${API_URL}/semester`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const semesters: Semester[] = semesterRes.data.data;

      for (const semester of semesters) {
        try {
          const res = await axios.get(`${API_URL}/week/${semester.semester_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (Array.isArray(res.data.data)) {
            const weeksWithSemester = res.data.data.map((w: any) => ({
              ...w,
              semester_id: semester.semester_id,
              semester_number: w.semester_number ?? semester.semester_number ?? semester.semester_id,
            }));
            allWeeks.push(...weeksWithSemester);
          }
        } catch (error) {
          console.error(`Gagal fetch week untuk semester ${semester.semester_id}`, error);
        }
      }

      allWeeks.sort(
        (a, b) =>
          a.semester_number - b.semester_number ||
          a.week_number - b.week_number
      );
      setWeeks(allWeeks);
    } catch (error) {
      console.error("Gagal mengambil daftar semester", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedWeeks = weeks.reduce((acc: Record<number, Week[]>, week) => {
    if (!acc[week.semester_number]) acc[week.semester_number] = [];
    acc[week.semester_number].push(week);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Semua Week
      </h2>
      {loading && (
        <ThreeDot color="#32cd32" size="medium" text="" textColor="" />
      )}
      {Object.keys(groupedWeeks).length > 0 ? (
        Object.keys(groupedWeeks)
          .sort((a, b) => Number(a) - Number(b))
          .map((semesterNum) => (
            <div key={semesterNum} className="mb-6">
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Semester {semesterNum}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groupedWeeks[Number(semesterNum)].map((w) => (
                  <div
                    key={w.week_id}
                    className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                    onClick={() => {
                      const role = Cookies.get("role");
                      if (role === "admin") {
                        navigate(`/task/${w.semester_id}/${w.week_id}`);
                      } else if (role === "user") {
                        navigate(`/task-user/${w.semester_id}/${w.week_id}`);
                      } else {
                        navigate("/");
                      }
                    }}
                  >
                    <span className="text-xs text-blue-500">Week {w.week_number}</span>
                  </div>
                ))}
              </div>
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
  );
}
