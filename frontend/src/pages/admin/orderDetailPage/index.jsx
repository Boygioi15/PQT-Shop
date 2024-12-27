import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderStatus from "../../../component/Profile/OrderStatus"; // Import OrderStatus component
import { getOneOrderForAdmin } from "../../../config/api";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils";
import { BsCoin } from "react-icons/bs";

const OrderDetailPage = () => {
  const { orderId } = useParams(); // Lấy ID đơn hàng từ URL
  const [orderDetail, setOrderDetail] = useState();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const response = await getOneOrderForAdmin({ orderId });
      if (response.status === 200) {
        setOrderDetail(response.metadata);
      } else {
        toast.error(response.message);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  return (
    <div className="p-4 lg:p-8 min-h-screen">
      {/* Header và trạng thái đơn hàng */}
      <div className="bg-white rounded-md p-6 shadow-md mb-6">
        {/* Ngày, loại đơn hàng, số lượng sản phẩm */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="space-y-2">
            <p className="text-xl font-bold text-gray-800">
              Đơn hàng #{orderId}
            </p>
            <p className="text-sm text-gray-600">
              Ngày đặt:{" "}
              <span className="font-semibold text-gray-800">
                {formatDate(orderDetail?.createdAt || 0)}
              </span>{" "}
              • {orderDetail?.order_products.length} sản phẩm
            </p>
          </div>
          <span
            className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-bold ${
              orderDetail?.order_status === "completed"
                ? "bg-green-100 text-green-600"
                : orderDetail?.order_status === "processing"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {orderDetail?.order_status === "completed"
              ? "Hoàn tất"
              : orderDetail?.order_status === "processing"
              ? "Đang xử lý"
              : "Đặt hàng"}
          </span>
        </div>

        {/* Trạng thái đơn hàng */}
        <div className="mt-6">
          <OrderStatus currentStatus={orderDetail?.order_status} />
        </div>
      </div>

      {/* Main content: Thông tin người nhận, danh sách sản phẩm và thanh toán */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin người nhận và danh sách sản phẩm */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-md p-4 shadow-md">
            <h3 className="font-bold text-gray-800 mb-2">
              Thông tin người đặt
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">
                Họ tên: {orderDetail?.order_userId.usr_name}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">
                Email: {orderDetail?.order_userId.usr_email}
              </span>
            </p>
          </div>
          <div className="bg-white rounded-md p-4 shadow-md">
            <h3 className="font-bold text-gray-800 mb-2">
              Thông tin người nhận
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">
                {orderDetail?.order_shipping.fullName}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">
                {orderDetail?.order_shipping.phone}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">
                {orderDetail?.order_shipping.fullAddress}
              </span>
            </p>
          </div>

          <div className="bg-white rounded-md p-4 shadow-md">
            <h3 className="font-bold text-gray-800 mb-4">Danh sách sản phẩm</h3>
            {orderDetail?.order_products.map((item, index) => (
              <div key={index} className="flex items-center mb-4">
                <img
                  src={item.thumb}
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
                  {item.priceAfterDiscount.toLocaleString("vi-VN", {
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
                {orderDetail?.order_checkout.totalPrice.toLocaleString(
                  "vi-VN",
                  {
                    style: "currency",
                    currency: "VND",
                  }
                )}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Giảm giá trực tiếp</span>
              <span>
                -
                {orderDetail?.order_checkout.productDiscount.toLocaleString(
                  "vi-VN",
                  {
                    style: "currency",
                    currency: "VND",
                  }
                )}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Giảm giá voucher</span>
              <span>
                -
                {orderDetail?.order_checkout.voucherDiscount.toLocaleString(
                  "vi-VN",
                  {
                    style: "currency",
                    currency: "VND",
                  }
                )}
              </span>
            </li>
            <li className="flex justify-between ">
              <span>Phí vận chuyển</span>
              <span>{orderDetail?.order_checkout.feeShip}</span>
            </li>
            <li className="flex justify-between text-base">
              <span>Điểm tích lũy</span>
              <span className="flex items-center font-semibold text-yellow-500">
                <BsCoin color="#e5a624" className="mr-2" />+
                {orderDetail?.order_checkout.accLoyalPoint.toLocaleString(
                  "vi-VN"
                )}
              </span>
            </li>
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-gray-800">
            <span className="text-lg">Thành tiền</span>
            <span className="text-lg text-red-500">
              {orderDetail?.order_checkout.totalCheckOut.toLocaleString(
                "vi-VN",
                {
                  style: "currency",
                  currency: "VND",
                }
              )}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Phương thức thanh toán
            </p>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-800">
                {orderDetail?.order_payment.payment_method}
              </span>
              <span className="ml-auto text-sm font-bold text-green-600">
                {orderDetail?.order_payment.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
