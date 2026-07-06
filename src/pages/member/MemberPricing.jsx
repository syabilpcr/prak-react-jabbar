import { useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import LandingPricing from "../../components/member/sections/LandingPricing";

export default function MemberPricing() {
  return (
    <div className="bg-[#0b0b0d] min-h-screen text-white">
      {/* ── Page Header ── */}
      <div className="pt-28 pb-0 px-5 md:px-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4 mb-2"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Crown size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400/70 font-black">
              Harga Keanggotaan
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              PAKET MEMBERSHIP
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white/40 text-sm max-w-xl mb-0 ml-[60px]"
        >
          Pilih paket sesuai kebutuhanmu. Semakin lama durasi, semakin besar
          penghematan yang kamu dapatkan!
        </motion.p>
      </div>

      {/* ── Pricing Section (reuse dari LandingPricing) ── */}
      <LandingPricing />
    </div>
  );
}
