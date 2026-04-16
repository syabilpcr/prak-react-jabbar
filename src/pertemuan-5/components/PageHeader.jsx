export default function PageHeader() {
  return (
    <div className="flex items-center justify-between p-4">

      {/* Left */}
      <div className="flex flex-col">
        {/* Title */}
        <span className="text-[32px] font-semibold text-gray-800">
          Dashboard
        </span>

        {/* Breadcrumb */}
        <div className="mt-2 flex items-center space-x-2 text-sm font-medium">
          <span className="text-gray-400 hover:text-hijau cursor-pointer">
            Home
          </span>

          <span className="text-gray-300">/</span>

          <span className="text-gray-400 hover:text-hijau cursor-pointer">
            Home Detail
          </span>

          <span className="text-gray-300">/</span>

          <span className="text-gray-400">
            Home Very Detail
          </span>
        </div>
      </div>

    </div>
  );
}