import React, { useEffect, useState } from "react";
import { formatVND } from "../../utils";
import { getCheckout } from "../../config/api";
import { BsCoin } from "react-icons/bs";
import { FaChevronRight } from "react-icons/fa";
import VoucherSideBar from "./VoucherSidebar";
import { useSelector } from "react-redux";

const initCheckOutValue = {
  accLoyalPoint: 0, // Điểm khách hàng sẽ nhận được
  feeShip: 0,
  productDiscount: 0,
  totalCheckOut: 0,
  totalPrice: 0,
  voucherDiscount: 0,
  availableLoyalPoints: 0, // Điểm thưởng khả dụng mà khách hàng có thể sử dụng
};
const CheckOut = ({
  products_order,
  userId,
  onCheckout,
  onContinueShopping,
  isCheckout,
}) => {
  const [checkoutValue, setCheckOutValue] = useState(initCheckOutValue);
  const accLoyalPoint = useSelector((state) => state.account?.user?.loyalPoint);
  const [useLoyalPoints, setUseLoyalPoints] = useState(false); // Trạng thái sử dụng điểm thưởng
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleCheckOut = async () => {
      if (!products_order.length) {
        setCheckOutValue(initCheckOutValue);
        return;
      }
      try {
        const response = await getCheckout({
          products_order,
          userId,
          shop_discount: selectedVoucher,
          isUseLoyalPoint: useLoyalPoints,
        });
        if (response.status === 200) {
          setCheckOutValue(response.metadata.checkOut_order);
        }
      } catch (error) {
        console.error("Failed to fetch checkout data:", error.message);
      }
    };

    handleCheckOut();
  }, [products_order, userId, selectedVoucher, useLoyalPoints]);

  return (
    <>
      <div className="bg-white rounded-md p-4 md:self-start sticky top-0 shadow-md">
        {products_order.length > 0 && (
          <div
            className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-md cursor-pointer"
            onClick={() => {
              setSidebarOpen(true);
            }}
          >
            <span className="text-gray-800 text-sm font-medium flex items-center gap-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                %
              </span>
              Chọn hoặc nhập ưu đãi
            </span>
            <FaChevronRight className="text-gray-500" />
          </div>
        )}

        {/* Mục sử dụng điểm thưởng */}
        {products_order.length > 0 && (
          <div className="flex items-center justify-between mt-6 border rounded-md px-4 py-3">
            <div className="flex items-center gap-3">
              <BsCoin size={24} color="#E5A624" />
              <span className="text-gray-600 text-sm font-medium">
                Sử dụng {accLoyalPoint} điểm (~
                {formatVND(accLoyalPoint)})
              </span>
            </div>
            <div
              className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                useLoyalPoints ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => setUseLoyalPoints(!useLoyalPoints)}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  useLoyalPoints ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        )}

        {/* Chi tiết thanh toán */}
        <ul className="text-gray-800 mt-8 space-y-4">
          <li className="flex justify-between text-base">
            Tổng tiền
            <span className="font-bold">
              {formatVND(checkoutValue.totalPrice)}
            </span>
          </li>
          <hr />
          <li className="flex justify-between text-base">
            Khuyến mãi sản phẩm
            <span className="font-bold">
              {formatVND(checkoutValue.productDiscount)}
            </span>
          </li>
          <hr />
          <li className="flex justify-between text-base">
            Khuyến mãi voucher
            <span className="font-bold">
              {formatVND(checkoutValue.voucherDiscount)}
            </span>
          </li>
          <hr />
          <li className="flex justify-between text-base">
            Vận chuyển
            <span className="font-bold">
              {formatVND(checkoutValue.feeShip)}
            </span>
          </li>
          <hr />
          <li className="flex justify-between text-base">
            Điểm thành viên
            <span className="font-bold flex items-center">
              <BsCoin color="#e5a624" className="mr-2" />+
              <span className="ml-1">
                {checkoutValue.accLoyalPoint.toLocaleString("vi-VN")}
              </span>
            </span>
          </li>
          <hr />
          <li className="flex justify-between text-base ">
            Cần thanh toán
            <span className="text-red-500 font-bold">
              {formatVND(checkoutValue.totalCheckOut)}
            </span>
          </li>
        </ul>

        {/* Nút hành động */}
        <div className="mt-8 space-y-2">
          <button
            type="button"
            onClick={onCheckout}
            disabled={products_order.length === 0}
            className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide rounded-md ${
              products_order.length === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isCheckout ? "Đặt hàng" : "Xác nhận đơn"}
          </button>
          <button
            type="button"
            onClick={onContinueShopping}
            className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>

      <VoucherSideBar
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        products_order={products_order}
        selectedVoucher={selectedVoucher}
        setSelectedVoucher={setSelectedVoucher}
        isUseLoyalPoint={useLoyalPoints}
      />
    </>
  );
};

export default CheckOut;
