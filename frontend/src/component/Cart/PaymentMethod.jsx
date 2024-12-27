import { useState } from "react";
import { FaMoneyBillWaveAlt } from "react-icons/fa";

const PaymentMethod = ({ orderMethodPayment, setOrderMethodPayment }) => {
  // Handle selecting a payment method
  const handlePaymentSelect = (method) => {
    setOrderMethodPayment(method);
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">
        Chọn phương thức thanh toán
      </h3>

      {/* Payment options */}
      <div className="mt-4 space-y-3">
        {/* Credit Card Option */}
        <div
          className={`flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition ${
            orderMethodPayment === "STRIPE"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
          onClick={() => handlePaymentSelect("STRIPE")}
        >
          <FaMoneyBillWaveAlt
            className={`w-6 h-6 ${
              orderMethodPayment === "STRIPE"
                ? "text-blue-500"
                : "text-gray-600"
            }`}
          />
          <span
            className={`ml-3 ${
              orderMethodPayment === "STRIPE"
                ? "text-blue-800 font-medium"
                : "text-gray-800"
            }`}
          >
            Thanh toán bằng Stripe
          </span>
        </div>

        {/* COD Option */}
        <div
          className={`flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition ${
            orderMethodPayment === "COD"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
          onClick={() => handlePaymentSelect("COD")}
        >
          <FaMoneyBillWaveAlt
            className={`w-6 h-6 ${
              orderMethodPayment === "COD" ? "text-blue-500" : "text-gray-600"
            }`}
          />
          <span
            className={`ml-3 ${
              orderMethodPayment === "COD"
                ? "text-blue-800 font-medium"
                : "text-gray-800"
            }`}
          >
            Thanh toán khi nhận hàng (COD)
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
