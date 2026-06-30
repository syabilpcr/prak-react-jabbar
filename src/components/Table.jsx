export default function Table({ headers = [], children, loading = false, emptyMessage = "Data tidak ditemukan." }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#3E0703]">
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left px-6 py-3.5 text-[10px] font-bold text-[#FFF0C4]/70 uppercase tracking-widest whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f5f0eb]">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-12 text-[#9e7a6e] text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#8C1007] border-t-transparent rounded-full animate-spin" />
                  Memuat data...
                </div>
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
      {!loading && !children && (
        <div className="text-center py-12 text-[#9e7a6e] text-sm">{emptyMessage}</div>
      )}
    </div>
  );
}