import React from 'react';

const InputField = ({ label, name, type = "text", value, onChange, error, options = [] }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Pilih {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      )}

      {/* Menampilkan pesan error di bawah input */}
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default InputField;