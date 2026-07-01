import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Award,
  Edit3,
  Save,
  X,
  Flame,
  Trophy,
  CalendarCheck,
} from "lucide-react";
import api from "../../lib/api";

const achievements = [
  { icon: Flame, label: "7 Hari Beruntun", color: "from-orange-400 to-red-500" },
  { icon: Trophy, label: "Juara Bulanan", color: "from-amber-400 to-yellow-500" },
  { icon: CalendarCheck, label: "50 Sesi", color: "from-emerald-400 to-teal-500" },
  { icon: Award, label: "Member Setia", color: "from-blue-400 to-indigo-500" },
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
      // ── UPDATE profil member ke Supabase ──
      await api.patch(
        "/user",
        {
          nama_lengkap: form.nama_lengkap,
          email: form.email,
          no_hp: form.no_hp,
        },
        { params: { id_user: `eq.${user.id}` } },
      );
      // Perbarui session lokal
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
    <div className="space-y-6">
      {savedMsg && (
        <div className="fixed top-24 right-6 z-50 bg-[#1D1616] text-white px-5 py-3 rounded-xl shadow-2xl animate-slide-in-left">
          {savedMsg}
        </div>
      )}

      {/* Hero profil */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3E0703] via-[#8E1616] to-[#D84040] animate-gradient p-8 text-white shadow-2xl animate-slide-up">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-5xl font-black border-4 border-white/30 animate-glow">
            {initial}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-black">{user?.name || "Member"}</h1>
            <p className="text-white/70 mt-1">{user?.email}</p>
            <span className="inline-block mt-3 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              Member {user?.role || ""}
            </span>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="animate-slide-up delay-100">
        <h2 className="text-lg font-black text-[#1D1616] mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-[#8E1616]" /> Pencapaian
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center animate-slide-up delay-${(i + 1) * 100}`}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white shadow-md mb-3`}
                >
                  <Icon size={24} />
                </div>
                <p className="text-xs font-bold text-[#1D1616]">{a.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Info pribadi + edit */}
      <section className="bg-white rounded-3xl p-6 shadow-sm animate-slide-up delay-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-[#1D1616]">Informasi Pribadi</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-[#8E1616] border border-[#8E1616]/30 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#8E1616]/10 transition-all"
            >
              <Edit3 size={15} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 text-gray-500 border border-gray-200 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                <X size={15} /> Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 bg-[#8E1616] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#D84040] transition-all disabled:opacity-50"
              >
                <Save size={15} /> {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: User, label: "Nama Lengkap", name: "nama_lengkap", type: "text" },
            { icon: Mail, label: "Email", name: "email", type: "email" },
            { icon: Phone, label: "No HP", name: "no_hp", type: "tel" },
          ].map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name}>
                <label className="text-xs font-bold text-[#9e7a6e] uppercase tracking-wide flex items-center gap-1.5 mb-2">
                  <Icon size={13} /> {field.label}
                </label>
                {isEditing ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl text-sm text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]/20 transition-all"
                  />
                ) : (
                  <div className="px-4 py-2.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-xl text-sm font-medium text-[#1D1616]">
                    {form[field.name] || "-"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}