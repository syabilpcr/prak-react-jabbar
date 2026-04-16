import { useState } from "react";

const notifications = [
  {
    id: 1,
    title: "Pengguna baru mendaftar",
    desc: "Ahmad Fauzi baru saja mendaftar.",
    time: "2 menit lalu",
    read: false,
  },
  {
    id: 2,
    title: "Laporan siap diunduh",
    desc: "Laporan bulanan April sudah tersedia.",
    time: "1 jam lalu",
    read: false,
  },
  {
    id: 3,
    title: "Server maintenance",
    desc: "Jadwal maintenance malam ini pukul 00.00.",
    time: "3 jam lalu",
    read: true,
  },
];

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-700 text-sm">
              Notifikasi
            </span>
            <button
              onClick={markAllRead}
              className="text-xs text-blue-500 hover:underline"
            >
              Tandai semua dibaca
            </button>
          </div>

          <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {notifs.map((n) => (
              <li
                key={n.id}
                className={`px-4 py-3 flex gap-3 hover:bg-gray-50 transition ${
                  !n.read ? "bg-blue-50" : ""
                }`}
              >
                <div
                  className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    !n.read ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <button className="text-xs text-blue-500 hover:underline">
              Lihat semua notifikasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;