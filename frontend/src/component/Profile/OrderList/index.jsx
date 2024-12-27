import React, { useState, useEffect } from "react";
import OrderItem from "../OrderItem"; // Import component OrderItem
import { getListOrder } from "../../../config/api";
import { useSelector } from "react-redux";
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả"); // Quản lý tab đang chọn
  const userId = useSelector((state) => state.account?.user?._id);

  const fetchListOrder = async () => {
    const response = await getListOrder({ userId, status: "all" });
    if (response.status === 200) {
      setOrders(response.metadata);
    }
  };
  useEffect(() => {
    fetchListOrder();
  }, [userId]);

  const tabs = [
    "Tất cả",
    "Đã xác nhận",
    "Đang xử lý",
    "Đang giao",
    "Hoàn tất",
    "Đã hủy",
  ];

  const statusMap = {
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Hoàn tất",
    cancelled: "Đã hủy",
  };

  const filteredOrders =
    activeTab === "Tất cả"
      ? orders
      : orders.filter((order) => statusMap[order.order_status] === activeTab);

  return (
    <div className="md:p-4 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Đơn hàng của tôi</h1>
      <div className="flex items-center justify-start bg-white border-b border-gray-200 pt-4 mb-4 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderItem key={order.id} order={order} statusMap={statusMap} />
          ))
        ) : (
          <p className="text-gray-600">Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default OrderList;
