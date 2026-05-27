import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, Wallet, CalendarCheck, TrendingUp } from "lucide-react";
import membersData from "../data/membersData";

// ── Components Pertemuan 10 ───────────────────────────────────
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

// ── Config ────────────────────────────────────────────────────
const planConfig = {
  Gold: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  Silver: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  Bronze: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-400",
  },
};

const statusConfig = {
  Active: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
    border: "border-green-100",
  },
  Expired: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
    border: "border-red-100",
  },
  Expiring: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-100",
  },
};

// StatCard, Badge, Avatar, Table, SearchBar, Modal, InputField, SelectField, Button
// sudah diimport dari components/ (Pertemuan 10)

// ── Main Component ────────────────────────────────────────────
const Members = () => {
  const [members, setMembers] = useState(membersData);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "Bronze",
    trainer: "Coach Budi",
  });

  const filtered = members.filter((m) => {
    const nama = (m.nama_lengkap || m.name || "").toLowerCase();
    const kode = (m.id_member || m.code || "").toLowerCase();
    const matchSearch = nama.includes(search.toLowerCase()) || kode.includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || (m.status_member || m.status || "").toLowerCase() === filterStatus;
    const matchGender = filterGender === "all" || m.jenis_kelamin === filterGender;
    const matchPlan = filterPlan === "all" || (m.plan || "").toLowerCase() === filterPlan;
    return matchSearch && matchStatus && matchGender && matchPlan;
  });

  const totalActive = members.filter((m) => (m.status_member || m.status) === "aktif" || m.status === "Active").length;
  const totalExpired = members.filter((m) => (m.status_member || m.status) === "tidak aktif" || m.status === "Expired").length;
  const totalRevenue = members.reduce((s, m) => s + m.price, 0);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone) return;
    const planPrices = { Gold: 500000, Silver: 300000, Bronze: 150000 };
    const today = new Date().toISOString().split("T")[0];
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const newMember = {
      id: members.length + 1,
      code: `ZG-${String(members.length + 1).padStart(3, "0")}`,
      status: "Active",
      joined: today,
      expiry,
      visits: 0,
      price: planPrices[form.plan] || 150000,
      ...form,
    };
    setMembers([newMember, ...members]);
    setForm({
      name: "",
      email: "",
      phone: "",
      plan: "Bronze",
      trainer: "Coach Budi",
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-5 bg-[#f5f0eb] min-h-screen">
      {/* ── Page Title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-black text-[#1D1616]">Anggota Gym</h1>
          <p className="text-[12px] text-[#9e7a6e] mt-0.5">
            Kelola semua data anggota Zeus Gym
          </p>
        </div>
        <Button type="primary" icon={Plus} onClick={() => setShowModal(true)}>
          Tambah Member
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Member"
          value={members.length}
          change="12.5%"
          trend="up"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={CalendarCheck}
          label="Member Aktif"
          value={totalActive}
          change="5.3%"
          trend="up"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={TrendingUp}
          label="Tidak Aktif"
          value={totalExpired}
          change="2.1%"
          trend="down"
          sub="dari bulan lalu"
        />
        <StatCard
          icon={Wallet}
          label="Total Pendapatan"
          value={`Rp ${(totalRevenue / 1000000).toFixed(1)} Jt`}
          change="18.2%"
          trend="up"
          sub="dari bulan lalu"
        />
      </div>

      {/* ── Tabel ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        {/* Header tabel */}
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1D1616]">Daftar Member</p>
              <p className="text-xs text-[#9e7a6e]">
                {filtered.length} dari {members.length} member
              </p>
            </div>
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama / ID..."
              className="w-52"
            />
          </div>
          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-[#9e7a6e] uppercase tracking-wider">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="tidak aktif">Tidak Aktif</option>
            </select>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Gender</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-3 py-1.5 bg-[#f8f3ee] border border-[#e8dfd6] rounded-lg text-xs text-[#5a3030] focus:outline-none focus:ring-2 focus:ring-[#8C1007]/20"
            >
              <option value="all">Semua Plan</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
            {(filterStatus !== "all" || filterGender !== "all" || filterPlan !== "all") && (
              <button
                onClick={() => { setFilterStatus("all"); setFilterGender("all"); setFilterPlan("all"); }}
                className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-semibold hover:bg-red-100 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            headers={[
              "#",
              "ID Member",
              "Nama Lengkap",
              "JK",
              "No HP",
              "Tgl Gabung",
              "Tgl Berakhir",
              "Status",
              "Pin Akses",
            ]}
          >
            {filtered.length === 0
              ? null
              : filtered.map((item, idx) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#faf6f4] transition-colors"
                    >
                      <td className="px-6 py-3.5 text-xs text-[#9e7a6e] font-medium">
                        {idx + 1}
                      </td>

                      <td className="px-6 py-3.5 font-mono text-xs text-[#9e7a6e] font-semibold">
                        {item.id_member || item.code}
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            name={item.nama_lengkap || item.name}
                            size="sm"
                          />
                          <div>
                            <Link
                              to={`/members/${item.id}`}
                              className="font-semibold text-[#8C1007] hover:text-[#a01a0a] hover:underline transition-colors text-sm"
                            >
                              {item.nama_lengkap || item.name}
                            </Link>
                            <p className="text-[10px] text-[#9e7a6e]">
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 text-xs text-[#5a3030] text-center">
                        <Badge
                          type={item.jenis_kelamin === "L" ? "info" : "warning"}
                        >
                          {item.jenis_kelamin === "L" ? "L" : "P"}
                        </Badge>
                      </td>

                      <td className="px-6 py-3.5 text-xs text-[#5a3030]">
                        {item.no_hp || item.phone}
                      </td>

                      <td className="px-6 py-3.5 text-xs text-[#5a3030]">
                        {item.tgl_gabung || item.joined}
                      </td>

                      <td className="px-6 py-3.5 text-xs text-[#5a3030]">
                        {item.tgl_berakhir || item.expiry}
                      </td>

                      <td className="px-6 py-3.5">
                        <Badge
                          type={
                            (item.status_member || item.status) === "aktif" ||
                            item.status === "Active"
                              ? "success"
                              : "danger"
                          }
                          dot
                        >
                          {item.status_member || item.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-3.5 font-mono text-xs text-[#8C1007] font-bold">
                        {item.pin_akses || "-"}
                      </td>
                    </tr>
                  );
                })}
          </Table>
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon="🔍"
            title="Member tidak ditemukan"
            message="Coba ubah kata kunci pencarian Anda."
          />
        )}
      </div>

      {/* ── Modal Tambah Member ── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Tambah Member Baru"
        subtitle="Isi data member dengan lengkap"
        footer={
          <div className="flex gap-3">
            <Button
              type="secondary"
              fullWidth
              onClick={() => setShowModal(false)}
            >
              Batal
            </Button>
            <Button type="primary" fullWidth onClick={handleSubmit}>
              Simpan Member
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <InputField
            label="Nama Lengkap"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama member..."
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@contoh.com"
            required
          />
          <InputField
            label="Telepon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
            required
          />
          <SelectField
            label="Plan Membership"
            name="plan"
            value={form.plan}
            onChange={handleChange}
            options={[
              { value: "Gold", label: "Gold — Rp 500.000/bulan" },
              { value: "Silver", label: "Silver — Rp 300.000/bulan" },
              { value: "Bronze", label: "Bronze — Rp 150.000/bulan" },
            ]}
          />
          <SelectField
            label="Trainer"
            name="trainer"
            value={form.trainer}
            onChange={handleChange}
            options={["Coach Budi", "Coach Rina", "Coach Deni", "Coach Yanto"]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Members;
