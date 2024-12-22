import React from "react";
import { FaClipboardCheck, FaBox, FaHandsHelping } from "react-icons/fa";

const OrderStatus = ({ currentStatus }) => {
  // Mapping trạng thái với icon và nhãn
  const steps = [
    { label: "Đặt hàng", icon: <FaClipboardCheck />, status: "ordered" },
    { label: "Đang xử lý", icon: <FaBox />, status: "processing" },
    { label: "Hoàn tất", icon: <FaHandsHelping />, status: "completed" },
  ];

  // Lấy index của trạng thái hiện tại để kiểm tra trạng thái trước đó
  const currentIndex = steps.findIndex((step) => step.status === currentStatus);

  return (
    <div className="flex items-center justify-between relative w-full">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center relative z-10"
          style={{ width: `${100 / steps.length}%` }}
        >
          {/* Đường nối trước mỗi bước */}
          {index > 0 && (
            <div
              className={`absolute top-1/3 left-0 right-0 h-1 -z-10 ${
                index <= currentIndex ? "bg-green-600" : "bg-gray-300"
              }`}
              style={{
                width: "100%",
                transform: "translateY(-50%)",
                left: "calc(-50% + 24px)", // Điều chỉnh để nối giữa các bước
                right: "calc(50% - 24px)",
              }}
            />
          )}

          {/* Biểu tượng và vòng tròn */}
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${
              index <= currentIndex
                ? "bg-green-100 border-green-600 text-green-600"
                : "bg-gray-100 border-gray-300 text-gray-400"
            }`}
          >
            {step.icon}
          </div>

          {/* Nhãn trạng thái */}
          <p
            className={`mt-2 text-sm ${
              index <= currentIndex
                ? "font-semibold text-green-600"
                : "text-gray-600"
            }`}
          >
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
