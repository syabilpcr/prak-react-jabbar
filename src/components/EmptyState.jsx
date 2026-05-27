
export default function EmptyState({ icon = "📭", title = "Data Kosong", message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-[14px] font-bold text-[#1D1616] mb-1">{title}</p>
      {message && (
        <p className="text-[12px] text-[#9e7a6e] max-w-xs">{message}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
