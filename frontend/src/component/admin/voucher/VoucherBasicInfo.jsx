import React from "react";

const VoucherBasicInfo = ({ voucherData, setVoucherData, type }) => {
  const formatDateToInputValue = (date) => {
    if (!date) return "";
    const localDate = new Date(date);
    const offset = localDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(localDate - offset);
    return adjustedDate.toISOString().slice(0, 16);
  };

  const handleDateChange = (field, value) => {
    const isoDate = value ? new Date(value).toISOString() : "";
    setVoucherData({ ...voucherData, [field]: isoDate });
  };

  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Thông tin cơ bản
      </h1>

      {/* Loại mã */}
      <div className="flex flex-col md:flex-row md:items-center">
        <label className="font-bold text-gray-800 w-full md:w-1/5 mb-2 md:mb-0">
          Loại mã
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-mainColor/10 text-mainColor font-semibold rounded-lg">
            {type === "all" ? "Voucher toàn Shop" : "Voucher sản phẩm"}
          </div>
        </div>
      </div>

      {/* Tên chương trình giảm giá */}
      <div className="flex flex-col md:flex-row md:items-center">
        <label className="font-bold text-gray-800 w-full md:w-1/4 mb-2 md:mb-0">
          Tên chương trình giảm giá
        </label>
        <div className="flex flex-col w-full gap-2">
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-mainColor"
            placeholder="Nhập tên chương trình giảm giá"
            value={voucherData.name}
            onChange={(e) =>
              setVoucherData({ ...voucherData, name: e.target.value })
            }
          />
          <div className="flex justify-between text-sm text-gray-500">
            <p className="font-normal">
              Tên Voucher sẽ không được hiển thị cho Người mua
            </p>
            <p className="font-semibold">{voucherData.name.length}/100</p>
          </div>
        </div>
      </div>

      {/* Mô tả chương trình giảm giá */}
      <div className="flex flex-col md:flex-row md:items-center">
        <label className="font-bold text-gray-800 w-full md:w-1/4 mb-2 md:mb-0">
          Mô tả
        </label>
        <div className="flex flex-col w-full gap-2">
          <textarea
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-mainColor resize-none"
            rows={4}
            placeholder="Nhập mô tả chương trình giảm giá"
            value={voucherData.description}
            onChange={(e) =>
              setVoucherData({ ...voucherData, description: e.target.value })
            }
          />
          <p className="text-sm text-gray-500">
            Mô tả chương trình giảm giá để Người mua hiểu rõ hơn.
          </p>
        </div>
      </div>

      {/* Mã voucher */}
      <div className="flex flex-col md:flex-row md:items-center">
        <label className="font-bold text-gray-800 w-full md:w-1/4 mb-2 md:mb-0">
          Mã voucher
        </label>
        <div className="flex flex-col w-full gap-2">
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mainColor"
            placeholder="Nhập mã voucher"
            value={voucherData.code}
            maxLength={10}
            onChange={(e) =>
              setVoucherData({ ...voucherData, code: e.target.value })
            }
          />
          <div className="flex justify-between text-sm text-gray-500">
            <p className="font-normal">
              Vui lòng chỉ nhập các kí tự chữ cái (A-Z), số (0-9); tối đa 5 kí
              tự.
            </p>
            <p className="font-semibold">{voucherData.code.length}/10</p>
          </div>
        </div>
      </div>

      {/* Thời gian sử dụng mã */}
      <div className="flex flex-col md:flex-row md:items-center">
        <label className="font-bold text-gray-800 w-full md:w-1/4 mb-2 md:mb-0">
          Thời gian sử dụng mã
        </label>
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
          <input
            type="datetime-local"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mainColor"
            value={formatDateToInputValue(voucherData.start_date)}
            onChange={(e) => handleDateChange("start_date", e.target.value)}
          />
          <input
            type="datetime-local"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mainColor"
            value={formatDateToInputValue(voucherData.end_date)}
            onChange={(e) => handleDateChange("end_date", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default VoucherBasicInfo;
