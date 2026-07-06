import { useState } from "react";
import {
  MessageCircle,
  Star,
  Send,
  ThumbsUp,
  Flame,
  Trophy,
  Sparkles,
  ChevronDown,
  Quote,
} from "lucide-react";

// ── Data ulasan member yang sudah ada (tanpa menyebut kelas & trainer) ─────────────────────────
const existingReviews = [
  {
    id: 1,
    name: "Andi Pratama",
    avatar: "A",
    rating: 5,
    date: "2 hari lalu",
    comment: "Fasilitas gym luar biasa! Peralatan angkat beban sangat lengkap, tertata rapi, dan selalu bersih. Nyaman sekali latihan di sini.",
    likes: 24,
    tag: "Fasilitas",
  },
  {
    id: 2,
    name: "Sari Dewi",
    avatar: "S",
    rating: 5,
    date: "5 hari lalu",
    comment: "Program latihan mandiri di sini terbantu sekali karena mesin kardio dan treadmill-nya modern dan semuanya berfungsi dengan baik. Sangat worth it!",
    likes: 41,
    tag: "Peralatan",
  },
  {
    id: 3,
    name: "Budi Santoso",
    avatar: "B",
    rating: 4,
    date: "1 minggu lalu",
    comment: "Area angkat beban sangat luas. Suasananya mendukung banget untuk latihan fokus. Cuma kadang agak ramai di jam sore sepulang kerja.",
    likes: 15,
    tag: "Suasana",
  },
  {
    id: 4,
    name: "Rina Kusuma",
    avatar: "R",
    rating: 5,
    date: "2 minggu lalu",
    comment: "Locker room dan kamar mandi air hangatnya sangat bersih dan wangi setelah lelah latihan berat. Pelayanan resepsionis juga ramah.",
    likes: 33,
    tag: "Layanan",
  },
  {
    id: 5,
    name: "Denny Kurniawan",
    avatar: "D",
    rating: 4,
    date: "3 minggu lalu",
    comment: "Tempat parkir luas dan lokasi strategis. Locker room rapi. Semoga bisa tambah jam operasional lebih pagi lagi di akhir pekan.",
    likes: 12,
    tag: "Fasilitas",
  },
  {
    id: 6,
    name: "Fitri Handayani",
    avatar: "F",
    rating: 5,
    date: "1 bulan lalu",
    comment: "Best gym in town! Suasana dark-luxury-nya bikin betah latihan berlama-lama tanpa merasa bosan. Pilihan tepat untuk langganan.",
    likes: 56,
    tag: "Suasana",
  },
];

const categories = ["Semua", "Fasilitas", "Peralatan", "Layanan", "Suasana"];

// ── Komponen bintang interaktif ──────────────────────────────
function StarRating({ rating, onRate, interactive = false, size = 20 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          className={`transition-all duration-200 ${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"}`}
          disabled={!interactive}
        >
          <Star
            size={size}
            className={`transition-colors duration-200 ${
              star <= rating
                ? "fill-[#D84040] text-[#D84040]"
                : "text-white/15 hover:text-white/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function MemberFeedback() {
  const [reviews, setReviews] = useState(existingReviews);
  const [filter, setFilter] = useState("Semua");
  const [showForm, setShowForm] = useState(false);
  const [likedIds, setLikedIds] = useState({});

  // ── Form state ──
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formCategory, setFormCategory] = useState("Fasilitas");
  const [submitted, setSubmitted] = useState(false);

  const filtered = reviews.filter(
    (r) => filter === "Semua" || r.tag === filter,
  );

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const toggleLike = (id) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, likes: r.likes + (likedIds[id] ? -1 : 1) }
          : r,
      ),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRating === 0 || !formComment.trim()) return;

    const newReview = {
      id: Date.now(),
      name: "Kamu",
      avatar: "K",
      rating: formRating,
      date: "Baru saja",
      comment: formComment.trim(),
      likes: 0,
      tag: formCategory,
    };

    setReviews([newReview, ...reviews]);
    setFormRating(0);
    setFormComment("");
    setFormCategory("Fasilitas");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  return (
    <div className="bg-[#0b0b0d] min-h-screen px-5 py-24 md:px-10">
      {/* ── Header ── */}
      <div className="max-w-4xl mx-auto animate-slide-up">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-3">
          Suara Member
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">
          Umpan balik<span className="text-[#D84040]">.</span>
        </h1>
        <p className="text-white/45 mt-3 max-w-lg text-[15px]">
          Bagikan pengalamanmu di Zeus Gym. Setiap ulasan membantu kami meningkatkan 
          kualitas fasilitas dan pelayanan untukmu.
        </p>
      </div>

      {/* ── Stats ringkas ── */}
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 mt-8 animate-slide-up delay-100">
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5 text-center hover:border-[#D84040]/30 transition-all duration-300 group">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#8E1616] to-[#D84040] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Star size={22} className="text-white" />
          </div>
          <p className="text-2xl font-black text-white">{avgRating}</p>
          <p className="text-[11px] text-white/40 mt-0.5">Rating Rata-rata</p>
        </div>
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5 text-center hover:border-[#D84040]/30 transition-all duration-300 group">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <MessageCircle size={22} className="text-white" />
          </div>
          <p className="text-2xl font-black text-white">{reviews.length}</p>
          <p className="text-[11px] text-white/40 mt-0.5">Total Ulasan</p>
        </div>
        <div className="bg-[#141416] border border-white/[0.06] rounded-2xl p-5 text-center hover:border-[#D84040]/30 transition-all duration-300 group">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Trophy size={22} className="text-white" />
          </div>
          <p className="text-2xl font-black text-white">
            {reviews.filter((r) => r.rating === 5).length}
          </p>
          <p className="text-[11px] text-white/40 mt-0.5">Bintang 5</p>
        </div>
      </div>

      {/* ── Tulis Ulasan CTA ── */}
      <div className="max-w-4xl mx-auto mt-8 animate-slide-up delay-200">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3E0703] via-[#8E1616] to-[#D84040] p-[1px] transition-all hover:shadow-2xl hover:shadow-[#D84040]/20 cursor-pointer"
        >
          <div className="bg-[#0b0b0d] rounded-2xl px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#D84040]/15 flex items-center justify-center border border-[#D84040]/20 group-hover:bg-[#D84040]/25 transition-colors">
                <Sparkles size={20} className="text-[#D84040]" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">
                  Bagikan Pengalamanmu
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  Tulis ulasan mengenai fasilitas, peralatan, atau pelayanan kami
                </p>
              </div>
            </div>
            <ChevronDown
              size={20}
              className={`text-white/50 transition-transform duration-300 ${showForm ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {/* ── Form ulasan ── */}
        {showForm && (
          <div className="mt-4 bg-[#141416] border border-white/[0.06] rounded-2xl p-6 animate-slide-up">
            {submitted ? (
              <div className="text-center py-8 animate-scale-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
                  <Flame size={28} className="text-emerald-400" />
                </div>
                <p className="text-white font-bold text-lg">Terima kasih! 🔥</p>
                <p className="text-white/40 text-sm mt-1">
                  Ulasanmu sudah berhasil dikirim
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Rating */}
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider block mb-3">
                    Berikan Rating
                  </label>
                  <StarRating
                    rating={formRating}
                    onRate={setFormRating}
                    interactive
                    size={32}
                  />
                  {formRating > 0 && (
                    <p className="text-xs text-[#D84040] mt-2 animate-fade-in">
                      {formRating === 5 && "Luar biasa! ⚡"}
                      {formRating === 4 && "Sangat bagus! 💪"}
                      {formRating === 3 && "Cukup baik 👍"}
                      {formRating === 2 && "Perlu perbaikan 🤔"}
                      {formRating === 1 && "Sangat kurang 😞"}
                    </p>
                  )}
                </div>

                {/* Kategori */}
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider block mb-3">
                    Kategori
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.filter((c) => c !== "Semua").map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border cursor-pointer ${
                          formCategory === cat
                            ? "bg-[#D84040] text-white border-[#D84040]"
                            : "bg-transparent text-white/50 border-white/15 hover:border-white/40 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Komentar */}
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider block mb-3">
                    Ulasan
                  </label>
                  <textarea
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Ceritakan pengalamanmu berlatih di Zeus Gym..."
                    rows={4}
                    className="w-full bg-[#0b0b0d] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:border-[#D84040]/50 focus:ring-1 focus:ring-[#D84040]/20 transition-all"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formRating === 0 || !formComment.trim()}
                  className="w-full py-3.5 rounded-full bg-white text-[#0b0b0d] font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
                >
                  <Send size={16} /> Kirim Ulasan
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* ── Filter ── */}
      <div className="max-w-4xl mx-auto flex items-center gap-2 flex-wrap mt-8 animate-slide-up delay-300">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border cursor-pointer ${
              filter === cat
                ? "bg-white text-[#0b0b0d] border-white"
                : "bg-transparent text-white/50 border-white/15 hover:border-white/40 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Daftar ulasan ── */}
      <div className="max-w-4xl mx-auto mt-6 space-y-4">
        {filtered.map((review, idx) => (
          <div
            key={review.id}
            className="group bg-[#141416] border border-white/[0.06] rounded-2xl p-5 hover:border-[#D84040]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D84040]/5 animate-slide-up"
            style={{ animationDelay: `${(idx % 6) * 80 + 300}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8E1616] to-[#D84040] flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {review.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} size={12} />
                    <span className="text-[10px] text-white/30">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/30 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
                {review.tag}
              </span>
            </div>

            <div className="mt-4 flex gap-3">
              <Quote
                size={16}
                className="text-[#D84040]/30 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-white/60 leading-relaxed">
                {review.comment}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => toggleLike(review.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300 px-3 py-1.5 rounded-full border cursor-pointer ${
                  likedIds[review.id]
                    ? "text-[#D84040] border-[#D84040]/30 bg-[#D84040]/10"
                    : "text-white/30 border-white/[0.06] hover:text-white/60 hover:border-white/15"
                }`}
              >
                <ThumbsUp
                  size={13}
                  className={likedIds[review.id] ? "fill-[#D84040]" : ""}
                />
                {review.likes}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <MessageCircle
              size={40}
              className="text-white/10 mx-auto mb-4"
            />
            <p className="text-white/30 text-sm">
              Belum ada ulasan untuk kategori ini
            </p>
          </div>
        )}
      </div>

      {/* ── Rating distribution bar ── */}
      <div className="max-w-4xl mx-auto mt-10 bg-[#141416] border border-white/[0.06] rounded-2xl p-6 animate-slide-up delay-400">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Flame size={16} className="text-[#D84040]" /> Distribusi Rating
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-6 text-right font-medium">
                  {star}★
                </span>
                <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8E1616] to-[#D84040] transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-white/30 w-8 font-medium">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
