import { useState, useEffect } from "react";
import FeedbackModal from "../../components/FeedbackModal";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Trash2,
  Reply,
  Loader,
} from "lucide-react";

// ── Components ────────────────────────────────────────────────
import SearchBar from "../../components/SearchBar";
import Badge from "../../components/Badge";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import StatCard from "../../components/StatCard";
import ProgressBar from "../../components/ProgressBar";
import EmptyState from "../../components/EmptyState";

// Import data dari file JSON
import feedbackData from "../../data/feedbackData.js";

const MemberFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const data = Array.isArray(feedbackData)
      ? feedbackData
      : feedbackData.feedbacks || feedbackData.data || [];

    // jadikan update state asynchronous untuk menghindari react-hooks/set-state-in-effect
    queueMicrotask(() => {
      setFeedbacks(data);
      setLoading(false);
    });
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

  const handleReply = (feedback) => {
    alert(`Balasan untuk umpan balik dari ${feedback.memberName}`);
  };

  const handleDelete = (id) => {
    setFeedbacks(feedbacks.filter((f) => f.id !== id));
  };

  const filtered = feedbacks
    .filter((f) => filter === "all" || f.rating === parseInt(filter))
    .filter(
      (f) =>
        f.memberName?.toLowerCase().includes(search.toLowerCase()) ||
        f.comment?.toLowerCase().includes(search.toLowerCase()),
    );

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0;
  const totalFeedbacks = feedbacks.length;
  const satisfactionRate =
    feedbacks.length > 0 ? ((avgRating / 5) * 100).toFixed(0) : 0;

  const ratingDistribution = {
    5: feedbacks.filter((f) => f.rating === 5).length,
    4: feedbacks.filter((f) => f.rating === 4).length,
    3: feedbacks.filter((f) => f.rating === 3).length,
    2: feedbacks.filter((f) => f.rating === 2).length,
    1: feedbacks.filter((f) => f.rating === 1).length,
  };

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
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">Umpan Balik</h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">
            Kelola umpan balik dan ulasan anggota
          </p>
        </div>
        <Button
          type="primary"
          icon={MessageCircle}
          onClick={() => setShowFeedbackModal(true)}
        >
          Tulis Umpan Balik
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Star}
          label="Rata-rata Rating"
          value={avgRating}
          change="+0.3"
          trend="up"
          sub="dari 5.0"
        />
        <StatCard
          icon={MessageCircle}
          label="Total Umpan Balik"
          value={totalFeedbacks}
          change="+8.5%"
          trend="up"
          sub="semua ulasan"
        />
        <StatCard
          icon={ThumbsUp}
          label="Tingkat Kepuasan"
          value={`${satisfactionRate}%`}
          change="+2.1%"
          trend="up"
          sub="member puas"
        />
        <StatCard
          icon={Star}
          label="Rating Tertinggi"
          value={`⭐ 5`}
          change={`${ratingDistribution[5]}`}
          trend="up"
          sub="ulasan bintang 5"
        />
      </div>

      <div
        className="bg-white rounded-2xl border border-gray-100 p-5"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <p className="text-sm font-bold text-[#1D1616] mb-4">Distribusi Rating</p>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rate) => {
            const count = ratingDistribution[rate];
            const percentage =
              totalFeedbacks > 0 ? Math.round((count / totalFeedbacks) * 100) : 0;
            return (
              <ProgressBar
                key={rate}
                label={`⭐ ${rate}`}
                value={percentage}
                max={100}
              />
            );
          })}
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border border-gray-100 p-4"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {["all", "5", "4", "3", "2", "1"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f
                    ? "bg-[#8C1007] text-[#FFF0C4]"
                    : "bg-[#f8f3ee] text-[#5a3030] border border-[#e8dfd6] hover:bg-[#f0e8e4]"
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
            className="w-48"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={feedback.memberName || "A"} size="md" />
                  <div>
                    <p className="font-semibold text-[#1D1616]">{feedback.memberName}</p>
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
                  <p className="text-[10px] text-[#9e7a6e]">{feedback.date}</p>
                  <Badge type="success" dot>
                    {feedback.status || "Dipublikasikan"}
                  </Badge>
                </div>
              </div>
              <p className="text-[#5a3030] text-sm mt-4">{feedback.comment}</p>
              <div className="flex items-center gap-4 mt-4">
                <Button
                  type="ghost"
                  size="sm"
                  icon={Reply}
                  onClick={() => handleReply(feedback)}
                >
                  Balas ({feedback.replies || 0})
                </Button>
                <Button
                  type="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(feedback.id)}
                >
                  Hapus
                </Button>
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

export default MemberFeedback;

