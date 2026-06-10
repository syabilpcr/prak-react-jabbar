import { useState } from "react";
import {
  AlertCircle, CheckCircle2, Info, TriangleAlert,
  Search, User, Mail,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Input } from "../components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";

const ShadcnUIPage = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div id="dashboard-container">
      <PageHeader title="Shadcn UI" breadcrumb={["Komponen", "Shadcn UI"]} />

      {/* ── 1. Input ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-base font-bold text-[#1D1616] mb-1">1. Komponen Input</h2>
        <p className="text-xs text-gray-400 mb-4">
          Komponen input dari shadcn/ui — mendukung berbagai tipe dan state.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Cari Anggota</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Ketik nama anggota..."
                className="pl-8 border-gray-300 focus-visible:ring-[#8E1616]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Nama Lengkap</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input type="text" placeholder="Masukkan nama..." className="pl-8 border-gray-300 focus-visible:ring-[#8E1616]" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Email (Disabled)</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input type="email" placeholder="admin@zeusgym.com" className="pl-8 border-gray-300" disabled />
            </div>
          </div>
        </div>
        {searchValue && (
          <p className="text-xs text-gray-400 mt-3">
            Mencari: <span className="font-semibold text-[#8E1616]">{searchValue}</span>
          </p>
        )}
      </div>

      <Separator className="my-2 bg-gray-100" />

      {/* ── 2. Alert ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 mt-6">
        <h2 className="text-base font-bold text-[#1D1616] mb-1">2. Komponen Alert</h2>
        <p className="text-xs text-gray-400 mb-4">
          Komponen alert dari shadcn/ui — 4 variant: default, destructive, success, warning.
        </p>
        <div className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Informasi</AlertTitle>
            <AlertDescription>
              Komponen ini dibuat di branch <strong>komponen-shadcnui</strong> lalu di-merge ke master.
            </AlertDescription>
          </Alert>
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Pembayaran Berhasil</AlertTitle>
            <AlertDescription>
              Pembayaran iuran bulan Juni untuk <strong>Budi Santoso</strong> berhasil diproses.
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Perhatian</AlertTitle>
            <AlertDescription>
              Terdapat <strong>5 anggota</strong> yang masa keanggotaannya hampir berakhir.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Gagal Memuat Data</AlertTitle>
            <AlertDescription>
              Terjadi kesalahan saat memuat data. Silakan refresh halaman.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <Separator className="my-2 bg-gray-100" />

      {/* ── 3. Separator ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
        <h2 className="text-base font-bold text-[#1D1616] mb-1">3. Komponen Separator</h2>
        <p className="text-xs text-gray-400 mb-4">
          Memisahkan konten secara horizontal maupun vertikal.
        </p>
        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-gray-700">Zeus Gym Admin Panel</p>
          <Separator className="bg-gray-200" />
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Dashboard</span>
            <span>Anggota</span>
            <span>Pembayaran</span>
            <span>Laporan</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Total: <strong className="text-[#8E1616]">120</strong></span>
          <Separator orientation="vertical" className="h-4 bg-gray-300" />
          <span>Aktif: <strong className="text-green-600">98</strong></span>
          <Separator orientation="vertical" className="h-4 bg-gray-300" />
          <span>Tidak Aktif: <strong className="text-red-500">22</strong></span>
        </div>
      </div>

      {/* ── Footer note ── */}
      <div className="mt-6 p-4 bg-[#3E0703]/5 rounded-xl border border-[#8E1616]/20">
        <p className="text-xs text-gray-500 text-center">
          ✅ Halaman ini dibuat di branch <strong className="text-[#8E1616]">komponen-shadcnui</strong> lalu
          di-merge ke <strong>master</strong>. Komponen: <strong>Input</strong>, <strong>Alert</strong>, <strong>Separator</strong>.
        </p>
      </div>
    </div>
  );
};

export default ShadcnUIPage;