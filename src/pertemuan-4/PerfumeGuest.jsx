import { useState } from "react";
import perfumeData from "./Perfume.json";

export default function PerfumeGuest() {
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
      perfume.description.toLowerCase().includes(_searchTerm);

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-800 to-amber-800 text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-8xl">🌸</div>
          <div className="absolute top-8 right-16 text-6xl">✨</div>
          <div className="absolute bottom-4 left-1/3 text-7xl">🌿</div>
          <div className="absolute top-2 right-1/3 text-5xl">💫</div>
        </div>
        <div className="relative z-10">
          <p className="text-rose-300 text-sm tracking-[0.3em] uppercase mb-2 font-light">
            Discover Your Signature
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
            Essence
            <span className="text-rose-300 italic font-light"> Collection</span>
          </h1>
          <p className="text-rose-200 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Curated luxury fragrances from the world's finest perfume houses
          </p>
          <div className="mt-4 flex justify-center gap-6 text-rose-300 text-sm">
            <span>✦ {perfumeData.length} Fragrances</span>
            <span>✦ Worldwide Origins</span>
            <span>✦ Premium Quality</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md shadow-md border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400 text-lg">
                🔍
              </span>
              <input
                type="text"
                name="searchTerm"
                value={dataForm.searchTerm}
                onChange={handleChange}
                placeholder="Search by name, brand, or description..."
                className="w-full pl-10 pr-4 py-2.5 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm bg-rose-50/50"
              />
            </div>

            {/* Filter Category */}
            <select
              name="selectedCategory"
              value={dataForm.selectedCategory}
              onChange={handleChange}
              className="px-4 py-2.5 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm bg-rose-50/50 text-gray-700 md:w-44"
            >
              <option value="">All Categories</option>
              {allCategories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Filter Gender */}
            <select
              name="selectedGender"
              value={dataForm.selectedGender}
              onChange={handleChange}
              className="px-4 py-2.5 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm bg-rose-50/50 text-gray-700 md:w-36"
            >
              <option value="">All Gender</option>
              {allGenders.map((g, i) => (
                <option key={i} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Result count */}
          <p className="text-xs text-rose-500 mt-2 pl-2">
            Showing{" "}
            <span className="font-semibold">{filteredPerfumes.length}</span> of{" "}
            {perfumeData.length} fragrances
          </p>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-20 text-rose-400">
            <div className="text-6xl mb-4">🌸</div>
            <p className="text-xl font-medium">No fragrances found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPerfumes.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-rose-50 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-52">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Gender badge */}
                  <span
                    className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${
                      item.gender === "Women"
                        ? "bg-pink-500 text-white"
                        : item.gender === "Men"
                        ? "bg-blue-600 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {item.gender}
                  </span>

                  {/* Category badge */}
                  <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium bg-white/90 text-rose-700 shadow-sm">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-rose-400 font-medium tracking-wide uppercase mb-0.5">
                    {item.brand}
                  </p>
                  <h3 className="text-base font-bold text-gray-800 mb-1 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Details (nested) */}
                  <div className="bg-rose-50 rounded-xl p-2.5 mb-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Volume</span>
                      <span className="font-medium text-gray-700">
                        {item.details.volume}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Type</span>
                      <span className="font-medium text-gray-700">
                        {item.details.concentration}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Longevity</span>
                      <span className="font-medium text-gray-700">
                        {item.details.longevity}
                      </span>
                    </div>
                  </div>

                  {/* Origin (nested) */}
                  <p className="text-xs text-gray-400 mb-3">
                    🌍 {item.origin.city}, {item.origin.country}
                  </p>

                  {/* Top Notes (nested) */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-1">Top Notes:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.notes.top.map((note, i) => (
                        <span
                          key={i}
                          className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-rose-700">
                      {formatPrice(item.price)}
                    </span>
                    <button className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-full hover:bg-rose-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
