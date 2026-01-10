import React from "react";

const Select = ({ label, value, options, onChange }) => (
  <label className="text-md font-semibold text-primary">
    {label}:
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none focus:border-primary/60 p-3 mt-1 bg-white"
      required
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
);

export default Select;
