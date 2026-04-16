import { useState } from "react";
import SearchModal from "../components/SearchModal";
import NotificationDropdown from "../components/NotificationDropdown";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>

        <div className="flex items-center gap-3">
          {/* Search Button — Improvisasi 1 */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-3 py-2 rounded-xl text-sm text-gray-500"
          >
            <svg
              className="w-4 h-4"
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
            Cari...
          </button>

          {/* Notification — Improvisasi 3 */}
          <NotificationDropdown />

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;