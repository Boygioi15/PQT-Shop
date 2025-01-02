import React from "react";
import ThumbnailUpload from "../addProduct/ThumbnailUpload";

// Hàm format lại thời gian khi cần
const formatDate = (dateString) => {
  // Định dạng theo kiểu dd/MM/yyyy HH:mm
  const formattedDate = date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedDate;
};

const convertToISOWithLocalTime = (dateString) => {
  const date = new Date(dateString);
  const isoString = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
  return isoString;
};

const convertToLocalDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16);
};

const EventInfo = ({ flashSaleData, setFlashSaleData }) => {
  console.log("🚀 ~ FlashSaleInfo ~ flashSaleData:", flashSaleData);

  const handleStartTimeChange = (value) => {
    // Chuyển đổi thời gian sang định dạng ISO với múi giờ địa phương và lưu vào flashSaleData
    const isoStartTime = convertToISOWithLocalTime(value);
    const newFlashSaleData = { ...flashSaleData, startTime: isoStartTime };
    setFlashSaleData(newFlashSaleData);
  };

  const handleEndTimeChange = (value) => {
    // Chuyển đổi thời gian sang định dạng ISO với múi giờ địa phương và lưu vào flashSaleData
    const isoEndTime = convertToISOWithLocalTime(value);
    const newFlashSaleData = { ...flashSaleData, endTime: isoEndTime };
    setFlashSaleData(newFlashSaleData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Thông tin cơ bản</h2>
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Tên sự kiện
        </label>
        <input
          type="text"
          placeholder="Nhập tên sự kiện"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor"
          onChange={(e) =>
            setFlashSaleData({ ...flashSaleData, prom_name: e.target.value })
          }
          value={flashSaleData.prom_name}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Khung thời gian bắt đầu
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
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Khung thời gian kết thúc
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

      {/* Tích hợp ThumbnailUpload */}
      <div className="mt-6">
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

export default EventInfo;
