
export default function Modal({ open, onClose, title, subtitle, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            {title && (
              <h3 className="text-base font-bold text-[#1D1616]">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#9e7a6e] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f8f3ee] rounded-xl transition-colors text-[#9e7a6e] hover:text-[#1D1616]"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-7 pb-6 flex-shrink-0">{footer}</div>
        )}
      </div>
    </div>
  );
}