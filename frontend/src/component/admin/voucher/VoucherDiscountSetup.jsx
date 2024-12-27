import React from "react";

const VoucherDiscountSetup = ({ voucherData, setVoucherData }) => {
  // Hàm loại bỏ định dạng "₫" hoặc bất kỳ ký tự không phải số nào từ chuỗi đầu vào
  const handleFormattedInputChange = (field, value) => {
    const numericValue = value.replace(/[^\d]/g, ""); // Loại bỏ ký tự không phải số
    setVoucherData({
      ...voucherData,
      [field]: numericValue,
    });
  };

  // Hàm định dạng số thành dạng tiền tệ mà không thêm "₫"
  const formatNumber = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") : "";
  };

  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Thiết lập mã giảm giá
      </h1>

      {/* Loại giảm giá | Mức giảm */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <label className="font-bold text-gray-800 w-full md:w-1/3">
          Loại giảm giá | Mức giảm
        </label>
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-mainColor"
            value={voucherData.type}
            onChange={(e) =>
              setVoucherData({ ...voucherData, type: e.target.value })
            }
          >
            <option value="fixed_amount">Theo số tiền</option>
            <option value="percentage">Theo phần trăm</option>
          </select>
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-7/12 focus:outline-none focus:ring-2 focus:ring-mainColor"
              placeholder="Nhập mức giảm"
              value={formatNumber(voucherData.value)}
              onChange={(e) =>
                handleFormattedInputChange("value", e.target.value)
              }
            />
            <span className="text-gray-700 text-xl font-medium ml-3">
              {voucherData.type === "percentage" ? "%" : "₫"}
            </span>
          </div>
        </div>
      </div>

      {/* Giá trị đơn hàng tối thiểu */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <label className="font-bold text-gray-800 w-full md:w-1/3">
          Giá trị đơn hàng tối thiểu
        </label>
        <div className="flex items-center gap-4 w-full">
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-mainColor"
            placeholder="Nhập giá trị đơn hàng tối thiểu"
            value={formatNumber(voucherData.min_order_value)}
            onChange={(e) =>
              handleFormattedInputChange("min_order_value", e.target.value)
            }
          />
          <span className="text-gray-700 text-xl font-medium">₫</span>
        </div>
      </div>

      {/* Tổng lượt sử dụng tối đa */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <label className="font-bold text-gray-800 w-full md:w-1/4">
          Tổng lượt sử dụng tối đa
        </label>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <input
            type="number"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mainColor"
            placeholder="Nhập tổng lượt sử dụng"
            value={voucherData.max_uses}
            onChange={(e) =>
              setVoucherData({
                ...voucherData,
                max_uses: e.target.value,
              })
            }
          />
          <p className="text-gray-500 text-sm">
            Tổng số mã giảm giá có thể sử dụng
          </p>
        </div>
      </div>

      {/* Lượt sử dụng tối đa / Người mua */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <label className="font-bold text-gray-800 w-full md:w-1/4">
          Lượt sử dụng tối đa / Người mua
        </label>
        <input
          type="number"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-6/12 focus:outline-none focus:ring-2 focus:ring-mainColor"
          placeholder="Nhập lượt sử dụng tối đa / Người mua"
          value={voucherData.max_uses_per_user}
          onChange={(e) =>
            setVoucherData({
              ...voucherData,
              max_uses_per_user: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};

export default VoucherDiscountSetup;
