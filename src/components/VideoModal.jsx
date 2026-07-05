import { useEffect } from "react";
import { X } from "lucide-react";

export default function VideoModal({ isOpen, onClose, videoUrl }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  
  // Format YouTube URL to embed format if necessary
  let formattedUrl = videoUrl;
  if (isYouTube) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    if (match && match[2].length === 11) {
      formattedUrl = `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 transition-opacity duration-300"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl aspect-video bg-[#0b0b0d] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 hover:border-[#D84040]/30 transition-colors duration-500"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 hover:bg-[#D84040] text-white/80 hover:text-white border border-white/10 hover:border-[#D84040] transition-all duration-300 hover:scale-105"
          aria-label="Close video"
        >
          <X size={18} />
        </button>

        {/* Video Player */}
        <div className="w-full h-full">
          {isYouTube ? (
            <iframe
              src={formattedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <video
              src={videoUrl}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
