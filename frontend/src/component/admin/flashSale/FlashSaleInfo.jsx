import React from "react";
import ThumbnailUpload from "../addProduct/ThumbnailUpload";

// Hàm format lại thời gian khi cần
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Hàm chuyển đổi thời gian từ datetime-local sang ISO với múi giờ địa phương
const convertToISOWithLocalTime = (dateString) => {
  const date = new Date(dateString);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
};

// Hàm chuyển đổi thời gian từ ISO sang datetime-local
const convertToLocalDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16);
};

const FlashSaleInfo = ({ flashSaleData, setFlashSaleData }) => {
  const handleStartTimeChange = (value) => {
    const isoStartTime = convertToISOWithLocalTime(value);
    setFlashSaleData({ ...flashSaleData, startTime: isoStartTime });
  };

  const handleEndTimeChange = (value) => {
    const isoEndTime = convertToISOWithLocalTime(value);
    setFlashSaleData({ ...flashSaleData, endTime: isoEndTime });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Thông tin cơ bản</h2>

      {/* Tên Flash Sale */}
      <div className="mb-6">
        <label className="text-sm font-bold text-gray-700 block mb-2">
          Tên Flash Sale <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Nhập tên Flash Sale"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor"
          onChange={(e) =>
            setFlashSaleData({ ...flashSaleData, prom_name: e.target.value })
          }
          value={flashSaleData.prom_name}
        />
      </div>

      {/* Khung thời gian */}
      <div className="grid grid-cols-2 gap-6">
        {/* Thời gian bắt đầu */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">
            Thời gian bắt đầu <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor"
            onChange={(e) => handleStartTimeChange(e.target.value)}
            value={
              flashSaleData.startTime
                ? convertToLocalDateTime(flashSaleData.startTime)
                : ""
            }
          />
        </div>

        {/* Thời gian kết thúc */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">
            Thời gian kết thúc <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor"
            onChange={(e) => handleEndTimeChange(e.target.value)}
            value={
              flashSaleData.endTime
                ? convertToLocalDateTime(flashSaleData.endTime)
                : ""
            }
          />
        </div>
      </div>

      {/* Ảnh Banner */}
      <div className="mt-6">
        <label className="text-sm font-bold text-gray-700 block mb-2">
          Ảnh Banner <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Vui lòng tải lên ảnh banner đại diện cho Flash Sale.
        </p>
        <ThumbnailUpload
          productData={{ thumb: flashSaleData.prom_banner }}
          setProductData={(data) =>
            setFlashSaleData({ ...flashSaleData, prom_banner: data.thumb })
          }
        />
      </div>
    </div>
  );
};

export default FlashSaleInfo;
