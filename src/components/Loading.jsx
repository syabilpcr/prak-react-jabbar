export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#EEEEEE]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#8E1616]/30 border-t-[#8E1616] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#8E1616] text-2xl font-bold">ZEUS</span>
        </div>
      </div>
      <p className="text-[#8E1616] mt-4 text-lg font-semibold">Memuat...</p>
    </div>
  );
}