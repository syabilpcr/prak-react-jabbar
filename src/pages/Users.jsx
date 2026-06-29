import { useState, useEffect } from "react";
import {
  Plus,
  Users as UsersIcon,
  ShieldCheck,
  UserCog,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// ── Components ────────────────────────────────────────────────
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import api from "../lib/api";

/*
  ── Halaman Manajemen User (CRUD) ────────────────────────────
  Alur sesuai permintaan: tambah user + password lewat form,
  lalu user langsung tampil di tabel. Tersedia juga edit & hapus.

  CATATAN KEAMANAN:
  Password di sini disimpan di state lokal (memori browser) dan
  bisa ditampilkan apa adanya HANYA untuk keperluan demo/belajar.
  Untuk aplikasi sungguhan, password WAJIB di-hash di server dan
  TIDAK BOLEH dikembalikan/ditampilkan ke client.
*/

const ROLE_OPTIONS = [
  { value: "admin", label: "Administrator" },
  { value: "member", label: "Member" },
];

const emptyForm = {
  nama_lengkap: "",
  email: "",
  no_hp: "",
  role: "member",
  password: "",
};

const Users = () => {
  // ── Data user diambil dari REST API Supabase (schema "zeusgym", table "user") ──
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // berisi id_user saat mode edit
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [successAlert, setSuccessAlert] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // ── READ: ambil semua user dari Supabase saat komponen dimuat ──
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await api.get("/user", {
        params: { order: "id_user.asc" },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      setFetchError(
        "Gagal memuat data user dari server. Periksa koneksi atau konfigurasi API.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
            (u.nama_lengkap || "").toLowerCase().includes(q) ||
      (u.no_hp || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

    const totalAdmin = users.filter((u) => u.role === "admin").length;
  const totalMember = users.filter((u) => u.role === "member").length;

  // ── Handlers ───────────────────────────────────────────────
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowModal(true);
  };

    const openEditModal = (user) => {
    setEditingId(user.id_user);
    setForm({
      nama_lengkap: user.nama_lengkap || "",
      email: user.email || "",
      no_hp: user.no_hp || "",
      role: user.role || "member",
      password: user.password || "",
    });
    setFormError(null);
    setShowModal(true);
  };

    const handleSubmit = async () => {
    // Validasi sederhana
    if (!form.nama_lengkap || !form.email || !form.password) {
      setFormError("Nama lengkap, email, dan password wajib diisi.");
      return;
    }

    // Cek email duplikat di data yang ada (abaikan user yang sedang diedit)
    const duplicate = users.some(
      (u) =>
        (u.email || "").toLowerCase() === form.email.toLowerCase() &&
        u.id_user !== editingId,
    );
    if (duplicate) {
      setFormError("Email sudah dipakai user lain. Gunakan email berbeda.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      if (editingId) {
        // ── UPDATE: PATCH /user?id_user=eq.<id> ──
        const res = await api.patch(
          "/user",
          {
            nama_lengkap: form.nama_lengkap,
            email: form.email,
            no_hp: form.no_hp,
            role: form.role,
            password: form.password,
          },
          {
            params: { id_user: `eq.${editingId}` },
            headers: { Prefer: "return=representation" },
          },
        );
        const updated = res.data[0];
        setUsers((prev) =>
          prev.map((u) =>
            u.id_user === editingId ? { ...u, ...updated } : u,
          ),
        );
        setSuccessAlert(`User "${form.nama_lengkap}" berhasil diperbarui.`);
      } else {
        // ── CREATE: POST /user ──
        const newUser = {
          id_user: `U-${Date.now()}`,
          nama_lengkap: form.nama_lengkap,
          email: form.email,
          no_hp: form.no_hp,
          password: form.password,
          role: form.role,
        };
        const res = await api.post("/user", newUser, {
          headers: { Prefer: "return=representation" },
        });
        const inserted = res.data[0] || newUser;
        setUsers((prev) => [inserted, ...prev]);
        setSuccessAlert(
          `User "${form.nama_lengkap}" berhasil ditambahkan dan tersimpan ke database.`,
        );
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      setTimeout(() => setSuccessAlert(null), 4000);
    } catch (err) {
      console.error("Gagal menyimpan user:", err);
      setFormError(
        err.response?.data?.message ||
          "Gagal menyimpan user ke server. Periksa koneksi atau hak akses.",
      );
    } finally {
      setSubmitting(false);
    }
  };

    const handleDelete = async (user) => {
    const ok = window.confirm(
      `Hapus user "${user.nama_lengkap}"? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!ok) return;
    try {
      // ── DELETE: DELETE /user?id_user=eq.<id> ──
      await api.delete("/user", {
        params: { id_user: `eq.${user.id_user}` },
      });
      setUsers((prev) => prev.filter((u) => u.id_user !== user.id_user));
      setSuccessAlert(`User "${user.nama_lengkap}" berhasil dihapus.`);
      setTimeout(() => setSuccessAlert(null), 4000);
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      setFetchError(
        err.response?.data?.message ||
          "Gagal menghapus user dari server. Periksa koneksi atau hak akses.",
      );
    }
  };

  const togglePassword = (id) =>
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));

    const roleBadge = (role) => {
    if (role === "admin") return { type: "danger", label: "Administrator" };
    return { type: "info", label: "Member" };
  };

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      {/* ── Page Title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">
            Manajemen User
          </h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">
            Tambah, ubah, dan hapus akun pengguna Zeus Gym
          </p>
        </div>
        <Button type="primary" icon={Plus} onClick={openAddModal}>
          Tambah User
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={UsersIcon}
          label="Total User"
          value={users.length}
          sub="akun terdaftar"
        />
        <StatCard
          icon={ShieldCheck}
          label="Administrator"
          value={totalAdmin}
          sub="akses penuh"
        />
                <StatCard
          icon={UserCog}
          label="Member"
          value={totalMember}
          sub="akses terbatas"
        />
      </div>

            {/* ── Alert error fetch / hapus ── */}
      {fetchError && (
        <Alert variant="destructive" className="relative">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
          <button
            onClick={() => setFetchError(null)}
            className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition-colors"
          >
            ✕
          </button>
        </Alert>
      )}

      {/* ── Alert sukses ── */}
      {successAlert && (
        <Alert variant="success" className="relative">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Berhasil!</AlertTitle>
          <AlertDescription>{successAlert}</AlertDescription>
          <button
            onClick={() => setSuccessAlert(null)}
            className="absolute top-3 right-3 text-green-600 hover:text-green-800 transition-colors"
          >
            ✕
          </button>
        </Alert>
      )}

      {/* ── Tabel ── */}
      <div
        className="bg-white rounded-2xl border border-[#E8C999]/50 overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <div className="px-6 py-4 border-b border-[#E8C999]/40 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#1D1616]">Daftar User</p>
            <p className="text-xs text-[#9e7a6e]">
              {filtered.length} dari {users.length} user
            </p>
          </div>
                    <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / no hp / email..."
            className="w-64"
          />
        </div>

        <div className="overflow-x-auto">
                    <Table
            headers={[
              "#",
              "Nama Lengkap",
              "No HP",
              "Email",
              "Role",
              "Password",
              "Aksi",
            ]}
          >
            {filtered.map((item, idx) => {
              const badge = roleBadge(item.role);
              const visible = visiblePasswords[item.id_user];
              return (
                <tr
                  key={item.id_user}
                  className="hover:bg-[#faf6f4] transition-colors"
                >
                  <td className="px-6 py-3.5 text-xs text-[#9e7a6e] font-medium">
                    {idx + 1}
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={item.nama_lengkap} size="sm" />
                      <span className="font-semibold text-[#1D1616] text-sm">
                        {item.nama_lengkap}
                      </span>
                    </div>
                  </td>

                                    <td className="px-6 py-3.5 font-mono text-xs text-[#5a3030] font-semibold">
                    {item.no_hp || "-"}
                  </td>

                  <td className="px-6 py-3.5 text-xs text-[#5a3030]">
                    {item.email}
                  </td>

                  <td className="px-6 py-3.5">
                    <Badge type={badge.type}>{badge.label}</Badge>
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#8E1616] font-bold">
                        {visible ? item.password : "••••••••"}
                      </span>
                                            <button
                        onClick={() => togglePassword(item.id_user)}
                        className="text-[#9e7a6e] hover:text-[#8E1616] transition-colors"
                        title={visible ? "Sembunyikan" : "Tampilkan"}
                      >
                        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-[#8E1616] hover:bg-[#8E1616]/10 transition-colors"
                        title="Edit"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon="👤"
            title="Belum ada user"
            message="Klik 'Tambah User' untuk membuat akun baru."
          />
        )}
      </div>

      {/* ── Modal Tambah / Edit User ── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Edit User" : "Tambah User Baru"}
        subtitle={
          editingId
            ? "Perbarui data akun pengguna"
            : "Isi data akun, password akan langsung tampil di daftar"
        }
                footer={
          <div className="flex gap-3">
            <Button
              type="secondary"
              fullWidth
              disabled={submitting}
              onClick={() => setShowModal(false)}
            >
              Batal
            </Button>
            <Button
              type="primary"
              fullWidth
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting
                ? "Menyimpan..."
                : editingId
                  ? "Simpan Perubahan"
                  : "Simpan User"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {formError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Periksa Kembali</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <InputField
            label="Nama Lengkap"
            name="nama_lengkap"
            value={form.nama_lengkap}
            onChange={handleChange}
            placeholder="Nama lengkap user..."
            required
          />
                    <InputField
            label="No HP"
            name="no_hp"
            value={form.no_hp}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@zeusgym.com"
            required
          />
          <SelectField
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            options={ROLE_OPTIONS}
          />
          <InputField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            required
          />

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700">
              ⚠️ <strong>Catatan:</strong> Password ditampilkan apa adanya hanya
              untuk demo. Pada aplikasi nyata, password harus di-hash di server
              dan tidak pernah dikirim balik ke halaman.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;