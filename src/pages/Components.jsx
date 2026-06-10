/**
 * Components.jsx — Halaman playground 15 component Zeus Gym
 * Path: /components
 * Pertemuan 10
 */
import { useState } from "react";
import PageHeader from "../components/PageHeader";

// ── 15 Components Pertemuan 10 ────────────────────────────────
// 1-3: Basic Components
import Button from "../components/Button";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
// 4: Basic Component
import StatCard from "../components/StatCard";
// 5-7: Data Display Components
import Card from "../components/Card";
import Table from "../components/Table";
import MemberCard from "../components/MemberCard";
// 8-10: Form Components
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import SearchBar from "../components/SearchBar";
// 11-13: Feedback Components
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
// 14: Data Display Component
import ProgressBar from "../components/ProgressBar";
// 15: Section Component
import SectionHeader from "../components/SectionHeader";

import {
  Dumbbell,
  Users,
  Wallet,
  CalendarCheck,
  TrendingUp,
  Search,
  Mail,
} from "lucide-react";

// ── Demo data ─────────────────────────────────────────────────
const demoHeaders = ["No", "Nama Member", "Status", "Harga"];
const demoMembers = [
  { id: 1, name: "Ahmad Fauzi", status: "Active", price: 300000 },
  {
    id: 2,
    name: "Rina Sari",
    status: "Expiring",
    price: 300000,
  },
  {
    id: 3,
    name: "Budi Santoso",
    status: "Expired",
    price: 300000,
  },
];

const statusBadgeType = {
  Active: "success",
  Expiring: "warning",
  Expired: "danger",
};

// ── Komponen Section Wrapper ──────────────────────────────────
const Section = ({ title, desc, children }) => (
  <div
    className="bg-white rounded-2xl border border-gray-100 p-6"
    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
  >
    <div className="mb-1">
      <h2 className="text-[15px] font-black text-[#1D1616]">{title}</h2>
      <p className="text-[11.5px] text-[#9e7a6e] mt-0.5">{desc}</p>
    </div>
    <div className="mt-4 h-px bg-gray-100 mb-5" />
    {children}
  </div>
);

// ── Halaman Utama ─────────────────────────────────────────────
const Components = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [alertShown, setAlertShown] = useState(true);
  const [inputVal, setInputVal] = useState("");
  const [selectVal, setSelectVal] = useState("Trainer A");
  const [searchVal, setSearchVal] = useState("");

  return (
    <div className="p-6 space-y-6 bg-[#f5f0eb] min-h-screen">
      <PageHeader title="Component Library" breadcrumb={["Components"]}>
        <span className="text-[11px] bg-[#8C1007]/10 text-[#8C1007] font-bold px-3 py-1.5 rounded-lg">
          15 Components · Pertemuan 10
        </span>
      </PageHeader>

      {/* ── 1. Button ── */}
      <Section
        title="1. Button"
        desc="Basic Component — digunakan di seluruh halaman Zeus Gym"
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button type="primary">Primary</Button>
            <Button type="secondary">Secondary</Button>
            <Button type="danger">Danger</Button>
            <Button type="success">Success</Button>
            <Button type="warning">Warning</Button>
            <Button type="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="primary" size="sm">
              Small
            </Button>
            <Button type="primary" size="md">
              Medium
            </Button>
            <Button type="primary" size="lg">
              Large
            </Button>
            <Button type="primary" icon={Dumbbell}>
              Dengan Icon
            </Button>
            <Button type="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </Section>

      {/* ── 2. Badge ── */}
      <Section
        title="2. Badge"
        desc="Basic Component — label status member, plan, dan pembayaran"
      >
        <div className="flex flex-wrap gap-3">
          <Badge type="primary">Primary</Badge>
          <Badge type="success" dot>
            Active
          </Badge>
          <Badge type="danger" dot>
            Expired
          </Badge>
          <Badge type="warning" dot>
            Expiring
          </Badge>
          <Badge type="info">Info</Badge>
          <Badge type="secondary">Secondary</Badge>
        </div>
      </Section>

      {/* ── 3. Avatar ── */}
      <Section
        title="3. Avatar"
        desc="Basic Component — inisial / foto profil anggota dan admin"
      >
        <div className="flex items-end gap-4">
          <div className="text-center">
            <Avatar name="Ahmad Fauzi" size="xl" />
            <p className="text-[10px] text-[#9e7a6e] mt-1">XL</p>
          </div>
          <div className="text-center">
            <Avatar name="Rina Sari" size="lg" />
            <p className="text-[10px] text-[#9e7a6e] mt-1">LG</p>
          </div>
          <div className="text-center">
            <Avatar name="Budi Santoso" size="md" />
            <p className="text-[10px] text-[#9e7a6e] mt-1">MD</p>
          </div>
          <div className="text-center">
            <Avatar name="Zeus Gym" size="sm" />
            <p className="text-[10px] text-[#9e7a6e] mt-1">SM</p>
          </div>
          <div className="text-center">
            <Avatar name="Admin" size="xs" />
            <p className="text-[10px] text-[#9e7a6e] mt-1">XS</p>
          </div>
          <Avatar name="Coach Budi" size="md" />
          <Avatar name="Yoga Pagi" size="md" />
          <Avatar name="Deni Kurniawan" size="md" />
        </div>
      </Section>

      {/* ── 4. StatCard ── */}
      <Section
        title="4. StatCard"
        desc="Basic Component — kartu statistik ringkasan di Dashboard dan halaman lain"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Anggota"
            value="847"
            change="+12.5%"
            trend="up"
            sub="dari bulan lalu"
          />
          <StatCard
            icon={Wallet}
            label="Pendapatan MTD"
            value="Rp 184,5 Jt"
            change="+18.2%"
            trend="up"
            sub="dari bulan lalu"
          />
          <StatCard
            icon={CalendarCheck}
            label="Anggota Aktif"
            value="623"
            change="+5.3%"
            trend="up"
            sub="dari bulan lalu"
          />
          <StatCard
            icon={TrendingUp}
            label="Tingkat Retensi"
            value="86%"
            change="-2.1%"
            trend="down"
            sub="dari bulan lalu"
          />
        </div>
      </Section>

      {/* ── 5. Card ── */}
      <Section
        title="5. Card"
        desc="Data Display Component — pembungkus konten dengan header opsional"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm font-bold text-[#1D1616]">Card Sederhana</p>
            <p className="text-xs text-[#9e7a6e] mt-1">
              Tanpa header, isi langsung di dalam Card.
            </p>
          </Card>
          <Card title="Card dengan Header" subtitle="Subtitle opsional">
            <p className="text-xs text-[#9e7a6e]">
              Konten card dengan judul di atas.
            </p>
          </Card>
          <Card
            title="Card dengan Aksi"
            action={
              <Button type="primary" size="sm">
                Lihat Semua
              </Button>
            }
          >
            <p className="text-xs text-[#9e7a6e]">
              Card dengan tombol aksi di header.
            </p>
          </Card>
        </div>
      </Section>

      {/* ── 6. Table ── */}
      <Section
        title="6. Table"
        desc="Data Display Component — tabel data anggota, pembayaran, absensi"
      >
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <Table headers={demoHeaders}>
            {demoMembers.map((m, i) => (
              <tr key={m.id} className="hover:bg-[#faf6f4] transition-colors">
                <td className="px-6 py-3.5 text-xs text-[#9e7a6e]">{i + 1}</td>
                <td className="px-6 py-3.5 text-sm font-semibold text-[#1D1616]">
                  {m.name}
                </td>
                <td className="px-6 py-3.5">
                  <Badge type={planBadgeType[m.plan]} dot>
                    {m.plan}
                  </Badge>
                </td>
                <td className="px-6 py-3.5">
                  <Badge type={statusBadgeType[m.status]} dot>
                    {m.status}
                  </Badge>
                </td>
                <td className="px-6 py-3.5 text-sm font-bold text-[#1D1616]">
                  Rp {m.price.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </Section>

      {/* ── 7. MemberCard ── */}
      <Section
        title="7. MemberCard"
        desc="Data Display Component — kartu info anggota dalam tampilan grid"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MemberCard
            name="Ahmad Fauzi"
            code="ZG-001"
            status="Active"
            email="ahmad@mail.com"
            trainer="Coach Budi"
            visits={24}
            price={300000}
          />
          <MemberCard
            name="Rina Sari"
            code="ZG-002"
            status="Expiring"
            email="rina@mail.com"
            trainer="Coach Rina"
            visits={12}
            price={300000}
          />
          <MemberCard
            name="Budi Santoso"
            code="ZG-003"
            status="Expired"
            email="budi@mail.com"
            trainer="Coach Deni"
            visits={5}
            price={300000}
          />
        </div>
      </Section>

      {/* ── 8. InputField ── */}
      <Section
        title="8. InputField"
        desc="Form Component — input teks dengan label, icon, validasi error"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <InputField
            label="Nama Anggota"
            placeholder="Nama lengkap..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            required
          />
          <InputField
            label="Email"
            type="email"
            placeholder="email@zeusgym.com"
            icon={Mail}
            value=""
            onChange={() => {}}
          />
          <InputField
            label="Dengan Error"
            placeholder="Nama lengkap..."
            value=""
            onChange={() => {}}
            error="Nama tidak boleh kosong"
          />
        </div>
      </Section>

      {/* ── 9. SelectField ── */}
      <Section
        title="9. SelectField"
        desc="Form Component — dropdown pilihan plan, trainer, status, dll."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SelectField
            label="Plan Membership"
            value={selectVal}
            onChange={(e) => setSelectVal(e.target.value)}
            options={[
              { value: "Gold", label: "Gold — Rp 500.000/bulan" },
              { value: "Silver", label: "Silver — Rp 300.000/bulan" },
              { value: "Bronze", label: "Bronze — Rp 150.000/bulan" },
            ]}
            required
          />
          <SelectField
            label="Pilih Trainer"
            value="Coach Budi"
            onChange={() => {}}
            options={["Coach Budi", "Coach Rina", "Coach Deni", "Coach Yanto"]}
          />
          <SelectField
            label="Filter Status (Disabled)"
            value="Active"
            onChange={() => {}}
            options={["Active", "Expiring", "Expired"]}
            disabled
          />
        </div>
      </Section>

      {/* ── 10. SearchBar ── */}
      <Section
        title="10. SearchBar"
        desc="Form Component — pencarian member, pembayaran, absensi, feedback"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SearchBar
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Cari member Zeus Gym..."
          />
          <SearchBar
            value=""
            onChange={() => {}}
            placeholder="Cari riwayat pembayaran..."
          />
        </div>
      </Section>

      {/* ── 11. Modal ── */}
      <Section
        title="11. Modal"
        desc="Feedback Component — dialog popup untuk form tambah/edit data"
      >
        <Button type="primary" icon={Users} onClick={() => setModalOpen(true)}>
          Buka Modal Demo
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Contoh Modal Zeus Gym"
          subtitle="Ini adalah contoh penggunaan Modal component"
          footer={
            <div className="flex gap-3">
              <Button
                type="secondary"
                fullWidth
                onClick={() => setModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="primary"
                fullWidth
                onClick={() => setModalOpen(false)}
              >
                Simpan
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <InputField
              label="Nama Anggota"
              placeholder="Nama lengkap..."
              value=""
              onChange={() => {}}
              required
            />
            <SelectField
              label="Trainer"
              value="Trainer A"
              onChange={() => {}}
              options={["Trainer A", "Trainer B", "Trainer C"]}
            />
            <Alert
              type="info"
              title="Info"
              message="Isi semua field dengan benar sebelum menyimpan."
            />
          </div>
        </Modal>
      </Section>

      {/* ── 12. Alert ── */}
      <Section
        title="12. Alert"
        desc="Feedback Component — notifikasi sukses, error, warning, informasi"
      >
        <div className="space-y-3">
          {alertShown && (
            <Alert
              type="success"
              title="Data Berhasil Disimpan"
              message="Member baru Ahmad Fauzi telah berhasil didaftarkan ke Zeus Gym."
              onClose={() => setAlertShown(false)}
            />
          )}
          {!alertShown && (
            <Button
              type="secondary"
              size="sm"
              onClick={() => setAlertShown(true)}
            >
              Tampilkan Alert
            </Button>
          )}
          <Alert
            type="warning"
            title="Keanggotaan Hampir Habis"
            message="3 member akan expired dalam 7 hari ke depan."
          />
          <Alert
            type="danger"
            title="Pembayaran Gagal"
            message="Transaksi QRIS tidak dapat diproses. Coba lagi."
          />
          <Alert
            type="info"
            title="Tips"
            message="Gunakan filter untuk mempercepat pencarian data."
          />
        </div>
      </Section>

      {/* ── 13. EmptyState ── */}
      <Section
        title="13. EmptyState"
        desc="Feedback Component — tampilan saat data kosong atau pencarian tidak ketemu"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-dashed border-gray-200 rounded-xl">
            <EmptyState
              icon="🏋️"
              title="Belum Ada Anggota"
              message="Tambahkan anggota pertama Zeus Gym sekarang."
              action={
                <Button type="primary" size="sm" icon={Users}>
                  Tambah Member
                </Button>
              }
            />
          </div>
          <div className="border border-dashed border-gray-200 rounded-xl">
            <EmptyState
              icon="🔍"
              title="Member Tidak Ditemukan"
              message="Coba ubah kata kunci pencarian Anda."
            />
          </div>
        </div>
      </Section>

      {/* ── 14. ProgressBar ── */}
      <Section
        title="14. ProgressBar"
        desc="Data Display Component — penggunaan area gym, tingkat hunian, pencapaian target"
      >
        <div className="space-y-3">
          <ProgressBar label="Area Cardio" value={78} max={100} />
          <ProgressBar label="Angkat Beban" value={64} max={100} />
          <ProgressBar label="Area Yoga" value={45} max={100} />
          <ProgressBar label="Kolam Renang" value={32} max={100} />
          <ProgressBar
            label="Target Anggota"
            value={847}
            max={1000}
            color="#22c55e"
          />
        </div>
      </Section>

      {/* ── 15. SectionHeader ── */}
      <Section
        title="15. SectionHeader"
        desc="Section Component — header sub-bagian dalam halaman (dipakai di Dashboard, dll.)"
      >
        <div className="space-y-4">
          <div className="border border-dashed border-gray-200 rounded-xl p-4">
            <SectionHeader title="Aktivitas Terbaru" />
            <p className="text-[11px] text-[#9e7a6e]">
              ← SectionHeader default dengan tombol ⋯
            </p>
          </div>
          <div className="border border-dashed border-gray-200 rounded-xl p-4">
            <SectionHeader
              title="Daftar Kelas Hari Ini"
              subtitle="3 kelas tersedia"
              action={
                <Button type="primary" size="sm">
                  Lihat Semua
                </Button>
              }
            />
            <p className="text-[11px] text-[#9e7a6e]">
              ← SectionHeader dengan subtitle + custom action
            </p>
          </div>
          <div className="border border-dashed border-gray-200 rounded-xl p-4">
            <SectionHeader title="Penggunaan Area Gym" action={null} />
            <p className="text-[11px] text-[#9e7a6e]">
              ← SectionHeader tanpa tombol (action=null)
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Components;
