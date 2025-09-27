import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const timeRangeOptions = [
  { value: "thisWeek", label: "This Week" },
  { value: "thisMonth", label: "This Month" },
  { value: "currentYear", label: "Current Year" },
];

export function TimeRangeSelector({ value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = timeRangeOptions.find(
    (option) => option.value === value
  );

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  value === option.value
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
