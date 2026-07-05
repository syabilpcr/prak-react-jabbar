import { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="bg-[#0b0b0d] -mx-5 -my-8 px-5 pt-28 pb-16 md:-mx-10 md:px-10 min-h-screen text-white">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D84040] font-black block mb-2">
          Jadwal Mingguan
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
          PILIH KELAS
        </h1>
        <p className="text-white/40 mt-3 max-w-md text-sm leading-relaxed">
          Pilih kelas sesuai tingkat performa Anda dan pesan tempat sebelum slot penuh.
        </p>
      </motion.div>

      {/* Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center gap-2 flex-wrap mb-10"
      >
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setFilter(l)}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer
              ${
                filter === l
                  ? "bg-[#D84040] text-white border-[#D84040]"
                  : "bg-transparent text-white/50 border-white/10 hover:border-white/20 hover:text-white"
              }`}
          >
            {l}
          </button>
        ))}
      </motion.div>

      {/* Grid kelas */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map((c, i) => {
          const isBooked = booked[c.name];
          const full = c.booked >= c.slots && !isBooked;
          const sisaPersen = Math.round((c.booked / c.slots) * 100);
          
          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              key={c.name}
              className="group relative overflow-hidden rounded-2xl bg-[#141416] border border-white/[0.05] hover:border-[#D84040]/30 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Foto */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/40 to-transparent" />
                <span className="absolute top-4 left-4 text-[9px] uppercase font-bold tracking-widest text-white/80 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                  {c.day}
                </span>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="text-xl font-bold text-white tracking-tight uppercase">{c.name}</h3>
                  <span className="text-xs font-semibold text-white/70 bg-black/40 px-2 py-0.5 rounded">{c.time}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-white/40 font-medium">
                  <span>Pelatih {c.trainer}</span>
                  <span>{c.booked}/{c.slots} Slot Terisi</span>
                </div>

                {/* Bar kapasitas */}
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-750 ${full ? "bg-[#D84040]" : "bg-[#D84040]"}`}
                    style={{ width: `${sisaPersen}%` }}
                  />
                </div>

                <button
                  onClick={() => !full && toggleBook(c.name)}
                  disabled={full}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer
                    ${
                      full
                        ? "bg-white/5 text-white/20 border border-transparent cursor-not-allowed"
                        : isBooked
                          ? "bg-transparent text-white border border-[#D84040] hover:bg-[#D84040]/10"
                          : "bg-white text-[#0b0b0d] hover:bg-[#D84040] hover:text-white"
                    }`}
                >
                  {full ? (
                    "Kelas Penuh"
                  ) : isBooked ? (
                    <>
                      <Check size={14} /> Terdaftar
                    </>
                  ) : (
                    "Pesan Kelas"
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}