import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Atom } from "react-loading-indicators";

interface Week {
  week_id: number;
  week_number: number;
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
    const totalSemester = 100; // Ganti sesuai jumlah semester di postman
    const allWeeks: Week[] = [];

    for (let semesterId = 1; semesterId <= totalSemester; semesterId++) {
      try {
        const res = await axios.get(`${API_URL}/week/${semesterId}`);
        if (Array.isArray(res.data.data)) {
          // Tambahkan semester_number ke setiap week jika belum ada
          const weeksWithSemester = res.data.data.map((w: any) => ({
            ...w,
            semester_id: semesterId,
            semester_number: w.semester_number ?? semesterId, // fallback jika backend tidak kirim semester_number
          }));
          allWeeks.push(...weeksWithSemester);
        }
      } catch (error) {
        console.error(`Gagal fetch semester ${semesterId}`, error);
      }
    }

    // Urutkan berdasarkan semester_number dan week_number
    allWeeks.sort(
      (a, b) =>
        a.semester_number - b.semester_number ||
        a.week_number - b.week_number
    );

    setWeeks(allWeeks);
    setLoading(false);
  };

  // Kelompokkan week berdasarkan semester_number
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
      {loading && <div>      {loading && (
        <Atom color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} text="LOADING" />
      )}</div>}
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
                    onClick={() => navigate(`/task/${w.semester_id}/${w.week_id}`)}
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