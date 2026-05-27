const typeStyles = {
  success: {
    wrapper: "bg-green-50 border-green-200 text-green-800",
    icon: "✅",
    title: "text-green-800",
    message: "text-green-700",
  },
  danger: {
    wrapper: "bg-red-50 border-red-200",
    icon: "❌",
    title: "text-red-800",
    message: "text-red-700",
  },
  warning: {
    wrapper: "bg-amber-50 border-amber-200",
    icon: "⚠️",
    title: "text-amber-800",
    message: "text-amber-700",
  },
  info: {
    wrapper: "bg-blue-50 border-blue-200",
    icon: "ℹ️",
    title: "text-blue-800",
    message: "text-blue-700",
  },
};

export default function Alert({ type = "info", title, message, onClose }) {
  const styles = typeStyles[type] || typeStyles.info;
  return (
    <div className={`flex items-start gap-3 border rounded-xl px-4 py-3.5 ${styles.wrapper}`}>
      <span className="text-base flex-shrink-0 mt-0.5">{styles.icon}</span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`text-[12.5px] font-bold ${styles.title}`}>{title}</p>
        )}
        {message && (
          <p className={`text-[11.5px] mt-0.5 ${styles.message}`}>{message}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[#9e7a6e] hover:text-[#1D1616] transition-colors flex-shrink-0 text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
}