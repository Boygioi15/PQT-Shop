// src/component/Product/SortButton.js

import React, { useState } from "react";
import { AiOutlineSortAscending, AiOutlineRight } from "react-icons/ai";
import { SortOptions } from "./sortOption"; // Import danh sách tùy chọn sắp xếp

const SortButton = ({
  isSortDropdownOpen,
  toggleSortDropdown,
  selectedOption,
  setSelectedOption,
}) => {
  const handleOptionSelect = (key) => {
    setSelectedOption(key); // Cập nhật tùy chọn khi chọn
    toggleSortDropdown(); // Đóng dropdown sau khi chọn
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSortDropdown}
        type="button"
        className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <AiOutlineSortAscending className="mr-2 h-4 w-4" />
        Xếp theo: {SortOptions[selectedOption]}{" "}
        {/* Hiển thị tên tùy chọn hiện tại */}
        <AiOutlineRight
          className={`ml-2 h-4 w-4 transition-transform ${
            isSortDropdownOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {isSortDropdownOpen && (
        <div
          id="sortDropdown"
          className="absolute right-0 z-50 mt-2 w-48 divide-y divide-gray-100 rounded-lg bg-white shadow-lg p-4"
        >
          <div className="flex flex-col space-y-1">
            {/* Các tùy chọn sắp xếp */}
            {Object.entries(SortOptions).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleOptionSelect(key)} // Truyền key (giá trị sắp xếp)
                className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortButton;
