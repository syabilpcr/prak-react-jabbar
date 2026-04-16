import {
  FaHome,
  FaShoppingCart,
  FaUsers,
  FaPlus,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="flex min-h-screen w-72 flex-col bg-white p-10 shadow-lg">

      {/* Logo */}
      <div className="flex flex-col">
        <span className="font-poppins text-[48px] text-gray-900">
          Sedap<b className="text-hijau">.</b>
        </span>

        <span className="font-semibold text-gray-400">
          Modern Admin Dashboard
        </span>
      </div>

      {/* Menu */}
      <div className="mt-10">
        <ul className="space-y-3">

          <li>
            <div className="flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:text-hijau hover:font-extrabold">
              <FaHome className="mr-4 text-xl" />
              Dashboard
            </div>
          </li>

          <li>
            <div className="flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:text-hijau hover:font-extrabold">
              <FaShoppingCart className="mr-4 text-xl" />
              Orders
            </div>
          </li>

          <li>
            <div className="flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:text-hijau hover:font-extrabold">
              <FaUsers className="mr-4 text-xl" />
              Customers
            </div>
          </li>

        </ul>
      </div>

      {/* Footer */}
      <div className="mt-auto">

        <div className="mb-10 flex items-center rounded-md bg-hijau px-4 py-2 shadow-lg">

          <div className="text-sm text-white">
            <span>Please organize your menus through button below!</span>

            <div className="mt-3 flex items-center justify-center space-x-2 rounded-md bg-white p-2">
              <FaPlus className="text-gray-600" />
              <span className="text-gray-600">Add Menus</span>
            </div>
          </div>

          <img
            src="https://avatar.iran.liara.run/public/28"
            className="w-20 rounded-full"
          />
        </div>

        <span className="font-bold text-gray-400">
          Sedap Restaurant Admin Dashboard
        </span>

        <p className="font-light text-gray-400">
          © 2025 All Right Reserved
        </p>

      </div>
    </div>
  );
}