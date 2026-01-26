import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SimpleDropdown = ({
  icon: Icon,
  options,
  value, // ✅ controlled value
  onChange,
  placeholder,
  accent = "blue",
  allowReset = true, // ✅ allow "All" option
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <div
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2.5 shadow-sm cursor-pointer hover:border-gray-300 transition-all min-w-[180px]"
      >
        {Icon && <Icon size={16} className="text-gray-400" />}

        <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 flex-1">
          {value || placeholder}
        </span>

        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {/* Options */}
      {open && (
        <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Reset / All option */}
          {allowReset && (
            <div
              onClick={() => {
                onChange("all");
                setOpen(false);
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {placeholder}
            </div>
          )}

          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer
                hover:bg-${accent}-50 hover:text-${accent}-600 transition-colors`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleDropdown;
