import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getListFlashSale, toggleFlashSale } from "../../../config/api";
import { FaEdit } from "react-icons/fa"; // Import FaEdit icon
import Pagination from "../../../component/Pagiantion";
import { FcStatistics } from "react-icons/fc";
const ITEMS_PER_PAGE = 5;
const EventPage = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [dateRange, setDateRange] = useState([null, null]);
  const [flashSales, setFlashSales] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const formatDateRange = (dateRange) => {
    if (!dateRange[0] || !dateRange[1]) return [null, null];

    // Với ngày bắt đầu
    const startDate = new Date(dateRange[0]);
    const utcStartDate = new Date(
      Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        0,
        0,
        0,
        0
      )
    );

    // Với ngày kết thúc
    const endDate = new Date(dateRange[1]);
    const utcEndDate = new Date(
      Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
        999
      )
    );

    return [utcStartDate.toISOString(), utcEndDate.toISOString()];
  };

  const handleToggleDisable = async (id) => {
    try {
      const response = await toggleFlashSale(id);
      setFlashSales((prevSales) =>
        prevSales.map((sale) =>
          sale._id === id ? { ...sale, disable: !sale.disable } : sale
        )
      );
    } catch (error) {
      console.error("Error toggling flash sale disable state:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTimeRange = (startTime, endTime) => {
    const formatTime = (time) => {
      const date = new Date(time); // Sử dụng đúng giá trị gốc
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const start = formatTime(startTime);
    const end = formatTime(endTime);

    return `${start} - ${end}`;
  };

  const handleGetAllFlashSale = async () => {
    try {
      const formattedDateRange = formatDateRange(dateRange);

      const response = await getListFlashSale({
        eventType: "Custom",
        status: activeTab === "Tất cả" ? null : activeTab,
        page: currentPage,
        dateRange: formattedDateRange, // Đã là ISO string rồi, không cần map lại
        limit: ITEMS_PER_PAGE,
      });

      setFlashSales(response.metadata.promotions);
      setTotalPages(response.metadata.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching flash sales:", error);
    }
  };

  const handleEditFlashSale = (id) => {
    navigate(`/admin/event/edit/${id}`);
  };
  const handleStaticPage = (id) => {
    navigate(`/admin/event/statistic/${id}`);
  };

  useEffect(() => {
    handleGetAllFlashSale();
  }, []);

  const location = useLocation();

  useEffect(() => {
    handleGetAllFlashSale();
  }, [location, activeTab, currentPage, dateRange]);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
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
            {flashSales.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Chưa có dữ liệu
                </td>
              </tr>
            ) : (
              flashSales.map((sale) => (
                <tr
                  key={sale._id}
                  className={`${
                    sale.status === "Đã kết thúc"
                      ? "opacity-50 cursor-not-allowed text-gray-500 bg-gray-200"
                      : "text-black"
                  }`}
                >
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
                  <td className="px-4 py-2 border-b flex gap-2">
                    <button
                      className={`text-blue-500 hover:text-blue-700 ${
                        sale.status === "Đã kết thúc"
                          ? "pointer-events-none"
                          : ""
                      }`}
                      onClick={() => handleEditFlashSale(sale._id)}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className={`text-blue-500 hover:text-blue-700 ${
                        sale.status === "Đã kết thúc"
                          ? "pointer-events-none"
                          : ""
                      }`}
                      onClick={() => handleStaticPage(sale._id)}
                    >
                      <FcStatistics size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {flashSales.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default EventPage;
