import React, { useEffect, useState } from "react";
import { getListVoucher } from "../../../config/api";
import { formatVND } from "../../../utils/format";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const VoucherPage = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [voucherList, setVoucherList] = useState([]);
  const tabs = ["Tất cả", "Đang diễn ra", "Sắp diễn ra", "Đã kết thúc"];
  const navigate = useNavigate();

  const handleEditVoucher = (voucher) => {
    navigate(`/admin/voucher/edit/${voucher._id}`, {
      state: { voucherData: voucher },
    });
  };

  useEffect(() => {
    handleGetAllVoucher();
  }, []);

  const handleGetAllVoucher = async () => {
    try {
      const response = await getListVoucher();
      setVoucherList(response.metadata);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const formatDateRange = (start, end) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedStart = new Date(start).toLocaleString("vi-VN", options);
    const formattedEnd = new Date(end).toLocaleString("vi-VN", options);
    return `${formattedStart} - ${formattedEnd}`;
  };

  return (
    <div className="flex flex-col w-full p-4 gap-8">
      {/* Phần Tạo Voucher */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold mb-4">Tạo Voucher</h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Tạo Mã giảm giá toàn shop hoặc Mã giảm giá sản phẩm ngay bây giờ để
          thu hút người mua.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <h2 className="font-bold text-base md:text-lg mb-2">
              Voucher toàn Shop
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Voucher áp dụng cho tất cả sản phẩm trong Shop của bạn.
            </p>
            <Link
              to="/admin/voucher/create/specific"
              className="bg-mainColor text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Tạo
            </Link>
          </div>
          <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <h2 className="font-bold text-base md:text-lg mb-2">
              Voucher sản phẩm
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Voucher chỉ áp dụng cho những sản phẩm nhất định mà Shop chọn.
            </p>
            <Link
              to="/admin/voucher/create/all"
              className="bg-mainColor text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Tạo
            </Link>
          </div>
        </div>
      </div>

      {/* Phần Danh sách mã giảm giá */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold mb-4">Danh sách mã giảm giá</h1>

        {/* Tabs */}
        <div className="flex space-x-2 md:space-x-4 border-b border-gray-200 mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500 font-bold"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 font-medium">
                <th className="px-4 py-2 border-b sticky left-0 bg-gray-100 z-10 w-48">
                  Tên Voucher | Mã voucher
                </th>
                <th className="px-4 py-2 border-b w-32">Loại mã</th>
                <th className="px-4 py-2 border-b w-48">Sản phẩm áp dụng</th>
                <th className="px-4 py-2 border-b w-32">Giảm giá</th>
                <th className="px-4 py-2 border-b w-40">Lượt sử dụng tối đa</th>
                <th className="px-4 py-2 border-b w-32">Đã dùng</th>
                <th className="px-4 py-2 border-b w-32">Hiển thị</th>
                <th className="px-4 py-2 border-b w-56">
                  Thời gian lưu mã giảm giá
                </th>
                <th className="px-4 py-2 border-b sticky right-0 bg-gray-100 z-10 w-28 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {voucherList.length > 0 ? (
                voucherList.map((voucher) => (
                  <tr key={voucher._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b sticky left-0 bg-white z-10 w-48">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex justify-center items-center text-blue-600 font-bold">
                          $
                        </div>
                        <div>
                          <p className="font-semibold">
                            {voucher.discount_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {voucher.discount_code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b">
                      {voucher.discount_type === "fixed_amount"
                        ? "Giảm giá cụ thể"
                        : "Giảm giá theo phần trăm"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {voucher.discount_applies_to === "specific"
                        ? "Sản phẩm cụ thể"
                        : "Tất cả sản phẩm"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {voucher.discount_type === "percentage"
                        ? `${voucher.discount_value}%`
                        : formatVND(voucher.discount_value)}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {voucher.discount_max_uses}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {voucher.discount_uses_count || 0}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {voucher.discount_isPublic
                        ? "Công khai"
                        : "Không công khai"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {formatDateRange(
                        voucher.discount_start,
                        voucher.discount_end
                      )}
                    </td>
                    <td className="px-4 py-2 border-b sticky right-0 bg-white z-10 w-28 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditVoucher(voucher)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-4 py-2 text-gray-500 text-center"
                    colSpan="9"
                  >
                    Không có Voucher nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VoucherPage;
