import { useState, useEffect } from "react";
import { Play, Check, ChevronDown, ChevronUp, RefreshCw, Trophy, Calendar, Flame, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROGRAMS = [
  {
    id: "full-body",
    name: "Full Body Blast",
    focus: "Seluruh Tubuh",
    duration: "45 mnt",
    kcal: 320,
    color: "from-[#8E1616]/40 to-[#D84040]/40",
    border: "border-[#D84040]/25",
    accent: "bg-[#D84040]",
    exercises: [
      { name: "Push Up", sets: "4 x 15 reps", rest: "60 dtk", kcal: 45, tip: "Jaga posisi punggung tetap lurus sejajar kaki dan kencangkan core abdominal selama bergerak." },
      { name: "Bodyweight Squat", sets: "4 x 20 reps", rest: "60 dtk", kcal: 50, tip: "Turunkan pinggul ke belakang hingga paha sejajar lantai, tumpukan beban di tumit kaki." },
      { name: "Dumbbell Shoulder Press", sets: "3 x 12 reps", rest: "90 dtk", kcal: 40, tip: "Dorong dumbbell tegak lurus ke atas kepala secara terkontrol dan hindari mengunci siku." },
      { name: "Kettlebell Swing", sets: "3 x 15 reps", rest: "90 dtk", kcal: 55, tip: "Hasilkan tenaga dorongan dari engsel pinggul (hip hinge), bukan mengangkat dengan kekuatan bahu." },
      { name: "Dumbbell Row", sets: "3 x 12 reps", rest: "60 dtk", kcal: 40, tip: "Tarik beban ke arah pinggang samping sambil merapatkan tulang belikat secara maksimal." },
      { name: "Plank Hold", sets: "3 x 60 dtk", rest: "60 dtk", kcal: 30, tip: "Tahan posisi tubuh lurus horizontal dengan bertumpu pada lengan bawah, kontraksikan glutes." },
      { name: "Mountain Climbers", sets: "3 x 30 dtk", rest: "45 dtk", kcal: 40, tip: "Bawa lutut maju ke arah dada bergantian dengan ritme cepat layaknya sedang mendaki." },
    ]
  },
  {
    id: "upper-power",
    name: "Upper Power",
    focus: "Dada & Lengan",
    duration: "35 mnt",
    kcal: 240,
    color: "from-blue-900/40 to-indigo-900/40",
    border: "border-blue-500/25",
    accent: "bg-blue-500",
    exercises: [
      { name: "Incline Bench Press", sets: "4 x 10 reps", rest: "90 dtk", kcal: 50, tip: "Turunkan barbell perlahan ke dada bagian atas lalu dorong kuat ke atas." },
      { name: "Lat Pulldown / Pull Up", sets: "4 x 8 reps", rest: "90 dtk", kcal: 45, tip: "Tarik palang ke dada bagian atas dengan mengaktifkan otot latissimus dorsi (punggung samping)." },
      { name: "Barbell Overhead Press", sets: "3 x 8 reps", rest: "120 dtk", kcal: 45, tip: "Jaga postur tegak tanpa melengkungkan punggung bawah saat menekan beban ke atas kepala." },
      { name: "Dumbbell Chest Fly", sets: "3 x 12 reps", rest: "60 dtk", kcal: 35, tip: "Buka lengan melebar dengan sedikit menekuk siku, rasakan regangan pada otot dada." },
      { name: "Bicep Dumbbell Curl", sets: "3 x 12 reps", rest: "60 dtk", kcal: 30, tip: "Kunci posisi siku di samping badan selama mengangkat dumbbell untuk isolasi otot bisep." },
      { name: "Tricep Bench Dips", sets: "3 x 15 reps", rest: "60 dtk", kcal: 35, tip: "Turunkan pinggul dekat ke bangku dengan menekuk siku ke belakang sudut 90 derajat." },
    ]
  },
  {
    id: "leg-day",
    name: "Leg Day Specialist",
    focus: "Kaki & Glutes",
    duration: "40 mnt",
    kcal: 290,
    color: "from-amber-900/40 to-orange-900/40",
    border: "border-amber-500/25",
    accent: "bg-amber-500",
    exercises: [
      { name: "Barbell Back Squat", sets: "4 x 8 reps", rest: "120 dtk", kcal: 70, tip: "Pastikan lutut mengarah sejajar dengan jari-jari kaki saat berjongkok turun." },
      { name: "Romanian Deadlift", sets: "4 x 10 reps", rest: "90 dtk", kcal: 60, tip: "Tekuk lutut sedikit, dorong pinggul ke belakang sejauh mungkin hingga paha belakang meregang." },
      { name: "Leg Press Machine", sets: "3 x 12 reps", rest: "90 dtk", kcal: 50, tip: "Posisikan kaki lebar bahu pada platform, hindari meluruskan lutut terkunci di atas." },
      { name: "Walking Lunges", sets: "3 x 16 langkah", rest: "60 dtk", kcal: 45, tip: "Melangkahlah lebar ke depan bergantian kaki hingga lutut belakang hampir menyentuh lantai." },
      { name: "Lying Leg Curl", sets: "3 x 12 reps", rest: "60 dtk", kcal: 30, tip: "Tarik roller ke arah glutes dengan memfokuskan kontraksi hamstring secara penuh." },
      { name: "Standing Calf Raises", sets: "4 x 20 reps", rest: "45 dtk", kcal: 35, tip: "Jinjit setinggi mungkin lalu tahan posisi puncak selama 1 detik sebelum turun terkontrol." },
    ]
  },
  {
    id: "core-crusher",
    name: "Core Crusher",
    focus: "Perut & Core",
    duration: "25 mnt",
    kcal: 180,
    color: "from-emerald-900/40 to-teal-900/40",
    border: "border-emerald-500/25",
    accent: "bg-emerald-500",
    exercises: [
      { name: "Hanging Knee Raise", sets: "3 x 15 reps", rest: "60 dtk", kcal: 25, tip: "Bergantung pada bar dan angkat lutut ke dada menggunakan kontraksi abdominal bawah." },
      { name: "Russian Twist", sets: "3 x 20 reps", rest: "45 dtk", kcal: 30, tip: "Angkat kaki sedikit dari lantai dan putar pinggang memindahkan beban ke sisi kiri dan kanan." },
      { name: "Bicycle Crunch", sets: "3 x 20 reps", rest: "45 dtk", kcal: 25, tip: "Pertemukan siku kiri dengan lutut kanan dan sebaliknya secara menyilang dengan lambat." },
      { name: "Ab Wheel Rollout", sets: "3 x 10 reps", rest: "60 dtk", kcal: 35, tip: "Dorong roda ke depan dengan menjaga stabilitas perut tanpa membiarkan punggung melengkung." },
      { name: "Hollow Body Hold", sets: "3 x 45 dtk", rest: "45 dtk", kcal: 20, tip: "Kunci punggung bawah tetap menempel ke lantai, angkat bahu dan kaki sedikit." },
    ]
  }
];

export default function MemberWorkouts() {
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0]);
  const [activeExercises, setActiveExercises] = useState([]);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Inisialisasi program pertama ke active exercises
  useEffect(() => {
    // Muat riwayat dari localStorage
    const savedHistory = localStorage.getItem("zeus_workout_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }

    // Muat active workout atau default ke program pertama
    const savedActive = localStorage.getItem("zeus_active_workout");
    const savedProgramId = localStorage.getItem("zeus_active_program_id");
    
    if (savedActive && savedProgramId) {
      try {
        const prog = PROGRAMS.find(p => p.id === savedProgramId) || PROGRAMS[0];
        setSelectedProgram(prog);
        setActiveExercises(JSON.parse(savedActive));
      } catch (e) {
        startProgram(PROGRAMS[0]);
      }
    } else {
      startProgram(PROGRAMS[0]);
    }
  }, []);

  // Mulai program latihan baru
  const startProgram = (program) => {
    setSelectedProgram(program);
    const initial = program.exercises.map(ex => ({
      ...ex,
      done: false
    }));
    setActiveExercises(initial);
    localStorage.setItem("zeus_active_workout", JSON.stringify(initial));
    localStorage.setItem("zeus_active_program_id", program.id);
    setExpandedExercise(null);
    setShowCelebration(false);
  };

  // Toggle status selesai per gerakan
  const toggleExercise = (index) => {
    const updated = activeExercises.map((ex, i) => 
      i === index ? { ...ex, done: !ex.done } : ex
    );
    setActiveExercises(updated);
    localStorage.setItem("zeus_active_workout", JSON.stringify(updated));

    // Cek jika baru saja menyelesaikan semua gerakan
    const allDone = updated.every(ex => ex.done);
    if (allDone) {
      setShowCelebration(true);
    }
  };

  // Reset sesi aktif kembali ke awal
  const resetWorkout = () => {
    const reset = activeExercises.map(ex => ({ ...ex, done: false }));
    setActiveExercises(reset);
    localStorage.setItem("zeus_active_workout", JSON.stringify(reset));
    setShowCelebration(false);
  };

  // Simpan latihan ke riwayat
  const finishWorkout = () => {
    const dateStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const newRecord = {
      id: Date.now(),
      programName: selectedProgram.name,
      kcal: selectedProgram.kcal,
      duration: selectedProgram.duration,
      date: dateStr
    };

    const updatedHistory = [newRecord, ...history].slice(0, 10); // Simpan maks 10 riwayat
    setHistory(updatedHistory);
    localStorage.setItem("zeus_workout_history", JSON.stringify(updatedHistory));
    
    // Reset status selesai gerakan saat ini
    resetWorkout();
    setShowCelebration(false);
    alert("Kerja bagus! Latihan Anda telah disimpan di riwayat.");
  };

  const completedCount = activeExercises.filter(ex => ex.done).length;
  const totalCount = activeExercises.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Hitung total kalori yang terbakar sejauh ini
  const activeKcalBurned = activeExercises.reduce((acc, curr) => curr.done ? acc + curr.kcal : acc, 0);

  return (
    <div className="bg-[#0b0b0d] -mx-5 -my-8 px-5 pt-28 pb-16 md:-mx-10 md:px-10 min-h-screen text-white space-y-8">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D84040] font-black block mb-2">
            Target Latihan
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
            Rencana Aktivitas
          </h1>
          <p className="text-white/40 mt-3 max-w-md text-sm leading-relaxed">
            Pilih program latihan, centang gerakan yang selesai, dan tingkatkan performa fisik Anda.
          </p>
        </div>

        <button 
          onClick={resetWorkout}
          className="w-fit flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-bold transition-all text-white/70"
        >
          <RefreshCw size={13} />
          Reset Latihan Saat Ini
        </button>
      </motion.div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Tracker Sesi Aktif & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Ring & Stats Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#141416] border border-white/[0.05] rounded-3xl p-6 md:p-8 relative overflow-hidden"
          >
            {/* Background vector glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D84040]/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="space-y-4 text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] text-white/50 font-bold uppercase tracking-wider">
                  <Flame size={12} className="text-[#D84040]" /> Sesi Aktif: {selectedProgram.name}
                </div>
                
                <h2 className="text-2xl md:text-4xl font-black">
                  {completedCount} dari {totalCount} <span className="text-white/40 font-medium text-lg md:text-xl">Gerakan Selesai</span>
                </h2>

                <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <Flame size={14} className="text-[#D84040]" />
                    <span className="font-bold text-white">{activeKcalBurned}</span> / {selectedProgram.kcal} kcal terbakar
                  </div>
                  <div className="text-white/20">•</div>
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <Clock size={14} className="text-blue-400" />
                    Durasi: <span className="font-bold text-white">{selectedProgram.duration}</span>
                  </div>
                  <div className="text-white/20">•</div>
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <Trophy size={14} className="text-amber-400" />
                    Fokus: <span className="font-bold text-white">{selectedProgram.focus}</span>
                  </div>
                </div>
              </div>

              {/* Circular Progress Bar */}
              <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="9" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#D84040"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - progressPercent / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{progressPercent}%</span>
                  <span className="text-[8px] text-white/40 uppercase font-black tracking-widest mt-0.5">Progress</span>
                </div>
              </div>

            </div>

            {/* Linear visual progress bar */}
            <div className="w-full bg-white/[0.02] h-1.5 rounded-full mt-6 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#8c1007] to-[#D84040]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Selesai Sesi Celebration Modal / Banner */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-400 uppercase tracking-tight">Semua Target Selesai!</h3>
                    <p className="text-xs text-white/50 mt-1 max-w-sm">
                      Anda telah menyelesaikan semua gerakan latihan di program ini. Simpan sesi ke riwayat latihan Anda!
                    </p>
                  </div>
                </div>
                <button
                  onClick={finishWorkout}
                  className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  <Check size={14} className="stroke-[3px]" /> Selesaikan Sesi
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Latihan List */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/45">
              Daftar Gerakan ({totalCount})
            </h3>
            
            <div className="space-y-2">
              {activeExercises.map((ex, idx) => {
                const isExpanded = expandedExercise === idx;
                return (
                  <div 
                    key={ex.name}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      ex.done 
                        ? "bg-[#D84040]/5 border-[#D84040]/15" 
                        : "bg-[#141416] border-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    {/* Header bar click to select / check */}
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => toggleExercise(idx)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border flex-shrink-0 cursor-pointer ${
                            ex.done 
                              ? "bg-[#D84040] border-[#D84040] text-white shadow-md shadow-[#D84040]/20" 
                              : "bg-black/30 border-white/20 hover:border-white/40 text-transparent"
                          }`}
                        >
                          <Check size={14} className="stroke-[3px]" />
                        </button>
                        
                        <div 
                          onClick={() => setExpandedExercise(isExpanded ? null : idx)}
                          className="text-left cursor-pointer flex-1"
                        >
                          <h4 className={`text-sm md:text-base font-bold tracking-tight transition-all ${ex.done ? "line-through text-white/40" : "text-white/90"}`}>
                            {ex.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-white/35 font-bold uppercase tracking-wider">
                            <span>{ex.sets}</span>
                            <span>•</span>
                            <span>Kcal: {ex.kcal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpandedExercise(isExpanded ? null : idx)}
                        className="p-1 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {/* Expandable Tips Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden bg-black/20"
                        >
                          <div className="p-4 border-t border-white/[0.02] text-xs text-white/60 leading-relaxed space-y-3">
                            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                              <p className="font-bold text-white/80 mb-1 text-[10px] uppercase tracking-wider text-[#D84040]">Panduan & Tips Form:</p>
                              <p className="text-white/60 leading-relaxed">{ex.tip}</p>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40 pt-1">
                              <span>Waktu Istirahat: {ex.rest}</span>
                              <span className="text-[#D84040]">Est. Kalori: ~{ex.kcal} Kcal</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* KOLOM KANAN: Program List & History */}
        <div className="space-y-6">
          
          {/* Program Latihan selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/45">
              Program Tersedia
            </h3>
            
            <div className="space-y-3">
              {PROGRAMS.map((p) => {
                const isActive = selectedProgram.id === p.id;
                return (
                  <div
                    key={p.name}
                    className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 bg-gradient-to-br ${p.color} ${
                      isActive 
                        ? `${p.border} scale-[1.01] ring-1 ring-[#D84040]/30 shadow-lg shadow-black/40` 
                        : "border-white/[0.03] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-base font-black text-white uppercase tracking-tight">{p.name}</h4>
                          {isActive && (
                            <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-[#D84040] text-white rounded">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-0.5">{p.focus}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                        <div className="flex gap-2.5 text-[9px] text-white/40 font-bold uppercase tracking-wider">
                          <span>{p.duration}</span>
                          <span>•</span>
                          <span>{p.exercises.length} Gerakan</span>
                        </div>

                        <button
                          onClick={() => startProgram(p)}
                          className={`text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isActive
                              ? "bg-white text-black hover:bg-white/90"
                              : "bg-white/5 text-white hover:bg-[#D84040]"
                          }`}
                        >
                          <Play size={8} fill="currentColor" /> {isActive ? "Mulai Ulang" : "Pilih Program"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Riwayat Latihan Panel */}
          <div className="bg-[#141416] border border-white/[0.05] rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                <Calendar size={13} className="text-[#D84040]" /> Riwayat Latihan
              </h3>
              {history.length > 0 && (
                <button 
                  onClick={() => {
                    if (confirm("Hapus semua riwayat latihan?")) {
                      setHistory([]);
                      localStorage.removeItem("zeus_workout_history");
                    }
                  }}
                  className="text-[9px] font-bold text-white/30 hover:text-white uppercase tracking-wider transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-6 text-white/30 text-xs leading-relaxed">
                Belum ada riwayat latihan.<br />Selesaikan sesi dan klik tombol "Selesaikan Sesi".
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {history.map((record) => (
                  <div key={record.id} className="p-3 bg-black/25 rounded-xl border border-white/[0.03] space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-white/80">
                      <span className="uppercase text-[#D84040]">{record.programName}</span>
                      <span className="text-white/40">{record.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-white/40">
                      <span>{record.date}</span>
                      <span className="text-amber-400 font-bold">+{record.kcal} Kcal</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}