import React, { useEffect, useState } from "react";
import OrderTable from "../../../component/admin/order/OrderTable";
import { getAllOrder, getCountOrderStatus } from "../../../config/api";
import Loading from "../../../component/Loading";
import {
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineXCircle,
  HiOutlineCheck,
} from "react-icons/hi";
import { AiOutlineLeft, AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { formatVND } from "../../../utils";
import { FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../component/Pagiantion";

const ITEMS_PER_PAGE = 7; // Số lượng đơn hàng mỗi trang

const OrderPage = () => {
  const [listOrder, setListOrder] = useState([]); // State cho danh sách đơn hàng
  const [isLoading, setIsLoading] = useState(false); // State cho trạng thái loading
  const [statusCounts, setStatusCounts] = useState({
    confirmed: 0,
    processing: 0,
    shipped: 0,
    cancelled: 0,
    delivered: 0,
  }); // State đếm trạng thái đơn hàng
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCollapse, setActiveCollapse] = useState(null); // State collapse cho đơn hàng
  const navigate = useNavigate(); // Hook for navigation
  useEffect(() => {
    handleGetAllOrder();
    handleGetCountOrderStatus();
  }, []);

  useEffect(() => {
    handleGetAllOrder();
  }, [currentPage]);

  const handleGetCountOrderStatus = async () => {
    try {
      const response = await getCountOrderStatus();

      if (response && Array.isArray(response.metadata)) {
        const counts = response.metadata.reduce(
          (acc, item) => {
            acc[item._id] = item.count;
            return acc;
          },
          {
            confirmed: 0,
            processing: 0,
            shipped: 0,
            cancelled: 0,
            delivered: 0,
          }
        );

        setStatusCounts(counts);
      } else {
        console.error("Dữ liệu trạng thái không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy số lượng trạng thái đơn hàng:", error);
    }
  };

  const handleGetAllOrder = async () => {
    setIsLoading(true);
    try {
      const response = await getAllOrder({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      if (response && response.metadata) {
        setTotalPages(response.metadata.pagination.totalPages);
        setListOrder(response.metadata.orders);
      } else {
        console.error("Không tìm thấy đơn hàng trong phản hồi.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedOrders = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return listOrder.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const toggleCollapse = (id) => {
    setActiveCollapse((prev) => (prev === id ? null : id));
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      case "shipped":
        return "bg-blue-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      case "delivered":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between bg-white px-6 py-8 rounded-lg items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-700">Quản lý đơn hàng</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loading />
        </div>
      ) : (
        <>
          {/* Status Summary Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatusCard
              icon={HiOutlineCheckCircle}
              label="Đã xác nhận"
              count={statusCounts.confirmed}
              color="text-green-500"
            />
            <StatusCard
              icon={HiOutlineClipboardList}
              label="Đang xử lý"
              count={statusCounts.processing}
              color="text-yellow-500"
            />
            <StatusCard
              icon={HiOutlineTruck}
              label="Đang giao hàng"
              count={statusCounts.shipped}
              color="text-blue-500"
            />
            <StatusCard
              icon={HiOutlineXCircle}
              label="Đã hủy"
              count={statusCounts.cancelled}
              color="text-red-500"
            />
            <StatusCard
              icon={HiOutlineCheck}
              label="Đã giao hàng"
              count={statusCounts.delivered}
              color="text-purple-500"
            />
          </div>

          {/* Order List for Small Screens */}
          <div className="md:hidden">
            {listOrder.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-lg mb-4 p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-700">
                      Order #{order._id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaInfoCircle
                      className="text-blue-500 cursor-pointer text-xl"
                      title="Xem chi tiết sản phẩm"
                      onClick={() =>
                        navigate(`/admin/orders/detail/${order._id}`)
                      }
                    />
                    <AiOutlineDown
                      className={`text-gray-500 ${
                        activeCollapse === order._id ? "rotate-180" : ""
                      } transition-transform cursor-pointer text-xl`}
                      onClick={() => toggleCollapse(order._id)}
                    />
                  </div>
                </div>

                {activeCollapse === order._id && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-inner">
                    <p className="font-semibold">
                      Người đặt: {order.order_userId.usr_name}
                    </p>
                    <p className="font-semibold">
                      Payment: {order.order_payment.payment_method}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-700 font-semibold">
                        Status:
                      </span>
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getStatusClass(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Total Amount:{" "}
                      {formatVND(order.order_checkout.totalCheckOut)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order Table for Larger Screens */}
          <div className="hidden md:block">
            <OrderTable listOrder={listOrder} setListOrder={setListOrder} />
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

const StatusCard = ({ icon: Icon, label, count, color }) => (
  <div className="flex flex-col justify-between bg-white shadow-md rounded-lg p-4">
    <div className={`text-4xl ${color} mb-4`}>
      <Icon />
    </div>
    <div className="text-gray-500 text-sm font-medium">{label}</div>
    <div className="text-gray-800 text-2xl font-bold">{count}</div>
  </div>
);

export default OrderPage;
