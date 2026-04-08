import React, { useState, useMemo } from 'react';
import InputField from './InputField';

// --- DEFINISI IKON-IKON SVG (Serasi dengan Contoh) ---
const Icons = {
  Nama: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
  Pekerjaan: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>,
  Umur: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
  Gender: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>,
  Email: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
};

const UserForm = () => {
  const [formData, setFormData] = useState({
    nama: '', email: '', umur: '', pekerjaan: '', gender: ''
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const validate = (name, value) => {
    let msg = '';
    if (name === 'nama') {
      if (!value) msg = 'Nama wajib diisi';
      else if (value.length < 3) msg = 'Min. 3 karakter';
      else if (/\d/.test(value)) msg = 'Nama dilarang pakai angka';
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) msg = 'Email diperlukan';
      else if (!emailRegex.test(value)) msg = 'Format email tidak valid';
    }
    if (name === 'umur') {
      if (!value) msg = 'Wajib isi usia';
      else if (value < 17) msg = 'Minimal akses usia 17 thn';
    }
    return msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const isFormValid = useMemo(() => (
    Object.values(formData).every(v => v !== '') && Object.values(errors).every(e => e === '')
  ), [formData, errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) setShowModal(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="main-container max-w-2xl w-full">
        
        {/* Area Header Form */}
        
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-amber-950 tracking-tighter uppercase italic">Update <span className="text-amber-600">Profil</span></h2>
          <p className="text-amber-900/50 mt-1 text-sm">Lengkapi data profil Anda sesuai kartu identitas</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Panggil InputField dengan prop 'icon' */}
          <InputField label="Nama" name="nama" value={formData.nama} onChange={handleChange} error={errors.nama} icon={Icons.Nama} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4">
            <InputField label="Pekerjaan" name="pekerjaan" type="select" options={['Developer', 'Designer', 'Manager']} value={formData.pekerjaan} onChange={handleChange} icon={Icons.Pekerjaan} />
            <InputField label="Umur" name="umur" value={formData.umur} onChange={handleChange} error={errors.umur} icon={Icons.Umur} />
          </div>

          <InputField label="Gender" name="gender" type="select" options={['Laki-laki', 'Perempuan']} value={formData.gender} onChange={handleChange} icon={Icons.Gender} />
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} icon={Icons.Email} />

          <button 
            type="submit" 
            disabled={!isFormValid}
            className={`btn-submit-profile ${!isFormValid ? 'opacity-20 grayscale pointer-events-none' : ''}`}
          >
            Daftarkan Data Saya
          </button>
        </form>
      </div>

      {/* --- POP-UP MODAL (Matching Theme) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-amber-100 rotate-12 transition-transform hover:rotate-0">
               <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-black text-amber-950 tracking-tighter mb-2 uppercase italic">Data Tersimpan!</h3>
            <p className="text-amber-900/60 text-sm mb-10leading-relaxed px-4">
              Selamat <strong>{formData.nama}</strong>, pendaftaran Anda sebagai <strong>{formData.pekerjaan}</strong> telah kami verifikasi.
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-amber-950 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Lanjut ke Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserForm;