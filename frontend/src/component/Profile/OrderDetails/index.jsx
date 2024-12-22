import React from "react";
import { useParams } from "react-router-dom";
import OrderStatus from "../OrderStatus"; // Import OrderStatus component

const OrderDetails = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL

  // Mock data, có thể thay bằng API call
  const mockOrderDetails = {
    id,
    date: "28/08/2023",
    status: "completed", // "ordered", "processing", "completed"
    type: "Nhận tại Shop",
    address:
      "Số 156 Đường Trần Hưng Đạo, Phường Đồng Phú, TP. Đồng Hới, Tỉnh Quảng Bình, Việt Nam",
    recipient: {
      name: "Phong",
      phone: "0848761xxx",
    },
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
    discount: 0,
    voucherDiscount: 0,
    shippingFee: "Miễn phí",
    loyaltyPoints: "+67",
    paymentMethod: "Ví điện tử",
    paymentStatus: "Đã thanh toán",
  };

  return (
    <div className="p-4 lg:p-8 min-h-screen">
      {/* Header và trạng thái đơn hàng */}
      <div className="bg-white rounded-md p-6 shadow-md mb-6">
        {/* Ngày, loại đơn hàng, số lượng sản phẩm */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="space-y-2">
            <p className="text-xl font-bold text-gray-800">
              Đơn hàng #{mockOrderDetails.id}
            </p>
            <p className="text-sm text-gray-600">
              Ngày đặt:{" "}
              <span className="font-semibold text-gray-800">
                {mockOrderDetails.date}
              </span>{" "}
              • {mockOrderDetails.items.length} sản phẩm
            </p>
          </div>
          <span
            className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-bold ${
              mockOrderDetails.status === "completed"
                ? "bg-green-100 text-green-600"
                : mockOrderDetails.status === "processing"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {mockOrderDetails.status === "completed"
              ? "Hoàn tất"
              : mockOrderDetails.status === "processing"
              ? "Đang xử lý"
              : "Đặt hàng"}
          </span>
        </div>

        {/* Trạng thái đơn hàng */}
        <div className="mt-6">
          <OrderStatus currentStatus={mockOrderDetails.status} />
        </div>
      </div>

      {/* Main content: Thông tin người nhận, danh sách sản phẩm và thanh toán */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin người nhận và danh sách sản phẩm */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-md p-4 shadow-md">
            <h3 className="font-bold text-gray-800 mb-2">
              Thông tin người nhận
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">
                {mockOrderDetails.recipient.name}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">
                {mockOrderDetails.recipient.phone}
              </span>
            </p>
          </div>

          <div className="bg-white rounded-md p-4 shadow-md">
            <h3 className="font-bold text-gray-800 mb-4">Danh sách sản phẩm</h3>
            {mockOrderDetails.items.map((item) => (
              <div key={item.id} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-md border border-gray-300"
                />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Số lượng:{" "}
                    <span className="font-semibold">{item.quantity}</span>
                  </p>
                </div>
                <div className="ml-auto text-sm font-bold text-gray-800">
                  {item.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin thanh toán */}
        <div className="bg-white rounded-md p-4 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4">Thông tin thanh toán</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex justify-between">
              <span className="font-semibold">Tổng tiền</span>
              <span className="font-bold">
                {mockOrderDetails.total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Giảm giá trực tiếp</span>
              <span>
                -
                {mockOrderDetails.discount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Giảm giá voucher</span>
              <span>
                -
                {mockOrderDetails.voucherDiscount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{mockOrderDetails.shippingFee}</span>
            </li>
            <li className="flex justify-between">
              <span>Điểm tích lũy</span>
              <span className="font-semibold text-yellow-500">
                {mockOrderDetails.loyaltyPoints}
              </span>
            </li>
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-gray-800">
            <span className="text-lg">Thành tiền</span>
            <span className="text-lg text-red-500">
              {mockOrderDetails.total.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Phương thức thanh toán
            </p>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-800">
                {mockOrderDetails.paymentMethod}
              </span>
              <span className="ml-auto text-sm font-bold text-green-600">
                {mockOrderDetails.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nút "Mua lại" */}
      <div className="mt-6 flex justify-end">
        <button className="bg-red-500 text-white text-sm px-6 py-2 rounded-md hover:bg-red-600 shadow">
          Mua lại
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
