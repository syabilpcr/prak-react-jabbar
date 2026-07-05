import { useState } from "react";
import { Play, Check } from "lucide-react";
import { motion } from "framer-motion";

const programs = [
  { name: "Full Body Blast", focus: "Seluruh Tubuh", duration: "45 mnt", exercises: 8, kcal: 320, color: "from-[#8E1616]/40 to-[#D84040]/40" },
  { name: "Upper Power", focus: "Dada & Lengan", duration: "35 mnt", exercises: 6, kcal: 240, color: "from-blue-900/40 to-indigo-900/40" },
  { name: "Leg Day", focus: "Kaki & Glutes", duration: "40 mnt", exercises: 7, kcal: 290, color: "from-amber-900/40 to-orange-900/40" },
  { name: "Core Crusher", focus: "Perut & Core", duration: "25 mnt", exercises: 5, kcal: 180, color: "from-emerald-900/40 to-teal-900/40" },
];

const todayExercises = [
  { name: "Push Up", sets: "4 x 15", done: true },
  { name: "Squat", sets: "4 x 20", done: true },
  { name: "Plank", sets: "3 x 60 dtk", done: false },
  { name: "Lunges", sets: "3 x 12", done: false },
  { name: "Burpees", sets: "3 x 10", done: false },
];

export default function MemberWorkouts() {
  const [exercises, setExercises] = useState(todayExercises);

  const toggle = (idx) =>
    setExercises((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, done: !e.done } : e)),
    );

  const completed = exercises.filter((e) => e.done).length;
  const progress = Math.round((completed / exercises.length) * 100);

  return (
    <div className="bg-[#0b0b0d] -mx-5 -my-8 px-5 pt-28 pb-16 md:-mx-10 md:px-10 min-h-screen text-white space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D84040] font-black block mb-2">
          Rencana Harian
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
          LATIHAN HARIAN
        </h1>
        <p className="text-white/40 mt-3 max-w-md text-sm leading-relaxed">
          Selesaikan gerakan target hari ini dan pantau kemajuan aktivitas fisik Anda.
        </p>
      </motion.div>

      {/* Progress ring card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-[#141416] border border-white/[0.05] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="text-center sm:text-left space-y-2">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
            Target Sesi Hari Ini
          </p>
          <h2 className="text-2xl md:text-3xl font-black">
            {completed} dari {exercises.length} <span className="text-sm font-medium text-white/40">gerakan selesai</span>
          </h2>
          <div className="flex justify-center sm:justify-start gap-4 text-xs text-white/60 pt-1">
            <span>210 KCAL</span>
            <span className="text-white/20">•</span>
            <span>28 MENIT</span>
          </div>
        </div>

        {/* Progress ring */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#D84040"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-black">
            {progress}%
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1 bg-[#141416] border border-white/[0.05] rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-bold uppercase tracking-tight text-white/90">Gerakan Hari Ini</h2>
          <div className="space-y-2">
            {exercises.map((e, idx) => (
              <button
                key={e.name}
                onClick={() => toggle(idx)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer
                  ${
                    e.done
                      ? "bg-[#D84040]/5 border-[#D84040]/20 text-white/90"
                      : "bg-black/30 border-white/[0.03] text-white hover:border-[#D84040]/30"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border
                      ${e.done ? "bg-[#D84040] border-[#D84040] text-white" : "bg-transparent border-white/20"}`}
                  >
                    {e.done && <Check size={12} />}
                  </span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${e.done ? "line-through text-white/40" : "text-white"}`}>
                    {e.name}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{e.sets}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Programs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          <h2 className="text-lg font-bold uppercase tracking-tight text-white/90">Program Latihan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((p, idx) => (
              <div
                key={p.name}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.color} border border-white/[0.05] p-5 transition-all duration-300 hover:shadow-xl hover:shadow-[#D84040]/5`}
              >
                <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{p.name}</h3>
                    <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mt-1">{p.focus}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-3 text-[10px] text-white/50 font-bold uppercase tracking-wider">
                      <span>{p.duration}</span>
                      <span>•</span>
                      <span>{p.exercises} GERAKAN</span>
                    </div>

                    <button className="bg-white text-black text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[#D84040] hover:text-white transition-colors cursor-pointer">
                      <Play size={10} fill="currentColor" /> Mulai
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}