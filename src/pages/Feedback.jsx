import { useState } from "react";
import PageHeader from "../components/PageHeader";
import FeedbackModal from "../components/FeedbackModal";
import {
  Search,
  Star,
  ThumbsUp,
  MessageCircle,
  Trash2,
  Reply,
} from "lucide-react";

const initialFeedbacks = [
  {
    id: "FB-001",
    memberName: "Alex Johnson",
    rating: 5,
    comment: "Gym yang bagus! Peralatan luar biasa dan pelatih handal.",
    date: "2024-12-09",
    status: "Dipublikasikan",
    replies: 0,
  },
  {
    id: "FB-002",
    memberName: "Sarah Williams",
    rating: 4,
    comment: "Fasilitas bersih, staf ramah. Sangat direkomendasikan!",
    date: "2024-12-08",
    status: "Dipublikasikan",
    replies: 0,
  },
  {
    id: "FB-003",
    memberName: "Mike Chen",
    rating: 3,
    comment: "Bagus tapi parkir terbatas.",
    date: "2024-12-07",
    status: "Menunggu",
    replies: 0,
  },
  {
    id: "FB-004",
    memberName: "Jessica Lee",
    rating: 5,
    comment: "Gym terbaik di kota! Suka suasananya.",
    date: "2024-12-06",
    status: "Dipublikasikan",
    replies: 1,
  },
  {
    id: "FB-005",
    memberName: "David Kim",
    rating: 2,
    comment: "Peralatan perlu perawatan.",
    date: "2024-12-05",
    status: "Menunggu",
    replies: 0,
  },
];

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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
    .filter(
      (f) =>
        filter === "all" ||
        f.rating === parseInt(filter) ||
        f.status.toLowerCase() === filter,
    )
    .filter(
      (f) =>
        f.memberName.toLowerCase().includes(search.toLowerCase()) ||
        f.comment.toLowerCase().includes(search.toLowerCase()),
    );
  const avgRating = (
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
  ).toFixed(1);
  const totalFeedbacks = feedbacks.length;

  return (
    <div>
      <PageHeader
        title="Umpan Balik Anggota"
        breadcrumb={["Manajemen", "Umpan Balik"]}
      >
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold px-4 py-2 rounded-xl transition-all text-xs shadow-md shadow-[#8E1616]/30"
        >
          <MessageCircle size={14} /> Tulis Umpan Balik
        </button>
      </PageHeader>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <p className="text-xs text-gray-400">Rata-rata Rating</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Star size={20} className="fill-[#D84040] text-[#D84040]" />
            <p className="text-2xl font-bold text-[#1D1616]">{avgRating}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <p className="text-xs text-gray-400">Total Umpan Balik</p>
          <p className="text-2xl font-bold text-[#1D1616]">{totalFeedbacks}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <p className="text-xs text-gray-400">Tingkat Kepuasan</p>
          <p className="text-2xl font-bold text-green-600">
            {((avgRating / 5) * 100).toFixed(0)}%
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {["all", "5", "4", "3", "2", "1", "menunggu"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-[#8E1616] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {f === "all"
                  ? "Semua"
                  : f === "menunggu"
                    ? "Menunggu"
                    : `⭐ ${f}`}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari umpan balik..."
              className="pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] w-44"
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {filtered.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#8E1616]/30 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8E1616]/20 flex items-center justify-center text-[#8E1616] font-bold">
                  {feedback.memberName.charAt(0)}
                </div>
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
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold mt-1 ${feedback.status === "Dipublikasikan" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {feedback.status}
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
                <Reply size={12} /> Balas ({feedback.replies})
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
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <MessageCircle size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-400">Tidak ada umpan balik ditemukan</p>
          </div>
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
