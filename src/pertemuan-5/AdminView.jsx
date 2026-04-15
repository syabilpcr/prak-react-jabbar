export default function AdminView({ data }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">Car Details</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Specifications</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Owner Info</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((car) => (
                            <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={car.image} className="w-12 h-12 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-bold text-slate-800">{car.name}</p>
                                            <p className="text-xs text-slate-500">{car.brand} • {car.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    {car.specifications.engine} <br/>
                                    <span className="text-xs text-slate-400">{car.specifications.transmission}</span>
                                </td>
                                <td className="p-4 text-sm">
                                    <p className="font-medium text-slate-700">{car.owner.name}</p>
                                    <p className="text-xs text-indigo-500">{car.owner.location}</p>
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${car.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {car.status}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-slate-800">${car.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
