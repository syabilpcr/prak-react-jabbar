import { useState } from "react";
import { Clock, Users, CheckCircle2, ArrowRight } from "lucide-react";

const IMG = {
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
  hiit: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  strength: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  spin: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=80",
  pilates: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  boxing: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80",
};

const allClasses = [
  { name: "Mobility Flow", time: "07:00", trainer: "Sarah", level: "Pemula", slots: 12, booked: 5, day: "Senin", img: IMG.yoga },
  { name: "HIIT Burn", time: "09:30", trainer: "Mike", level: "Lanjutan", slots: 15, booked: 14, day: "Senin", img: IMG.hiit },
  { name: "Strength 101", time: "16:00", trainer: "Dewi", level: "Menengah", slots: 10, booked: 6, day: "Selasa", img: IMG.strength },
  { name: "Spinning", time: "18:00", trainer: "Andre", level: "Menengah", slots: 20, booked: 9, day: "Rabu", img: IMG.spin },
  { name: "Pilates Core", time: "08:00", trainer: "Lina", level: "Pemula", slots: 12, booked: 3, day: "Kamis", img: IMG.pilates },
  { name: "Boxing", time: "19:00", trainer: "Reza", level: "Lanjutan", slots: 14, booked: 11, day: "Jumat", img: IMG.boxing },
];

const levels = ["Semua", "Pemula", "Menengah", "Lanjutan"];

export default function MemberClasses() {
  const [filter, setFilter] = useState("Semua");
  const [booked, setBooked] = useState({});

  const filtered = allClasses.filter(
    (c) => filter === "Semua" || c.level === filter,
  );

  const toggleBook = (name) =>
    setBooked((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="bg-[#0b0b0d] -mx-5 -my-8 px-5 py-10 md:-mx-10 md:px-10 min-h-screen">
      {/* Header */}
      <div className="animate-slide-up">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-3">
          Jadwal Mingguan
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">
          Pilih kelasmu.
        </h1>
        <p className="text-white/45 mt-3 max-w-md text-[15px]">
          Setiap sesi dirancang untuk mendorongmu selangkah lebih jauh. Pesan
          tempatmu sebelum penuh.
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap mt-8 animate-slide-up delay-100">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setFilter(l)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border
              ${
                filter === l
                  ? "bg-white text-[#0b0b0d] border-white"
                  : "bg-transparent text-white/50 border-white/15 hover:border-white/40 hover:text-white"
              }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Grid kelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {filtered.map((c, i) => {
          const isBooked = booked[c.name];
          const full = c.booked >= c.slots && !isBooked;
          const sisaPersen = Math.round((c.booked / c.slots) * 100);
          return (
            <div
              key={c.name}
              className="group relative overflow-hidden rounded-2xl bg-[#141416] border border-white/[0.06] hover:border-white/15 transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${(i % 6) * 80}ms` }}
            >
              {/* Foto */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/30 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
                  {c.day}
                </span>
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <h3 className="text-xl font-semibold text-white">{c.name}</h3>
                  <span className="text-sm font-medium text-white/90">{c.time}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between text-[12px] text-white/40">
                  <span>Pelatih {c.trainer}</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {c.booked}/{c.slots}
                  </span>
                </div>

                {/* Bar kapasitas */}
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${full ? "bg-red-500" : "bg-white"}`}
                    style={{ width: `${sisaPersen}%` }}
                  />
                </div>

                <button
                  onClick={() => !full && toggleBook(c.name)}
                  disabled={full}
                  className={`group/btn w-full py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2
                    ${
                      full
                        ? "bg-white/5 text-white/30 cursor-not-allowed"
                        : isBooked
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-white text-[#0b0b0d] hover:bg-white/90"
                    }`}
                >
                  {full ? (
                    "Kelas Penuh"
                  ) : isBooked ? (
                    <>
                      <CheckCircle2 size={15} /> Terdaftar
                    </>
                  ) : (
                    <>
                      Pesan Kelas
                      <ArrowRight size={15} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}