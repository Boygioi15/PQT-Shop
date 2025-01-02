import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(currentPage + 1, totalPages - 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex justify-center items-center mt-8 select-none">
      <ul className="flex items-center gap-1">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
              ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
              }`}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>
        </li>

        {getPageNumbers().map((pageNum, index) => (
          <li key={index}>
            <button
              onClick={() =>
                typeof pageNum === "number" ? onPageChange(pageNum) : null
              }
              disabled={pageNum === "..."}
              className={`min-w-[40px] h-10 flex items-center justify-center px-3 text-sm font-medium rounded-lg transition-colors duration-200
                ${
                  pageNum === currentPage
                    ? "bg-blue-600 text-white shadow-sm"
                    : pageNum === "..."
                    ? "text-gray-500 cursor-default"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                }`}
            >
              {pageNum}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
              ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
              }`}
          >
            Next
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
