import React from "react";
import {
  CheckCircle,
  Clock,
  Package,
  ArrowLeft,
  Share2,
  Printer,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Cảm ơn bạn đã đặt hàng.Chúng tôi sẽ xử lý đơn hàng của bạn trong
            thời gian sớm nhất.
          </p>
        </div>
        {/* Order Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Đơn hàng #{id}
              </h2>
              <p className="text-sm text-gray-600"> Ngày đặt: 23 / 12 / 2024</p>
            </div>
          </div>
          <div className="border-t border-b py-4 mb-4">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600"> Trạng thái </span>
              <span className="text-green-500 font-medium"> Đã xác nhận </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600"> Thời gian dự kiến </span>
              <span className="font-medium"> 2 - 3 ngày </span>
            </div>
          </div>
        </div>
        {/* Continue Shopping Button */}
        <div className="flex justify-center gap-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tiếp tục mua sắm
          </button>
          <button
            onClick={() => navigate("/profile/order-list")}
            className="flex items-center gap-2 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Xem chi tiết đơn hàng
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
