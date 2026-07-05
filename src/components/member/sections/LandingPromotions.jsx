import { useState, useEffect } from "react";
import { Tag, Copy, Check, Calendar, Gift } from "lucide-react";
import Reveal from "../Reveal";
import promotionsData from "../../../data/promotionsData";

export default function LandingPromotions() {
  const [promotions, setPromotions] = useState(() => {
    const saved = localStorage.getItem("zeus_promotions_v3");
    if (saved) return JSON.parse(saved);
    return promotionsData;
  });

  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("zeus_promotions_v3");
      if (saved) {
        setPromotions(JSON.parse(saved));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Filter out non-active promotions if we want to show only active ones in the landing page, 
  // or show all. Let's show all but highlight the active ones.
  const activePromos = promotions.filter(p => p.status === "Aktif");

  if (activePromos.length === 0) return null; // Hide section if no active promos

  return (
    <section id="promotions" className="bg-[#1D1616] py-24 border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D84040]/10 border border-[#D84040]/20 text-[11px] font-semibold text-[#D84040] uppercase tracking-wider mb-4 animate-pulse">
            <Gift size={12} />
            Penawaran Spesial
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase">
            Promosi <span className="text-[#D84040]">Terkini</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-white/50 mt-6 max-w-2xl text-[15px] leading-relaxed">
            Gunakan kode promo eksklusif di bawah ini untuk mendapatkan potongan harga dan penawaran menarik di Zeus Gym.
          </p>
        </Reveal>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {activePromos.map((promo, i) => {
            const isCopied = copiedId === promo.id;

            return (
              <Reveal key={promo.id} direction="scale" delay={i * 100}>
                <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#141416] border border-white/[0.06] hover:border-[#D84040]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D84040]/5 overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D84040]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D84040]/10 transition-colors" />

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#D84040]/10 text-[#D84040] border border-[#D84040]/20">
                        {promo.status}
                      </span>
                      <span className="text-[10px] text-white/30 font-semibold">{promo.id}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-[#D84040] transition-colors leading-tight mb-2">
                      {promo.title}
                    </h3>

                    <div className="flex items-baseline gap-1 mt-4 mb-6">
                      <span className="text-4xl font-black text-white tracking-tight">
                        {promo.discount}
                      </span>
                      <span className="text-xs text-white/40 font-semibold">OFF</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
                    {/* Validity */}
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Calendar size={14} />
                      <span>Berlaku s/d: {new Date(promo.validUntil).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}</span>
                    </div>

                    {/* Copy Box */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 group-hover:border-white/10 transition-colors">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-white/30 font-black">Kode Promo</p>
                        <code className="text-sm font-black text-white tracking-wider uppercase">{promo.code}</code>
                      </div>
                      
                      <button
                        onClick={() => handleCopy(promo.code, promo.id)}
                        className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-center border cursor-pointer
                          ${
                            isCopied
                              ? "bg-green-500/10 border-green-500/20 text-green-400"
                              : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white"
                          }`}
                        title={isCopied ? "Berhasil disalin!" : "Salin kode"}
                      >
                        {isCopied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
