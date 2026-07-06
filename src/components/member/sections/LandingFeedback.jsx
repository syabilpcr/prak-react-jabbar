import { useState } from "react";
import {
  Star,
  MessageCircle,
  ThumbsUp,
  Send,
  Quote,
  Sparkles,
  ChevronDown,
  Flame,
} from "lucide-react";
import Reveal from "../Reveal";
import { TestimonialsColumn } from "../../ui/testimonials-columns-1";

// ── Data testimoni member ─────────────────────────────────────
const testimonials = [
  {
    id: 1,
    name: "Andi Pratama",
    initial: "A",
    rating: 5,
    date: "2 hari lalu",
    comment:
      "Fasilitas gym luar biasa! Peralatan lengkap dan selalu bersih. Nyaman sekali latihan di sini, tidak pernah ada alat yang rusak.",
    likes: 24,
    tag: "Fasilitas",
    gradient: "from-[#8E1616] to-[#D84040]",
  },
  {
    id: 2,
    name: "Sari Dewi",
    initial: "S",
    rating: 5,
    date: "5 hari lalu",
    comment:
      "Program HIIT Burn benar-benar mengubah hidup saya. Dalam 3 bulan berat badan turun 8 kg! Terima kasih Zeus Gym 🔥",
    likes: 41,
    tag: "Program",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: 3,
    name: "Budi Santoso",
    initial: "B",
    rating: 4,
    date: "1 minggu lalu",
    comment:
      "Area angkat beban sangat luas dan tertata rapi. Suasananya mendukung banget untuk latihan fokus. Cuma kadang agak ramai di jam sore.",
    likes: 15,
    tag: "Suasana",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: 4,
    name: "Rina Kusuma",
    initial: "R",
    rating: 5,
    date: "2 minggu lalu",
    comment:
      "Loker room dan kamar mandi air hangatnya sangat bersih. Resepsionisnya ramah dan cepat tanggap. Highly recommend Zeus Gym!",
    likes: 33,
    tag: "Layanan",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    id: 5,
    name: "Denny Kurniawan",
    initial: "D",
    rating: 4,
    date: "3 minggu lalu",
    comment:
      "Tempat parkir luas dan lokasi strategis. Locker room juga rapi dan bersih. Semoga bisa tambah jam operasional di weekend.",
    likes: 12,
    tag: "Fasilitas",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    id: 6,
    name: "Fitri Handayani",
    initial: "F",
    rating: 5,
    date: "1 bulan lalu",
    comment:
      "Best gym in town! Suasana dark-luxury-nya bikin betah latihan berlama-lama. Worth every penny! ⚡",
    likes: 56,
    tag: "Suasana",
    gradient: "from-[#D84040] to-[#8E1616]",
  },
];

const categories = ["Semua", "Fasilitas", "Peralatan", "Layanan", "Suasana"];

// ── Star display ──────────────────────────────────────────────
function Stars({ count, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= count
              ? "fill-[#D84040] text-[#D84040]"
              : "text-white/15"
          }
        />
      ))}
    </div>
  );
}

// ── Interactive star rating ───────────────────────────────────
function StarRating({ rating, onRate, size = 28 }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onRate(s)}
          className="cursor-pointer hover:scale-125 transition-transform duration-200"
        >
          <Star
            size={size}
            className={`transition-colors duration-200 ${
              s <= rating
                ? "fill-[#D84040] text-[#D84040]"
                : "text-white/15 hover:text-white/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function LandingFeedback() {
  const [reviews, setReviews] = useState(testimonials);
  const [filter, setFilter] = useState("Semua");
  const [likedIds, setLikedIds] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formCategory, setFormCategory] = useState("Fasilitas");
  const [submitted, setSubmitted] = useState(false);

  const filtered = reviews.filter(
    (r) => filter === "Semua" || r.tag === filter,
  );

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const toggleLike = (id) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, likes: r.likes + (likedIds[id] ? -1 : 1) } : r,
      ),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRating === 0 || !formComment.trim()) return;
    setReviews([
      {
        id: Date.now(),
        name: "Kamu",
        initial: "K",
        rating: formRating,
        date: "Baru saja",
        comment: formComment.trim(),
        likes: 0,
        tag: formCategory,
        gradient: "from-[#8E1616] to-[#D84040]",
      },
      ...reviews,
    ]);
    setFormRating(0);
    setFormComment("");
    setFormCategory("Fasilitas");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2200);
  };

  return (
    <section id="feedback" className="bg-[#1D1616] py-24 border-t border-white/[0.03]">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        {/* ── Section Header ── */}
        <div className="text-center mb-14">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D84040] mb-4">
              Umpan Balik
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              APA KATA <span className="text-[#D84040]">MEMBER</span> KAMI
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/45 mt-5 max-w-xl mx-auto text-[15px] leading-relaxed">
              Bergabunglah dengan ribuan member yang sudah merasakan transformasi
              di Zeus Gym. Ceritakan pengalamanmu juga!
            </p>
          </Reveal>
        </div>

        {/* ── Stats ringkas ── */}
        <Reveal delay={200}>
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="bg-[#2A1A1A] border border-white/[0.06] rounded-2xl p-5 text-center hover:border-[#D84040]/30 transition-all duration-300 group">
              <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-[#8E1616] to-[#D84040] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Star size={20} className="text-white" />
              </div>
              <p className="text-2xl font-black text-white">{avgRating}</p>
              <p className="text-[11px] text-white/35 mt-0.5">Rating Rata-rata</p>
            </div>
            <div className="bg-[#2A1A1A] border border-white/[0.06] rounded-2xl p-5 text-center hover:border-[#D84040]/30 transition-all duration-300 group">
              <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageCircle size={20} className="text-white" />
              </div>
              <p className="text-2xl font-black text-white">{reviews.length}</p>
              <p className="text-[11px] text-white/35 mt-0.5">Total Ulasan</p>
            </div>
            <div className="bg-[#2A1A1A] border border-white/[0.06] rounded-2xl p-5 text-center hover:border-[#D84040]/30 transition-all duration-300 group">
              <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Flame size={20} className="text-white" />
              </div>
              <p className="text-2xl font-black text-white">
                {reviews.filter((r) => r.rating >= 4).length}
              </p>
              <p className="text-[11px] text-white/35 mt-0.5">Rating 4-5★</p>
            </div>
          </div>
        </Reveal>

        {/* ── Tulis ulasan CTA ── */}
        <Reveal delay={280}>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3E0703] via-[#8E1616] to-[#D84040] p-[1px] transition-all hover:shadow-2xl hover:shadow-[#D84040]/20 mb-8"
          >
            <div className="bg-[#1D1616] rounded-2xl px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#D84040]/15 flex items-center justify-center border border-[#D84040]/20 group-hover:bg-[#D84040]/25 transition-colors">
                  <Sparkles size={18} className="text-[#D84040]" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">
                    Bagikan Pengalamanmu
                  </p>
                  <p className="text-white/35 text-xs mt-0.5">
                    Tulis ulasan dan bantu sesama member Zeus Gym
                  </p>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`text-white/40 transition-transform duration-300 ${showForm ? "rotate-180" : ""}`}
              />
            </div>
          </button>
        </Reveal>

        {/* ── Form ulasan ── */}
        {showForm && (
          <div className="bg-[#2A1A1A] border border-white/[0.06] rounded-2xl p-6 mb-8 animate-slide-up">
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
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-3">
                    Berikan Rating
                  </label>
                  <StarRating rating={formRating} onRate={setFormRating} />
                  {formRating > 0 && (
                    <p className="text-xs text-[#D84040] mt-2">
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
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-3">
                    Kategori
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.filter((c) => c !== "Semua").map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                          formCategory === cat
                            ? "bg-[#D84040] text-white border-[#D84040]"
                            : "bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white/70"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Komentar */}
                <div>
                  <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-3">
                    Ulasan
                  </label>
                  <textarea
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="Ceritakan pengalamanmu di Zeus Gym..."
                    rows={4}
                    className="w-full bg-[#1D1616] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#D84040]/40 focus:ring-1 focus:ring-[#D84040]/20 transition-all"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formRating === 0 || !formComment.trim()}
                  className="w-full py-3.5 rounded-full bg-white text-[#0b0b0d] font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  <Send size={15} /> Kirim Ulasan
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Filter kategori ── */}
        <Reveal delay={320}>
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                  filter === cat
                    ? "bg-white text-[#0b0b0d] border-white"
                    : "bg-transparent text-white/40 border-white/[0.08] hover:border-white/25 hover:text-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* ── Daftar ulasan (Scrolling Columns) ── */}
        {filtered.length > 0 ? (
          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[640px] overflow-hidden">
            <TestimonialsColumn testimonials={filtered.filter((_, i) => i % 3 === 0)} duration={18} />
            <TestimonialsColumn testimonials={filtered.filter((_, i) => i % 3 === 1)} className="hidden md:block" duration={24} />
            <TestimonialsColumn testimonials={filtered.filter((_, i) => i % 3 === 2)} className="hidden lg:block" duration={20} />
          </div>
        ) : (
          <div className="text-center py-16">
            <MessageCircle size={40} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/25 text-sm">
              Belum ada ulasan untuk kategori ini
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
