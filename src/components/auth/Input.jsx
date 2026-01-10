import React from "react";

const Input = ({ label, type = "text", placeholder, value, onChange }) => (
  <label className="text-md font-semibold text-primary">
    {label}:
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm border-2 border-gray-300 rounded-xl p-3 mt-1 focus:border-primary/60 outline-none"
      required
    />
  </label>
);

export default Input;
