import React from "react";
import {
  XCircle,
  RefreshCcw,
  ArrowLeft,
  HeadphonesIcon,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function OrderFailed() {
  const navigate = useNavigate();

  const goBackToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Main Error Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Thanh toán không thành công
            </h1>
            <p className="text-center text-gray-600">
              Rất tiếc, giao dịch của bạn chưa được hoàn tất. Vui lòng thử lại
              sau.
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-1">
                  Có lỗi trong quá trình thanh toán{" "}
                </h3>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-b py-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-4">
              Thông tin đơn hàng
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng</span>
                <span className="font-medium">#123456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền</span>
                <span className="font-medium">1,180,000₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức</span>
                <span className="font-medium">Thẻ tín dụng</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={goBackToCart}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại giỏ hàng
            </button>
          </div>
        </div>

        {/* Help Section */}
      </div>
    </div>
  );
}
