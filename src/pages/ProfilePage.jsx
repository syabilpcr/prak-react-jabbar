import PageHeader from "../components/PageHeader";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit,
  Camera,
  Dumbbell,
} from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Profil" breadcrumb={["Beranda", "Profil"]}>
        <button className="bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300 text-sm">
          Edit Profil
        </button>
      </PageHeader>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#8E1616]/20 flex items-center justify-center text-4xl font-bold text-[#8E1616] border-4 border-[#8E1616]/30">
                Z
              </div>
              <button className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#8E1616] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="mt-5 text-2xl font-bold text-[#1D1616]">
              Admin Zeus
            </h2>
            <p className="text-gray-500 text-sm">Pemilik Gym / Administrator</p>
            <div className="mt-4 px-4 py-2 rounded-xl bg-[#8E1616]/10 text-[#8E1616] font-medium text-sm">
              🏆 Akses Premium
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#8E1616]" />
              <span className="text-gray-600">admin@zeusgym.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#8E1616]" />
              <span className="text-gray-600">+62 812 3456 7890</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#8E1616]" />
              <span className="text-gray-600">Jakarta, Indonesia</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#8E1616]" />
              <span className="text-gray-600">Bergabung 12 Jan 2024</span>
            </div>
          </div>
        </div>
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1D1616]">
                Informasi Pribadi
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Detail akun dan profil
              </p>
            </div>
            <button className="flex items-center gap-2 border border-[#8E1616]/30 text-[#8E1616] px-4 py-2 rounded-xl hover:bg-[#8E1616]/10 transition-all">
              <Edit size={16} /> Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-500">Nama Lengkap</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                Admin Zeus
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Nama Pengguna</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                @zeusadmin
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Alamat Email</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                admin@zeusgym.com
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Nomor Telepon</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                +62 812 3456 7890
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Posisi</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50 flex items-center gap-2">
                <Briefcase size={16} className="text-[#8E1616]" /> Pemilik Gym
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Alamat</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                Pusat Zeus Gym, Jakarta
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-bold text-[#1D1616] mb-4 flex items-center gap-2">
              <Dumbbell size={18} className="text-[#8E1616]" /> Statistik Gym
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#8E1616]/5 rounded-2xl p-5 border border-[#8E1616]/10">
                <p className="text-sm text-gray-500">Total Anggota</p>
                <h4 className="text-2xl font-bold text-[#1D1616] mt-2">847</h4>
              </div>
              <div className="bg-[#8E1616]/5 rounded-2xl p-5 border border-[#8E1616]/10">
                <p className="text-sm text-gray-500">Anggota Aktif</p>
                <h4 className="text-2xl font-bold text-[#1D1616] mt-2">623</h4>
              </div>
              <div className="bg-[#8E1616]/5 rounded-2xl p-5 border border-[#8E1616]/10">
                <p className="text-sm text-gray-500">Pendapatan Bulanan</p>
                <h4 className="text-2xl font-bold text-[#8E1616] mt-2">
                  Rp 148 Jt
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
