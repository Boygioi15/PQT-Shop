import React, { useEffect, useState } from "react";
import { X, Plus, Check, Info, AlertTriangle } from "lucide-react";
import {
  getListVoucherAvailable,
  getCheckout,
  getListVoucherPrivate,
} from "../../config/api";
import VoucherDetailsModal from "./VoucherDetailsModal";
import { useSelector } from "react-redux";
import { formatVND } from "../../utils";

const VoucherSideBar = ({
  isOpen,
  setIsOpen,
  products_order,
  selectedVoucher,
  setSelectedVoucher,
  isUseLoyalPoint,
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [unAvailableVoucher, setUnAvailableVoucher] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedVoucherDetails, setSelectedVoucherDetails] = useState(null);
  const userId = useSelector((state) => state.account?.user?._id);
  const [previewCheckout, setPreviewCheckout] = useState({});
  const [codeSearch, setCodeSearch] = useState();
  const [privateVouchers, setPrivateVouchers] = useState([]);
  const handleCheckOut = async (products_order, userId, shop_discount) => {
    if (!products_order.length) {
      return;
    }
    try {
      const response = await getCheckout({
        products_order,
        userId,
        shop_discount,
        isUseLoyalPoint,
      });
      if (response.status === 200) {
        setPreviewCheckout(response.metadata.checkOut_order);
      }
    } catch (error) {
      console.error("Failed to fetch checkout data:", error.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    const getListVoucherAvailableFunc = async (userId, products) => {
      const response = await getListVoucherAvailable({ userId, products });
      setVouchers(response.metadata.availableDiscounts);
      setUnAvailableVoucher(response.metadata.unAvailableDiscounts);
    };
    getListVoucherAvailableFunc(userId, products_order);
    handleCheckOut(products_order, userId, selectedVoucher);
  }, [products_order, userId]);

  useEffect(() => {
    handleCheckOut(products_order, userId, selectedVoucher);
  }, [selectedVoucher]);

  const handleOfferToggle = async (voucherId) => {
    if (selectedVoucher.includes(voucherId)) {
      setSelectedVoucher(selectedVoucher.filter((id) => id !== voucherId));
    } else {
      setSelectedVoucher([...selectedVoucher, voucherId]);
    }
  };

  const handleViewDetails = (e, voucher) => {
    e.stopPropagation();
    setSelectedVoucherDetails(voucher);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedVoucherDetails(null);
  };

  const handleClose = () => {
    setSelectedVoucher([]); // Reset selected vouchers
    setIsOpen(false);
  };

  const handleSubmit = () => {
    setIsOpen(false);
  };

  const handleFindVoucher = async () => {
    const response = await getListVoucherPrivate({ code: codeSearch });
    setPrivateVouchers(response.metadata);
  };

  const VoucherItem = ({ voucher, isAvailable = true }) => (
    <div
      onClick={() => isAvailable && handleOfferToggle(voucher._id)}
      className={`group flex items-start gap-3 p-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
        isAvailable
          ? selectedVoucher.includes(voucher._id)
            ? "bg-red-50 border-2 border-red-500"
            : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
          : "bg-gray-100 opacity-75"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAvailable
            ? selectedVoucher.includes(voucher._id)
              ? "bg-red-500"
              : "bg-red-50"
            : "bg-gray-300"
        }`}
      >
        {isAvailable ? (
          <span
            className={`font-medium ${
              selectedVoucher.includes(voucher._id)
                ? "text-white"
                : "text-red-500"
            }`}
          >
            %
          </span>
        ) : (
          <AlertTriangle className="w-4 h-4 text-gray-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium text-gray-900 leading-5">
            {voucher.discount_name}
          </p>
          <button
            onClick={(e) => handleViewDetails(e, voucher)}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Info className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        {voucher.discount_description && (
          <p className="text-sm text-gray-500 mt-1 leading-5">
            {voucher.discount_description}
          </p>
        )}
        {!isAvailable && (
          <p className="text-sm text-red-500 mt-1 leading-5">
            Không đủ điều kiện áp dụng
          </p>
        )}
      </div>
      {isAvailable && (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            selectedVoucher.includes(voucher._id)
              ? "bg-red-500"
              : "border-2 border-gray-300 group-hover:border-gray-400"
          }`}
        >
          {selectedVoucher.includes(voucher._id) ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Plus className="w-4 h-4 text-gray-400" />
          )}
        </div>
      )}
    </div>
  );
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleClose}
          />

          <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl flex flex-col">
            {/* Header - Always visible */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <h2 className="text-lg font-semibold">Khuyến mãi và ưu đãi</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search Section - Scrolls with content but sticks at top */}
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white p-4">
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={codeSearch}
                      onChange={(e) => setCodeSearch(e.target.value)}
                      placeholder="Nhập mã giảm giá của bạn tại đây nhé"
                      className="w-full bg-transparent text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                    <button
                      onClick={handleFindVoucher}
                      className="px-4 py-2 text-xs font-medium text-white bg-red-500 rounded-r-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="px-4 pb-4">
                {privateVouchers.length > 0 && (
                  <>
                    <h3 className="text-base font-semibold mb-4">Tìm kiếm</h3>
                    <div className="space-y-3 mb-6">
                      {privateVouchers.map((voucher) => (
                        <VoucherItem
                          key={voucher._id}
                          voucher={voucher}
                          isAvailable={
                            !unAvailableVoucher.some(
                              (uv) => uv._id === voucher._id
                            )
                          }
                        />
                      ))}
                    </div>
                  </>
                )}

                <h3 className="text-base font-semibold mb-4">
                  Voucher khả dụng
                </h3>
                <div className="space-y-3 mb-6">
                  {vouchers.map((voucher) => (
                    <VoucherItem
                      key={voucher._id}
                      voucher={voucher}
                      isAvailable={
                        !unAvailableVoucher.some((uv) => uv._id === voucher._id)
                      }
                    />
                  ))}
                </div>

                {unAvailableVoucher.length > 0 && (
                  <>
                    <h3 className="text-base font-semibold mb-4 mt-8">
                      Voucher không khả dụng
                    </h3>
                    <div className="space-y-3">
                      {unAvailableVoucher.map((voucher) => (
                        <VoucherItem
                          key={voucher._id}
                          voucher={voucher}
                          isAvailable={false}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer - Always visible */}
            <div className="border-t bg-white p-4 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">
                  Đã chọn {selectedVoucher.length} khuyến mãi và ưu đãi
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {formatVND(previewCheckout.totalCheckOut)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tiết kiệm {formatVND(previewCheckout.voucherDiscount)}
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>

          <VoucherDetailsModal
            isOpen={detailsOpen}
            onClose={closeDetails}
            voucher={selectedVoucherDetails}
          />
        </div>
      )}
    </>
  );
};

export default VoucherSideBar;
