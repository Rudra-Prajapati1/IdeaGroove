import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  getCustomOptionLabel,
  normalizeCustomOptionInput,
} from "../../utils/customOptionHelpers";

export const MultiSearchableDropdown = ({
  label,
  options,
  selectedValues,
  selectedCustomValues = [],
  onChange,
  placeholder,
  idKey,
  labelKey,
  loading,
  className = "",
  onCustomSelect,
  onRemoveCustom,
  customTypeLabel = "option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Auto-scroll to bottom when a new hobby is added
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [selectedValues]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options
    ? options.filter((opt) => {
        const matchesSearch = opt[labelKey]
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const isNotSelected = !selectedValues.includes(opt[idKey]);
        const isNotCustomSelected = !selectedCustomValues.some(
          (value) => value.toLowerCase() === opt[labelKey].toLowerCase(),
        );
        return matchesSearch && isNotSelected && isNotCustomSelected;
      })
    : [];
  // Define the limit constant
  const MAX_SELECTION = 7;
  const totalSelected = selectedValues.length + selectedCustomValues.length;
  const normalizedSearchTerm = normalizeCustomOptionInput(searchTerm);
  const hasExactExistingMatch = options?.some(
    (opt) =>
      opt[labelKey].toLowerCase() === normalizedSearchTerm.toLowerCase(),
  );
  const hasExactCustomMatch = selectedCustomValues.some(
    (value) => value.toLowerCase() === normalizedSearchTerm.toLowerCase(),
  );
  const showCustomOption =
    !!onCustomSelect &&
    !!normalizedSearchTerm &&
    !hasExactExistingMatch &&
    !hasExactCustomMatch;

  const handleSelect = (id) => {
    // Check if the limit has already been reached
    if (totalSelected >= MAX_SELECTION) {
      toast.error(`You can only select up to ${MAX_SELECTION} hobbies.`);
      return;
    }

    onChange([...selectedValues, id]);
    setSearchTerm("");
  };

  const handleRemove = (idToRemove) => {
    onChange(selectedValues.filter((id) => id !== idToRemove));
  };

  const handleCustomCreate = () => {
    if (!showCustomOption) return;

    if (totalSelected >= MAX_SELECTION) {
      toast.error(`You can only select up to ${MAX_SELECTION} hobbies.`);
      return;
    }

    onCustomSelect(normalizedSearchTerm);
    setSearchTerm("");
  };

  return (
    <div
      className={`flex flex-col gap-2 w-full relative ${className}`}
      ref={dropdownRef}
    >
      <div className="flex justify-between items-center w-full">
        <label className="text-md font-semibold text-primary">{label}:</label>
        <span
          className={`text-[10px] ${totalSelected >= 7 ? "text-red-500 font-bold" : "text-gray-400"}`}
        >
          {totalSelected} / 7
        </span>
      </div>

      {/* --- VERTICAL SCROLL CONTAINER --- */}
      <div
        ref={scrollContainerRef}
        className="w-full min-h-[50px] max-h-32 border-2 border-gray-300 rounded-xl p-2 cursor-pointer bg-white hover:border-green-600 transition-colors overflow-y-auto custom-scrollbar"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((id) => {
            const item = options.find((opt) => opt[idKey] === id);
            return item ? (
              <span
                key={id}
                className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
              >
                {item[labelKey]}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(id);
                  }}
                  className="hover:text-green-900 bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })}

          {selectedCustomValues.map((value) => (
            <span
              key={`custom-${value}`}
              className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
            >
              {value}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCustom?.(value);
                }}
                className="hover:text-green-900 bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Input field stays at the end of the wrapping flow */}
          <div className="flex-1 min-w-[100px] relative h-8 flex items-center">
            {totalSelected === 0 && !searchTerm && (
              <span className="text-gray-400 text-sm ml-1 absolute pointer-events-none">
                {placeholder}
              </span>
            )}
            <input
              className={`outline-none text-sm w-full bg-transparent p-1 ${
                totalSelected >= 7 ? "cursor-not-allowed" : ""
              }`}
              placeholder={totalSelected >= 7 ? "Limit reached" : ""}
              disabled={totalSelected >= 7}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => totalSelected < 7 && setIsOpen(true)}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[min(50vh,28rem)] overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-3 text-sm text-gray-400 text-center">
                Loading...
              </div>
            ) : filteredOptions.length > 0 ? (
              <>
                {filteredOptions.map((opt) => (
                  <div
                    key={opt[idKey]}
                    className="p-3.5 text-sm hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                    onClick={() => handleSelect(opt[idKey])}
                  >
                    {opt[labelKey]}
                  </div>
                ))}
                {showCustomOption && (
                  <div
                    className="p-3.5 text-sm hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                    onClick={handleCustomCreate}
                  >
                    {getCustomOptionLabel(normalizedSearchTerm)}
                    <span className="text-gray-400">
                      {" "}
                      as new {customTypeLabel}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {showCustomOption ? (
                  <div
                    className="p-3.5 text-sm hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                    onClick={handleCustomCreate}
                  >
                    {getCustomOptionLabel(normalizedSearchTerm)}
                    <span className="text-gray-400">
                      {" "}
                      as new {customTypeLabel}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 text-sm text-gray-400 text-center">
                    No options
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
