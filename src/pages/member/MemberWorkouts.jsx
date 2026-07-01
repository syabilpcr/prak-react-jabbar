import { useState } from "react";
import { Dumbbell, Play, CheckCircle2, Flame, Timer, Target } from "lucide-react";

const programs = [
  { name: "Full Body Blast", focus: "Seluruh Tubuh", duration: "45 mnt", exercises: 8, kcal: 320, color: "from-[#8E1616] to-[#D84040]" },
  { name: "Upper Power", focus: "Dada & Lengan", duration: "35 mnt", exercises: 6, kcal: 240, color: "from-blue-500 to-indigo-500" },
  { name: "Leg Day", focus: "Kaki & Glutes", duration: "40 mnt", exercises: 7, kcal: 290, color: "from-amber-500 to-orange-500" },
  { name: "Core Crusher", focus: "Perut & Core", duration: "25 mnt", exercises: 5, kcal: 180, color: "from-emerald-500 to-teal-500" },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-black text-[#1D1616] flex items-center gap-2">
          <Dumbbell size={24} className="text-[#8E1616]" /> Latihan
        </h1>
        <p className="text-sm text-[#9e7a6e] mt-1">
          Pilih program dan selesaikan latihan harianmu
        </p>
      </div>

      {/* Today's progress ring */}
      <div className="bg-gradient-to-br from-[#1D1616] to-[#3E0703] rounded-3xl p-6 text-white flex items-center justify-between animate-slide-up delay-100">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">
            Latihan Hari Ini
          </p>
          <h2 className="text-3xl font-black mt-1">
            {completed}/{exercises.length}{" "}
            <span className="text-base font-semibold text-white/60">selesai</span>
          </h2>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1.5 text-white/70">
              <Flame size={15} className="text-orange-400" /> 210 kcal
            </span>
            <span className="flex items-center gap-1.5 text-white/70">
              <Timer size={15} className="text-blue-400" /> 28 mnt
            </span>
          </div>
        </div>
        {/* Progress ring */}
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#D84040"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-black">
            {progress}%
          </span>
        </div>
      </div>

      {/* Checklist latihan hari ini */}
      <div className="bg-white rounded-3xl p-6 shadow-sm animate-slide-up delay-200">
        <h2 className="text-lg font-black text-[#1D1616] mb-4 flex items-center gap-2">
          <Target size={18} className="text-[#8E1616]" /> Checklist Latihan
        </h2>
        <div className="space-y-2">
          {exercises.map((e, i) => (
            <button
              key={e.name}
              onClick={() => toggle(i)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300
                ${
                  e.done
                    ? "bg-green-50 border-green-200"
                    : "bg-[#f8f3ee] border-transparent hover:border-[#8E1616]/20"
                }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300
                    ${e.done ? "bg-green-500 text-white" : "bg-white border-2 border-gray-200"}`}
                >
                  {e.done && <CheckCircle2 size={16} />}
                </span>
                <span
                  className={`font-semibold text-sm ${e.done ? "text-green-700 line-through" : "text-[#1D1616]"}`}
                >
                  {e.name}
                </span>
              </span>
              <span className="text-xs font-bold text-[#9e7a6e]">{e.sets}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Program latihan */}
      <div className="animate-slide-up delay-300">
        <h2 className="text-lg font-black text-[#1D1616] mb-4">Program Latihan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((p, i) => (
            <div
              key={p.name}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${p.color} p-5 text-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                <Dumbbell size={90} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black">{p.name}</h3>
                <p className="text-sm text-white/70">{p.focus}</p>
                <div className="flex gap-4 mt-4 text-xs text-white/80">
                  <span>{p.duration}</span>
                  <span>{p.exercises} gerakan</span>
                  <span>{p.kcal} kcal</span>
                </div>
                <button className="mt-4 bg-white text-[#1D1616] font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                  <Play size={14} /> Mulai
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}