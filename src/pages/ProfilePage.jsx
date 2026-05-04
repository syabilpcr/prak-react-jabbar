import { useState, useRef } from "react";
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
  Upload,
  X,
  Save,
} from "lucide-react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // State untuk form data
  const [formData, setFormData] = useState({
    fullName: "Admin Zeus",
    username: "@zeusadmin",
    email: "admin@zeusgym.com",
    phone: "+62 812 3456 7890",
    position: "Pemilik Gym / Administrator",
    address: "Pusat Zeus Gym, Jakarta",
    joinDate: "12 Jan 2024",
  });

  const [editForm, setEditForm] = useState({ ...formData });

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.match("image.*")) {
        alert("Hanya file gambar yang diperbolehkan!");
        return;
      }

      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setEditForm({ ...formData });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreviewImage(null);
  };

  const handleSaveEdit = () => {
    setFormData({ ...editForm });
    if (previewImage) {
      // Simpan gambar permanen
      localStorage.setItem("profileImage", previewImage);
    }
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  const handleEditFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // Load saved image on mount
  useState(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setPreviewImage(savedImage);
    }
  }, []);

  // Modal Edit Profil
  const EditProfileModal = () => {
    if (!isEditing) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-bold text-[#1D1616]">Edit Profil</h3>
              <p className="text-sm text-gray-500 mt-1">
                Perbarui informasi profil Anda
              </p>
            </div>
            <button
              onClick={handleCancelEdit}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Foto Profil */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="w-28 h-28 rounded-full bg-[#8E1616]/20 flex items-center justify-center text-4xl font-bold text-[#8E1616] border-4 border-[#8E1616]/30 overflow-hidden cursor-pointer group"
                  onClick={handleImageClick}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    formData.fullName.charAt(0)
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#8E1616] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all"
                >
                  <Camera size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Klik foto untuk mengganti
              </p>
            </div>

            {/* Form Edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pengguna
                </label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posisi
                </label>
                <input
                  type="text"
                  name="position"
                  value={editForm.position}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1D1616] focus:outline-none focus:ring-2 focus:ring-[#8E1616]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancelEdit}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex-1 bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save size={16} /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profil" breadcrumb={["Beranda", "Profil"]}>
        <button
          onClick={handleEditClick}
          className="bg-[#8E1616] hover:bg-[#D84040] text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300 text-sm flex items-center gap-2"
        >
          <Edit size={16} /> Edit Profil
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Card - Profile Info */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8E1616] to-[#D84040] flex items-center justify-center text-4xl font-bold text-white border-4 border-[#8E1616]/30 overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  formData.fullName.charAt(0)
                )}
              </div>
              <button
                onClick={handleImageClick}
                className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#8E1616] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all"
              >
                <Camera size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#1D1616]">
              {formData.fullName}
            </h2>
            <p className="text-gray-500 text-sm">{formData.position}</p>
            <div className="mt-4 px-4 py-2 rounded-xl bg-[#8E1616]/10 text-[#8E1616] font-medium text-sm">
              🏆 Akses Premium
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#8E1616]" />
              <span className="text-gray-600">{formData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#8E1616]" />
              <span className="text-gray-600">{formData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#8E1616]" />
              <span className="text-gray-600">{formData.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#8E1616]" />
              <span className="text-gray-600">
                Bergabung {formData.joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card - Personal Information */}
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
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 border border-[#8E1616]/30 text-[#8E1616] px-4 py-2 rounded-xl hover:bg-[#8E1616]/10 transition-all"
            >
              <Edit size={16} /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-500">Nama Lengkap</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                {formData.fullName}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Nama Pengguna</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                {formData.username}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Alamat Email</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                {formData.email}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Nomor Telepon</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                {formData.phone}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Posisi</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50 flex items-center gap-2">
                <Briefcase size={16} className="text-[#8E1616]" />{" "}
                {formData.position.split(" / ")[0]}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Alamat</label>
              <div className="mt-2 border border-gray-200 rounded-xl px-4 py-3 text-[#1D1616] font-medium bg-gray-50">
                {formData.address}
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

      {/* Edit Profile Modal */}
      <EditProfileModal />
    </div>
  );
};

export default ProfilePage;
