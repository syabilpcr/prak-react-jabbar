import { useState } from "react";
import { X, Star } from "lucide-react";

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (onSubmit) onSubmit({ rating, comment });
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md mx-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1D1616]">
              Berikan Umpan Balik
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Bantu kami meningkatkan Zeus Gym
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="flex justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`${star <= (hoverRating || rating) ? "fill-[#D84040] text-[#D84040]" : "text-gray-300"} transition-colors`}
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ceritakan pengalaman Anda di Zeus Gym..."
          rows={4}
          className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-[#1D1616] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:border-[#8E1616] transition-all"
        />
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
          >
            Kirim Umpan Balik
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
