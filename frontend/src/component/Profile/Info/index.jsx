import { useState } from "react";
import { useSelector } from "react-redux";
import { Camera, X, Upload, Pencil } from "lucide-react";
import EditInfo from "../EditInfo";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Chỉ lấy phần `YYYY-MM-DD`
};
const Info = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(
    useSelector((state) => state.account.user.avatar)
  );
  const user = useSelector((state) => state.account?.user);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = (formData) => {
    // Xử lý lưu thông tin ở đây
    setIsEditing(false);
  };

  const handleAvatarChange = (file) => {
    // Xử lý upload avatar ở đây
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h3>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Pencil className="h-4 w-4" />
            Chỉnh sửa hồ sơ
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="p-6">
          {isEditing ? (
            <EditInfo
              onSave={handleSaveClick}
              userName={user.name}
              userEmail={user.email}
              userAvatar={user.avatar}
              userPhone={user.phone}
              userGender={user.sex}
              userDOB={user.dataOfBirth}
              onAvatarChange={handleAvatarChange}
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover ring-2 ring-gray-200"
                />
              </div>
              <div className="w-full max-w-md space-y-4">
                {[
                  { label: "Họ và tên", value: user.name },
                  { label: "Email", value: user.email },
                  {
                    label: "Ngày sinh",
                    value: user.dataOfBirth ? formatDate(user.dataOfBirth) : "",
                  },
                  { label: "Số điện thoại", value: user.phone },
                  { label: "Giới tính", value: user.sex },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b border-gray-200 py-3"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;
