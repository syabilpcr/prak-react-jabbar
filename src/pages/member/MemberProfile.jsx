import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../lib/api";

const achievements = [
  { label: "7 HARI BERUNTUN", focus: "Konsistensi Latihan" },
  { label: "JUARA BULANAN", focus: "Performa Sesi Terbanyak" },
  { label: "50 SESI LATIHAN", focus: "Pencapaian Total" },
  { label: "MEMBER SETIA", focus: "Dedikasi Komunitas" },
];

export default function MemberProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ nama_lengkap: "", email: "", no_hp: "" });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({
        nama_lengkap: u.name || "",
        email: u.email || "",
        no_hp: u.phone || "",
      });
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      setSaving(true);
      await api.patch(
        "/user",
        {
          nama_lengkap: form.nama_lengkap,
          email: form.email,
          no_hp: form.no_hp,
        },
        { params: { id_user: `eq.${user.id}` } },
      );
      
      const updated = {
        ...user,
        name: form.nama_lengkap,
        email: form.email,
        phone: form.no_hp,
      };
      localStorage.setItem("currentUser", JSON.stringify(updated));
      setUser(updated);
      setIsEditing(false);
      setSavedMsg("Profil berhasil diperbarui!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      console.error("Gagal memperbarui profil:", err);
      setSavedMsg("Gagal menyimpan. Coba lagi.");
      setTimeout(() => setSavedMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const initial = (user?.name || "M").charAt(0).toUpperCase();

  return (
    <div className="bg-[#0b0b0d] -mx-5 -my-8 px-5 pt-28 pb-16 md:-mx-10 md:px-10 min-h-screen text-white space-y-8">
      {savedMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 right-6 z-50 bg-[#1D1616] text-[#D84040] px-5 py-3 rounded-xl shadow-2xl border border-[#D84040]/30 font-bold text-sm"
        >
          {savedMsg}
        </motion.div>
      )}

      {/* Hero profil */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#141416] to-[#1a1212] border border-white/[0.05] p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D84040]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8C1007] to-[#D84040] flex items-center justify-center text-4xl font-black border-2 border-white/10 shadow-xl">
            {initial}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{user?.name || "Member"}</h1>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">{user?.email}</p>
            <span className="inline-block mt-2 bg-[#D84040]/10 border border-[#D84040]/25 text-[#D84040] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {user?.role || "MEMBER"}
            </span>
          </div>
        </div>
      </motion.section>

      {/* Achievements */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-bold uppercase tracking-tight text-white/90">Pencapaian</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((a, i) => (
            <div
              key={a.label}
              className="bg-[#141416] border border-white/[0.05] rounded-xl p-5 text-center transition-all duration-300 hover:border-[#D84040]/30"
            >
              <p className="text-[10px] font-black text-[#D84040] tracking-widest uppercase mb-1">{a.label}</p>
              <p className="text-xs text-white/50 font-semibold">{a.focus}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Info pribadi + edit */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-[#141416] border border-white/[0.05] rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white/90">Informasi Pribadi</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl cursor-pointer transition-colors"
            >
              Edit Profil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white border border-white/5 hover:bg-white/5 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs font-bold uppercase tracking-wider bg-[#D84040] hover:bg-[#8E1616] text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Nama Lengkap", name: "nama_lengkap", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "No HP", name: "no_hp", type: "tel" },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block">
                {field.label}
              </label>
              {isEditing ? (
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D84040]/50 transition-colors"
                />
              ) : (
                <div className="px-4 py-2.5 bg-black/20 border border-white/[0.03] rounded-xl text-sm font-semibold text-white/80">
                  {form[field.name] || "-"}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}