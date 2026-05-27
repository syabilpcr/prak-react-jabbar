import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import FeedbackModal from "../components/FeedbackModal";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Trash2,
  Reply,
  Loader,
} from "lucide-react";

// ── Components Pertemuan 10 ───────────────────────────────────
import SearchBar from "../components/SearchBar";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

// Import data dari file JSON
import feedbackData from "../data/feedbackData.js";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Load data dari JSON saat komponen mount
  useEffect(() => {
    // Ambil data dari file feedbackData.js
    const data = Array.isArray(feedbackData)
      ? feedbackData
      : feedbackData.feedbacks || feedbackData.data || [];
    setFeedbacks(data);
    setLoading(false);
  }, []);

  const handleAddFeedback = (newFeedback) => {
    const fb = {
      id: `FB-${String(feedbacks.length + 1).padStart(3, "0")}`,
      memberName: "Anggota Anonim",
      ...newFeedback,
      date: new Date().toISOString().split("T")[0],
      status: "Dipublikasikan",
      replies: 0,
    };
    setFeedbacks([fb, ...feedbacks]);
  };

  const handleReply = (feedback) =>
    alert(`Balasan untuk umpan balik dari ${feedback.memberName}`);

  const handleDelete = (id) =>
    setFeedbacks(feedbacks.filter((f) => f.id !== id));

  const filtered = feedbacks
    .filter((f) => filter === "all" || f.rating === parseInt(filter))
    .filter(
      (f) =>
        f.memberName?.toLowerCase().includes(search.toLowerCase()) ||
        f.comment?.toLowerCase().includes(search.toLowerCase()),
    );

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        ).toFixed(1)
      : 0;
  const totalFeedbacks = feedbacks.length;
  const satisfactionRate =
    feedbacks.length > 0 ? ((avgRating / 5) * 100).toFixed(0) : 0;

  // Hitung distribusi rating
  const ratingDistribution = {
    5: feedbacks.filter((f) => f.rating === 5).length,
    4: feedbacks.filter((f) => f.rating === 4).length,
    3: feedbacks.filter((f) => f.rating === 3).length,
    2: feedbacks.filter((f) => f.rating === 2).length,
    1: feedbacks.filter((f) => f.rating === 1).length,
  };

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader
            size={40}
            className="text-[#8E1616] animate-spin mx-auto mb-4"
          />
          <p className="text-gray-500">Memuat data umpan balik...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Umpan Balik Anggota"
        breadcrumb={["Manajemen", "Umpan Balik"]}
      >
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30"
        >
          <MessageCircle size={14} /> Tulis Umpan Balik
        </button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Rata-rata Rating
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={20} className="fill-[#D84040] text-[#D84040]" />
                <p className="text-2xl font-bold text-[#1D1616]">{avgRating}</p>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Dari 5.0</p>
            </div>
            <div className="w-10 h-10 bg-[#D84040]/10 rounded-xl flex items-center justify-center">
              <Star size={20} className="text-[#D84040]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Total Umpan Balik
              </p>
              <p className="text-2xl font-bold text-[#1D1616] mt-1">
                {totalFeedbacks}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">Semua ulasan</p>
            </div>
            <div className="w-10 h-10 bg-[#8E1616]/10 rounded-xl flex items-center justify-center">
              <MessageCircle size={20} className="text-[#8E1616]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Tingkat Kepuasan
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {satisfactionRate}%
              </p>
              <p className="text-[10px] text-gray-500 mt-1">Member puas</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <ThumbsUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">
                Rating Tertinggi
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={20} className="fill-[#D84040] text-[#D84040]" />
                <p className="text-2xl font-bold text-[#1D1616]">5</p>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {ratingDistribution[5]} ulasan
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution Bar */}
      <div className="bg-white rounded-2xl p-5 mb-6 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-[#1D1616] mb-4">
          Distribusi Rating
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rate) => {
            const count = ratingDistribution[rate];
            const percentage =
              totalFeedbacks > 0 ? (count / totalFeedbacks) * 100 : 0;
            return (
              <div key={rate} className="flex items-center gap-3">
                <div className="w-12 flex items-center gap-1">
                  <span className="text-xs font-semibold text-gray-600">
                    {rate}
                  </span>
                  <Star size={10} className="fill-[#D84040] text-[#D84040]" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8E1616] to-[#D84040] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-12 text-right">
                  <span className="text-xs text-gray-500">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {["all", "5", "4", "3", "2", "1"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f
                    ? "bg-[#8E1616] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "Semua" : `⭐ ${f}`}
              </button>
            ))}
          </div>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari umpan balik..."
            className="w-44"
          />
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#8E1616]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={feedback.memberName || "A"} size="md" />
                  <div>
                    <p className="font-semibold text-[#1D1616]">
                      {feedback.memberName}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < feedback.rating
                              ? "fill-[#D84040] text-[#D84040]"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">{feedback.date}</p>
                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold mt-1 bg-green-100 text-green-700">
                    {feedback.status || "Dipublikasikan"}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4 pl-13">
                {feedback.comment}
              </p>
              <div className="flex items-center gap-4 mt-4 pl-13">
                <button
                  onClick={() => handleReply(feedback)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#8E1616] transition-colors"
                >
                  <Reply size={12} /> Balas ({feedback.replies || 0})
                </button>
                <button
                  onClick={() => handleDelete(feedback.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={12} /> Hapus
                </button>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ThumbsUp size={12} /> Membantu
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon="💬"
            title="Tidak ada umpan balik ditemukan"
            message="Coba dengan kata kunci lain atau hapus filter"
          />
        )}
      </div>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleAddFeedback}
      />
    </div>
  );
};

export default Feedback;
