import { useState } from "react";
import perfumeData from "./Perfume.json";

export default function PerfumeAdmin() {
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    selectedCategory: "",
    selectedGender: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  // Logic search & filter
  const _searchTerm = dataForm.searchTerm.toLowerCase();
  const filteredPerfumes = perfumeData.filter((perfume) => {
    const matchesSearch =
      perfume.name.toLowerCase().includes(_searchTerm) ||
      perfume.brand.toLowerCase().includes(_searchTerm) ||
      perfume.description.toLowerCase().includes(_searchTerm) ||
      perfume.origin.country.toLowerCase().includes(_searchTerm);

    const matchesCategory = dataForm.selectedCategory
      ? perfume.category === dataForm.selectedCategory
      : true;

    const matchesGender = dataForm.selectedGender
      ? perfume.gender === dataForm.selectedGender
      : true;

    return matchesSearch && matchesCategory && matchesGender;
  });

  // Unique categories & genders
  const allCategories = [...new Set(perfumeData.map((p) => p.category))];
  const allGenders = [...new Set(perfumeData.map((p) => p.gender))];

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Admin Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">
              Perfume Admin Panel
            </h1>
            <p className="text-gray-400 text-xs">Fragrance Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">
            ● Online
          </span>
          <span className="text-gray-400 text-sm">Admin</span>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Total Products</p>
            <p className="text-2xl font-bold text-white">{perfumeData.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Categories</p>
            <p className="text-2xl font-bold text-rose-400">
              {allCategories.length}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Filtered Results</p>
            <p className="text-2xl font-bold text-amber-400">
              {filteredPerfumes.length}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Avg Price</p>
            <p className="text-lg font-bold text-green-400">
              {formatPrice(
                Math.round(
                  perfumeData.reduce((s, p) => s + p.price, 0) /
                    perfumeData.length
                )
              )}
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-300 mb-3">
            🔍 Search & Filter
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              name="searchTerm"
              value={dataForm.searchTerm}
              onChange={handleChange}
              placeholder="Search name, brand, description, country..."
              className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-gray-100 placeholder-gray-500"
            />
            <select
              name="selectedCategory"
              value={dataForm.selectedCategory}
              onChange={handleChange}
              className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-gray-100 md:w-44"
            >
              <option value="">All Categories</option>
              {allCategories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              name="selectedGender"
              value={dataForm.selectedGender}
              onChange={handleChange}
              className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-gray-100 md:w-36"
            >
              <option value="">All Gender</option>
              {allGenders.map((g, i) => (
                <option key={i} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-300">
              Perfume Data Table
            </h2>
            <span className="text-xs text-gray-500">
              {filteredPerfumes.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800/60 border-b border-gray-700">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider w-10">
                    No
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Concentration
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Longevity
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Top Notes
                  </th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredPerfumes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="text-center py-12 text-gray-500"
                    >
                      No data found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredPerfumes.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      {/* No */}
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {index + 1}
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-700"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1541643600914-78b084683702?w=100&h=100&fit=crop";
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-100 whitespace-nowrap">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 max-w-[160px] truncate">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap text-xs">
                        {item.brand}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="bg-rose-900/50 text-rose-300 text-xs px-2 py-1 rounded-md border border-rose-800/50 whitespace-nowrap">
                          {item.category}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-md border whitespace-nowrap ${
                            item.gender === "Women"
                              ? "bg-pink-900/40 text-pink-300 border-pink-800/50"
                              : item.gender === "Men"
                              ? "bg-blue-900/40 text-blue-300 border-blue-800/50"
                              : "bg-purple-900/40 text-purple-300 border-purple-800/50"
                          }`}
                        >
                          {item.gender}
                        </span>
                      </td>

                      {/* Volume (nested: details) */}
                      <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">
                        {item.details.volume}
                      </td>

                      {/* Concentration (nested: details) */}
                      <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">
                        {item.details.concentration}
                      </td>

                      {/* Longevity (nested: details) */}
                      <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">
                        {item.details.longevity}
                      </td>

                      {/* Origin (nested: origin) */}
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <p className="text-gray-300">{item.origin.city}</p>
                        <p className="text-gray-500">{item.origin.country}</p>
                      </td>

                      {/* Top Notes (nested: notes.top - array) */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {item.notes.top.map((note, i) => (
                            <span
                              key={i}
                              className="text-xs bg-amber-900/40 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/40 whitespace-nowrap"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Tags (array) */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {item.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-right font-semibold text-green-400 text-xs whitespace-nowrap">
                        {formatPrice(item.price)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
