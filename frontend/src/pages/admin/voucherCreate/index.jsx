import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import thư viện toast
import VoucherBasicInfo from "../../../component/admin/voucher/VoucherBasicInfo";
import VoucherDiscountSetup from "../../../component/admin/voucher/VoucherDiscountSetup";
import VoucherVisibilitySetup from "../../../component/admin/voucher/VoucherVisibilitySetup";
import { createNewVoucher, editVoucher } from "../../../config/api";

const VoucherCreate = () => {
  const { type, id } = useParams();
  const [showDialog, setShowDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const initialVoucherData = location.state?.voucherData
    ? {
        name: location.state.voucherData.discount_name,
        description: location.state.voucherData.discount_description,
        type: location.state.voucherData.discount_type,
        value: location.state.voucherData.discount_value,
        code: location.state.voucherData.discount_code,
        start_date: location.state.voucherData.discount_start,
        end_date: location.state.voucherData.discount_end,
        max_uses: location.state.voucherData.discount_max_uses,
        max_uses_per_user:
          location.state.voucherData.discount_max_uses_per_user,
        min_order_value: location.state.voucherData.discount_min_order_value,
        is_active: location.state.voucherData.discount_is_active,
        applies_to: location.state.voucherData.discount_applies_to,
        product_ids: location.state.voucherData.discount_product_ids || [],
        isPublic: location.state.voucherData.discount_isPublic, // Thêm trường isPublic với giá trị mặc định là true
      }
    : {
        name: "",
        description: "",
        type: "",
        value: 0,
        code: "",
        start_date: "",
        end_date: "",
        max_uses: 0,
        max_uses_per_user: 0,
        min_order_value: 0,
        is_active: true,
        applies_to: type === "all" ? "all" : "specific",
        product_ids: [],
        isPublic: true, // Giá trị mặc định cho trường isPublic
      };

  const [voucherData, setVoucherData] = useState(initialVoucherData);

  const handleConfirmCreate = () => {
    const requiredFields = [
      { key: "name", label: "Tên chương trình" },
      { key: "description", label: "Mô tả" },
      { key: "type", label: "Loại giảm giá" },
      { key: "value", label: "Mức giảm" },
      { key: "code", label: "Mã voucher" },
      { key: "start_date", label: "Ngày bắt đầu" },
      { key: "end_date", label: "Ngày kết thúc" },
    ];

    for (const field of requiredFields) {
      if (
        !voucherData[field.key] ||
        voucherData[field.key].toString().trim() === ""
      ) {
        toast.error(`Vui lòng nhập ${field.label}`);
        return;
      }
    }

    setConfirmDialog(true);
  };
  const handleEdit = async () => {
    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      { key: "name", label: "Tên chương trình" },
      { key: "description", label: "Mô tả" },
      { key: "type", label: "Loại giảm giá" },
      { key: "value", label: "Mức giảm" },
      { key: "code", label: "Mã voucher" },
      { key: "start_date", label: "Ngày bắt đầu" },
      { key: "end_date", label: "Ngày kết thúc" },
    ];

    for (const field of requiredFields) {
      if (
        !voucherData[field.key] ||
        voucherData[field.key].toString().trim() === ""
      ) {
        toast.error(`Vui lòng nhập ${field.label}`);
        return;
      }
    }

    // Gửi yêu cầu chỉnh sửa
    try {
      const response = await editVoucher(voucherData, id);
      if (response.status === 200) {
        toast.success("Voucher đã được cập nhật thành công!");
        navigate("/admin/voucher");
      } else {
        toast.error(response.message || "Đã xảy ra lỗi khi chỉnh sửa voucher.");
      }
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast.error("Đã xảy ra lỗi khi chỉnh sửa voucher.");
    }
  };

  const handleCreate = async () => {
    try {
      const response = await createNewVoucher(voucherData);
      if (response.status === 200) {
        toast.success(
          id
            ? "Voucher đã được cập nhật thành công!"
            : "Voucher đã được tạo thành công!"
        );
        navigate("/admin/voucher");
      } else {
        toast.error(response.message || "Đã xảy ra lỗi khi xử lý voucher.");
      }
    } catch (error) {
      console.error("Error creating/updating voucher:", error);
      toast.error("Đã xảy ra lỗi khi xử lý voucher.");
    }
  };

  return (
    <div className="flex flex-col w-full gap-y-8">
      {/* Nội dung chính */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <VoucherBasicInfo
          voucherData={voucherData}
          setVoucherData={setVoucherData}
          type={type}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <VoucherDiscountSetup
          voucherData={voucherData}
          setVoucherData={setVoucherData}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <VoucherVisibilitySetup
          voucherData={voucherData}
          setVoucherData={setVoucherData}
          type={voucherData.applies_to}
        />
      </div>

      {/* Nút hành động */}
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
          onClick={() => setShowDialog(true)}
        >
          Hủy
        </button>

        <button
          className="bg-mainColor text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={handleConfirmCreate}
        >
          {id ? "Cập nhật Voucher" : "Tạo Voucher"}
        </button>
      </div>

      {/* Dialogs */}
      {/* Pop-up hủy */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Lưu ý</h2>
            <p className="text-gray-600 mb-6">
              Thông tin chưa được lưu. Bạn có chắc chắn muốn thoát?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowDialog(false)}
              >
                Quay lại
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => navigate("/admin/voucher")}
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up xác nhận tạo */}
      {/* Pop-up xác nhận tạo hoặc chỉnh sửa */}
      {confirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Xác nhận</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn {id ? "cập nhật" : "tạo"} voucher này?
            </p>
            <div className="flex justify-end space-x-4">
              {/* Nút Quay lại */}
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setConfirmDialog(false)} // Đóng dialog
              >
                Hủy
              </button>

              {/* Nút Xác nhận */}
              <button
                className="bg-mainColor text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => {
                  setConfirmDialog(false); // Đóng dialog
                  if (id) {
                    handleEdit(); // Gọi hàm chỉnh sửa nếu có id
                  } else {
                    handleCreate(); // Gọi hàm tạo mới nếu không có id
                  }
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherCreate;
