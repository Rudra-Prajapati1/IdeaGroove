import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SimpleDropdown = ({
  icon: Icon,
  options = [],
  value,
  onChange,
  placeholder,
  allowReset = true,
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
    <div ref={ref} className="relative min-w-[160px] flex-shrink-0">
      {/* Trigger styled like SearchableDropdown input */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-12 pr-10 text-sm font-medium cursor-pointer hover:border-gray-300 transition-all"
      >
        {Icon && (
          <Icon
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <span className="text-gray-700">
          {value && value !== "all" ? value : placeholder}
        </span>

        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* Dropdown options */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-48 overflow-y-auto">
          {allowReset && (
            <div
              onClick={() => {
                onChange("all");
                setOpen(false);
              }}
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
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
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
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
