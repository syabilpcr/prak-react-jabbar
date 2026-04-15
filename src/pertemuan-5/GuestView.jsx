export default function GuestView({ data }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((car) => (
                <div key={car.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
                    <div className="h-48 overflow-hidden relative">
                        <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${car.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {car.status}
                        </span>
                    </div>
                    <div className="p-6">
                        <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest mb-1">{car.brand}</p>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">{car.name}</h3>
                        
                        <div className="grid grid-cols-3 gap-2 mb-6 text-[10px] text-slate-500 uppercase font-semibold">
                            <div className="bg-slate-50 p-2 rounded-lg text-center">⛽ {car.specifications.fuel}</div>
                            <div className="bg-slate-50 p-2 rounded-lg text-center">⚙️ {car.specifications.transmission}</div>
                            <div className="bg-slate-50 p-2 rounded-lg text-center">🏎️ {car.category}</div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                            <div>
                                <p className="text-slate-400 text-xs">Daily Rate</p>
                                <p className="text-xl font-black text-slate-800">${car.price}<span className="text-sm font-normal text-slate-500">/day</span></p>
                            </div>
                            <button className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors">Rent Now</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
