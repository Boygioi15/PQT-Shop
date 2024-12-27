import React, { useState, useRef } from "react";
import { Camera, X, Upload, Pencil } from "lucide-react";
import { getImageLink, updateProfile } from "../../config/api";
import { toast } from "react-toastify";
import { fetchAccount } from "../../redux/slice/accountSlice";
import { useDispatch, useSelector } from "react-redux";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Chỉ lấy phần `YYYY-MM-DD`
};

const EditInfo = ({
  onSave,
  userName,
  userEmail,
  userAvatar,
  userPhone,
  userGender,
  userDOB,
  onAvatarChange,
}) => {
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(userAvatar);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [formData, setFormData] = useState({
    usr_name: userName || "",
    usr_phone: userPhone || "",
    usr_sex: userGender || "",
    usr_date_of_birth: userDOB || "",
    usr_email: userEmail || "",
    usr_img: userAvatar || "",
  });
  console.log("🚀 ~ formData:", formData)
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      try {
        const response = await getImageLink(imageFormData);
        const imageUrl = response.metadata.image_url;

        setAvatarPreview(URL.createObjectURL(file));
        setFormData((prev) => ({ ...prev, usr_img: imageUrl }));
        onAvatarChange?.(file);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateProfile({ ...formData });
    if (response.status === 200) {
      toast.success("Cập nhật thành công");
    } else {
      toast.error("Cập nhật thất bại");
    }
    dispatch(fetchAccount());
    onSave();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Avatar Editor */}
      <div className="mb-8 flex justify-center">
        <div
          className="relative group"
          onMouseEnter={() => setIsHoveringAvatar(true)}
          onMouseLeave={() => setIsHoveringAvatar(false)}
        >
          <div className="relative h-32 w-32">
            <img
              src={avatarPreview}
              alt="Profile"
              className="h-full w-full rounded-full object-cover ring-2 ring-gray-200"
            />
            <button
              onClick={handleAvatarClick}
              className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white transition-opacity
                ${isHoveringAvatar ? "opacity-100" : "opacity-0"}`}
            >
              <Camera className="h-6 w-6" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Họ và tên
          </label>
          <input
            type="text"
            name="usr_name"
            value={formData.usr_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Họ và tên"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="usr_email"
            value={formData.usr_email}
            disabled
            className="mt-1 block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Giới tính
          </label>
          <div className="mt-2 flex gap-6">
            {["Nam", "Nữ"].map((gender) => (
              <label key={gender} className="flex items-center">
                <input
                  type="radio"
                  name="usr_sex"
                  value={gender}
                  checked={formData.usr_sex === gender}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày sinh
          </label>
          <input
            type="date"
            name="usr_date_of_birth"
            value={
              formData.usr_date_of_birth
                ? formatDate(formData.usr_date_of_birth)
                : ""
            }
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="usr_phone"
            value={formData.usr_phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cập nhật thông tin
        </button>
      </form>
    </div>
  );
};
export default EditInfo;
