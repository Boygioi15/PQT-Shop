import { X, ChevronRight, Plus, Check, Info } from "lucide-react";
import { formatDate } from "../../utils";
const VoucherDetailsModal = ({ isOpen, onClose, voucher }) => {
  if (!isOpen || !voucher) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6 mx-4 z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-500 font-medium text-lg">%</span>
            </div>
            <div>
              <h3 className="font-semibold">{voucher.discount_name}</h3>
              <p className="text-sm text-gray-500">
                Mã: {voucher.discount_code}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Mô tả</h4>
            <p className="text-sm text-gray-600">
              {voucher.discount_description}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Điều kiện áp dụng</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              {voucher.discount_max_uses_per_user && (
                <li>
                  • Số lượt sử dụng tối đa: {voucher.discount_max_uses_per_user}
                </li>
              )}
              {voucher.discount_min_order_value && (
                <li>
                  • Giá trị đơn hàng tối thiểu:{" "}
                  {voucher.discount_min_order_value}
                </li>
              )}{" "}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Thời gian sử dụng</h4>
            <p className="text-sm text-gray-600">
              Từ {formatDate(voucher.discount_start)} đến{" "}
              {formatDate(voucher.discount_end)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VoucherDetailsModal;
