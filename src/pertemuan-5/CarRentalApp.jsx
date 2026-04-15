CarRentalApp.jsx

import { useState } from "react";
import carData from "./cars.json";
import GuestView from "./GuestView";
import AdminView from "./AdminView";

export default function CarRentalApp() {
    const [viewMode, setViewMode] = useState("guest"); // guest atau admin
    const [formState, setFormState] = useState({
        search: "",
        category: "",
        status: ""
    });

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    // Logika Filter & Search
    const filteredCars = carData.filter((car) => {
        const matchesSearch = car.name.toLowerCase().includes(formState.search.toLowerCase()) || 
                             car.brand.toLowerCase().includes(formState.search.toLowerCase());
        const matchesCategory = formState.category ? car.category === formState.category : true;
        const matchesStatus = formState.status ? car.status === formState.status : true;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-10">
            {/* Header & Toggle View */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">LUXE<span className="text-indigo-600">DRIVE</span></h1>
                    <p className="text-slate-500">Premium Car Rental Experience</p>
                </div>
                
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    <button 
                        onClick={() => setViewMode("guest")}
                        className={`px-6 py-2 rounded-lg transition-all ${viewMode === 'guest' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        Guest View
                    </button>
                    <button 
                        onClick={() => setViewMode("admin")}
                        className={`px-6 py-2 rounded-lg transition-all ${viewMode === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        Admin View
                    </button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                        type="text" 
                        name="search"
                        placeholder="Search car name or brand..." 
                        onChange={handleChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <select name="category" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                        <option value="">All Categories</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Sport">Sport</option>
                        <option value="Electric">Electric</option>
                    </select>
                    <select name="status" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                    </select>
                </div>
            </div>

            {/* Render View Based on State */}
            <div className="max-w-7xl mx-auto">
                {viewMode === "guest" ? (
                    <GuestView data={filteredCars} />
                ) : (
                    <AdminView data={filteredCars} />
                )}
            </div>
        </div>
    );
}
