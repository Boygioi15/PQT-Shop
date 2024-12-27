import React from "react";
import { useNavigate } from "react-router-dom";

// Login Required Modal Component
const LoginRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <div className="text-center">
          {/* Icon or illustration could go here */}
          <div className="mb-4 text-yellow-500">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Đăng nhập để tiếp tục
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để có thể tiến hành thanh toán và theo dõi đơn
            hàng của mình.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Đăng nhập
            </button>
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200"
            >
              Để sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
