import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  name,
}) => (
  <label className="text-md font-semibold text-primary">
    {label}:
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full text-sm border-2 rounded-xl p-3 mt-1 focus:border-primary/60 outline-none ${className}`}
      required
    />
  </label>
);

export default Input;
