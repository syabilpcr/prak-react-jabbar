import { MapPin } from "lucide-react";

const GoogleMap = () => {
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.123456789012!2d101.4330!3d0.5868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5abb3ffef3c55%3A0x310ecab0318e1b24!2sZeus%20Gym!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-[#8C1007]" />
          <span className="text-[13px] font-bold text-[#1D1616]">
            Lokasi Zeus Gym — Rumbai, Pekanbaru
          </span>
        </div>
      <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
          🟢 Buka 07:00 - 22:00
        </span>
      </div>
      <div className="relative h-72">
        <iframe
          title="Zeus Gym Location"
          src={mapSrc}
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  )
};

export default GoogleMap;
