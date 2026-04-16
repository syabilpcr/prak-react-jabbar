import { useState, useEffect } from "react";

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");

  const suggestions = [
    "Dashboard Overview",
    "Laporan Penjualan",
    "Data Pengguna",
    "Pengaturan Akun",
    "Manajemen Produk",
  ];

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fadeScale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <svg
            className="w-5 h-5 text-gray-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Cari sesuatu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-gray-700 text-sm"
          />
          <button
            onClick={onClose}
            className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <ul className="py-2 max-h-64 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition"
              >
                <span className="text-blue-400">→</span>
                {item}
              </li>
            ))
          ) : (
            <li className="px-4 py-4 text-center text-gray-400 text-sm">
              Tidak ada hasil untuk "{query}"
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchModal;