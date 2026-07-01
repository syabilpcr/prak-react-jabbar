import { X, Download, Share2 } from "lucide-react";

const QRCodeModal = ({ isOpen, onClose, member }) => {
  if (!isOpen) return null;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MEMBER-${member?.id || "ZEUS001"}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm mx-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1D1616]">Kode Akses QR</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {member?.name || "Anggota"} • Member Zeus Gym
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="flex flex-col items-center py-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-200">
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Scan kode QR di pintu masuk gym untuk verifikasi akses
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            ID Anggota: {member?.id || "ZEUS-001"}
          </p>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
            <Download size={14} /> Simpan
          </button>
          <button className="flex-1 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
            <Share2 size={14} /> Bagikan
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
