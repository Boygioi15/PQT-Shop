import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Link, useNavigate } from "react-router-dom";
import { getListFlashSale, toggleFlashSale } from "../../../config/api";
import { FaEdit } from "react-icons/fa"; // Import FaEdit icon

const EventPage = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [dateRange, setDateRange] = useState([null, null]);
  const [flashSales, setFlashSales] = useState([]);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleToggleDisable = async (id) => {
    try {
      const response = await toggleFlashSale(id);
      console.log("🚀 ~ handleToggleDisable ~ response:", response);

      // Update the state after API call
      setFlashSales((prevSales) =>
        prevSales.map((sale) =>
          sale._id === id ? { ...sale, disable: !sale.disable } : sale
        )
      );
    } catch (error) {
      console.error("Error toggling flash sale disable state:", error);
    }
  };

  const formatTimeRange = (startTime, endTime) => {
    const formatOptionsFull = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const start = new Date(startTime).toLocaleString(
      "en-GB",
      formatOptionsFull
    );
    const end = new Date(endTime).toLocaleString("en-GB", formatOptionsFull);

    return `${start} - ${end}`;
  };

  const handleGetAllFlashSale = async () => {
    try {
      const response = await getListFlashSale("Custom");
      console.log("🚀 ~ handleGetAllFlashSale ~ response:", response);
      console.log("🚀 ~ handleGetAllFlashSale ~ response:", response);
      setFlashSales(response.metadata);
    } catch (error) {
      console.error("Error fetching flash sales:", error);
    }
  };

  const handleEditFlashSale = (id) => {
    navigate(`/admin/event/edit/${id}`);
  };

  useEffect(() => {
    handleGetAllFlashSale();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Flash Sale Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-3">Tổng quan sự kiện của Shop</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm">Doanh Số</p>
            <p className="text-2xl font-semibold">₫ 0</p>
          </div>
          <div>
            <p className="text-sm">Đơn hàng</p>
            <p className="text-2xl font-semibold">0</p>
          </div>
          <div>
            <p className="text-sm">Người mua</p>
            <p className="text-2xl font-semibold">0</p>
          </div>
          <div>
            <p className="text-sm">Tỷ lệ truy cập</p>
            <p className="text-2xl font-semibold">0.00%</p>
          </div>
        </div>
      </div>

      {/* Flash Sale Program List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Danh sách chương trình</h2>
          <Link
            to="/admin/event/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + Tạo
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mb-4">
          {["Tất cả", "Đang diễn ra", "Sắp diễn ra", "Đã kết thúc"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500 font-bold"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Date Picker Section */}
        <div className="flex items-center mb-4 space-x-4">
          <label className="text-lg font-semibold">Khung giờ:</label>
          <Flatpickr
            className="border-2 border-gray-300 rounded px-3 py-2 w-56"
            options={{
              mode: "range",
              dateFormat: "d-m-Y",
            }}
            value={dateRange}
            onChange={(selectedDates) => setDateRange(selectedDates)}
            placeholder="Chọn khung giờ"
          />
          <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
            Lọc
          </button>
        </div>

        {/* Table */}
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2 border-b">Khung giờ</th>
              <th className="text-left px-4 py-2 border-b">Sản phẩm</th>
              <th className="text-left px-4 py-2 border-b">Trạng thái</th>
              <th className="text-left px-4 py-2 border-b">Bật/Tắt</th>
              <th className="text-left px-4 py-2 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {flashSales.map((sale) => (
              <tr key={sale._id}>
                <td className="px-4 py-2 border-b">
                  {formatTimeRange(sale.startTime, sale.endTime)}
                </td>
                <td className="px-4 py-2 border-b">
                  {sale.appliedProductLength}
                </td>
                <td className="px-4 py-2 border-b">
                  <span className="px-2 py-1 rounded">{sale.status}</span>
                </td>
                <td className="px-4 py-2 border-b">
                  <div
                    className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                      sale.disable
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600"
                    }`}
                    onClick={() => {
                      handleToggleDisable(sale._id);
                    }}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        sale.disable ? "translate-x-0" : "translate-x-6"
                      }`}
                    ></div>
                  </div>
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditFlashSale(sale._id)}
                  >
                    <FaEdit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventPage;
