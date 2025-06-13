import { useNavigate } from "react-router-dom";

const FloatingNav = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-4 right-4 flex flex-row gap-3 z-50">
      {/* Tombol Kembali */}
      <div className="relative flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="group bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full shadow-xl w-10 h-10 flex items-center justify-center text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800"
          title="Kembali"
        >
          <span className="sr-only">Kembali</span>
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* Tooltip */}
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 rounded bg-blue-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          Kembali
        </span>
      </div>
      {/* Tombol Maju */}
      <div className="relative flex items-center">
        <button
          onClick={() => navigate(1)}
          className="group bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full shadow-xl w-10 h-10 flex items-center justify-center text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-800"
          title="Maju"
        >
          <span className="sr-only">Maju</span>
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* Tooltip */}
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          Maju
        </span>
      </div>
    </div>
  );
};

export default FloatingNav;