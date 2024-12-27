import React, { useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Đóng menu khi click bên ngoài
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative w-1/3">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-lg bg-white flex justify-between items-center cursor-pointer"
      >
        <span>{options.find((option) => option.value === value)?.label || placeholder}</span>
        <FaChevronDown
          className={`text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`absolute left-0 top-full w-full mt-2 bg-white border rounded-lg shadow-lg z-10 transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
              option.value === value ? "bg-blue-500 text-white" : ""
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
