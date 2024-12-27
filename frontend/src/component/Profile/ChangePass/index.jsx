import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Đảm bảo bạn đã import CSS
import { changePassword } from "../../../config/api";

const ChangePass = () => {
  const userEmail = useSelector((state) => state.account?.user?.email);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    reNewPassword: "",
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu mật khẩu mới và xác nhận mật khẩu mới trùng nhau
    if (passwordData.newPassword !== passwordData.reNewPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const response = await changePassword(
        userEmail,
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.reNewPassword
      );

      if (response?.status === 200) {
        toast.success("Mật khẩu đã được cập nhật thành công!");
      } else {
        toast.error("Đã xảy ra lỗi khi cập nhật mật khẩu.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi trong quá trình xử lý.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="flex justify-center w-full mb-2">
      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Đổi Mật Khẩu</h1>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label
              htmlFor="current-password"
              className="block text-gray-600 mb-2"
            >
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-password" className="block text-gray-600 mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block text-gray-600 mb-2"
            >
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="reNewPassword"
              value={passwordData.reNewPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Xác nhận mật khẩu mới"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-mainColor text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;
