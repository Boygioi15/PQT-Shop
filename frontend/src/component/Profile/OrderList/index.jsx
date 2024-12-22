import React, { useState, useEffect } from "react";
import OrderItem from "../OrderItem"; // Import component OrderItem

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả"); // Quản lý tab đang chọn

  // Giả lập dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      const mockOrders = [
        {
          id: 1,
          date: "28/08/2023",
          status: "Hoàn tất",
          type: "Nhận tại Shop",
          items: [
            {
              id: 101,
              name: "Miếng dán film trong mặt sau Máy Tính cắt thủ công YVS",
              quantity: 1,
              price: 120000,
              image: "https://via.placeholder.com/50",
            },
            {
              id: 102,
              name: 'Miếng Dán Màn Hình Máy Tính 18" YVS - mặt trước',
              quantity: 1,
              price: 150000,
              image: "https://via.placeholder.com/50",
            },
          ],
          total: 270000,
        },
        {
          id: 2,
          date: "27/08/2023",
          status: "Đang xử lý",
          type: "Giao tận nơi",
          items: [
            {
              id: 103,
              name: "Chuột Gaming X200 RGB",
              quantity: 2,
              price: 300000,
              image: "https://via.placeholder.com/50",
            },
          ],
          total: 600000,
        },
        {
          id: 3,
          date: "26/08/2023",
          status: "Đang giao",
          type: "Giao tận nơi",
          items: [
            {
              id: 104,
              name: "Bàn phím cơ RGB Full Size",
              quantity: 1,
              price: 1200000,
              image: "https://via.placeholder.com/50",
            },
          ],
          total: 1200000,
        },
        {
          id: 4,
          date: "25/08/2023",
          status: "Đã hủy",
          type: "Giao tận nơi",
          items: [
            {
              id: 105,
              name: "Tai nghe không dây ANC",
              quantity: 1,
              price: 2000000,
              image: "https://via.placeholder.com/50",
            },
          ],
          total: 2000000,
        },
      ];
      setOrders(mockOrders);
    };

    fetchOrders();
  }, []);

  // Tabs navigation
  const tabs = ["Tất cả", "Đang xử lý", "Đang giao", "Hoàn tất", "Đã hủy"];

  // Lọc đơn hàng theo tab
  const filteredOrders =
    activeTab === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div className="md:p-4 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Đơn hàng của tôi</h1>
      {/* Thanh điều hướng */}
      <div className="flex items-center justify-start bg-white border-b border-gray-200 pt-4 mb-4 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)} // Cập nhật tab được chọn
            className={`text-sm text-center px-10 pb-2 ${
              activeTab === tab
                ? "text-red-500 font-medium border-b-2 border-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))
        ) : (
          <p className="text-gray-600">Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default OrderList;
