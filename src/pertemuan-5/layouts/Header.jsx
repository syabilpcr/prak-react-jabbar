import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";

export default function Header() {
  return (
    <div className="flex items-center justify-between p-4">

      {/* Search */}
      <div className="relative w-full max-w-lg">
        <input
          type="text"
          placeholder="Search Here..."
          className="w-full max-w-lg rounded-md border border-gray-100 bg-white p-2 pr-10 outline-none"
        />

        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-300" />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4">

        <div className="relative cursor-pointer rounded-2xl bg-blue-100 p-3 text-blue-500">
          <FaBell />
          <span className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200 px-2 py-1 text-xs">
            50
          </span>
        </div>

        <div className="cursor-pointer rounded-2xl bg-blue-100 p-3">
          <FcAreaChart />
        </div>

        <div className="cursor-pointer rounded-2xl bg-red-100 p-3 text-red-500">
          <SlSettings />
        </div>

        <div className="flex items-center space-x-4 border-l border-gray-300 pl-4">
          <span>
            Hello, <b>Fikri Muhaffizh</b>
          </span>

          <img
            src="https://avatar.iran.liara.run/public/28"
            className="h-10 w-10 rounded-full"
          />
        </div>

      </div>
    </div>
  );
}