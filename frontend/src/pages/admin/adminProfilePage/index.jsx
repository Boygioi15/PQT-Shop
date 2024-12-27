import React, { useState, useRef, useEffect } from "react";
import { AiOutlineEdit, AiOutlineCamera } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { callLogout, updateProfile, getImageLink } from "../../../config/api";
import {
  setLogoutAction,
  fetchAccount,
} from "../../../redux/slice/accountSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../../component/Loading";

const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.account?.user);
  const isLoading = useSelector((state) => state.account?.isLoading);
  const [isUploading, setIsUploading] = useState(false);
  console.log("🚀 ~ AdminProfilePage ~ user:", user);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar || "https://via.placeholder.com/150"
  );
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  useEffect(() => {
    setAvatarPreview(user?.avatar || "https://via.placeholder.com/150");
    setFormData({
      usr_name: user?.name || "Maria Smith",
      usr_email: user?.email || "maria@email.com",
      usr_phone: user?.phone || "(123) 456-7890",
      usr_date_of_birth: user?.dataOfBirth || "1990-01-01",
      usr_sex: user?.sex || "",
      usr_img: user?.avatar || "",
    });
  }, [user]);

  const [formData, setFormData] = useState({
    usr_name: user?.name || "Maria Smith",
    usr_email: user?.email || "maria@email.com",
    usr_phone: user?.phone || "(123) 456-7890",
    usr_date_of_birth: user?.dataOfBirth || "1990-01-01",
    usr_sex: user?.sex || "",
    usr_img: user?.avatar || "",
  });
  console.log("🚀 ~ AdminProfilePage ~ formData:", formData);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
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
        setIsUploading(true);
        const response = await getImageLink(imageFormData);
        const imageUrl = response.metadata.image_url;

        setAvatarPreview(URL.createObjectURL(file));
        setFormData((prev) => ({ ...prev, usr_img: imageUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await updateProfile({ ...formData });
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        dispatch(fetchAccount());
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleLogOut = async () => {
    try {
      const response = await callLogout();
      if (response.status === 200 && response.metadata) {
        dispatch(setLogoutAction());
        navigate("/");
        toast.success("Logged out successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  if (isLoading || isUploading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between bg-white px-6 py-4 rounded-lg shadow-md items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-700">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image and Info */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="relative">
            <div
              className="relative group"
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
            >
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <button
                onClick={handleAvatarClick}
                className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white transition-opacity
                  ${isHoveringAvatar ? "opacity-100" : "opacity-0"}`}
              >
                <AiOutlineCamera className="h-6 w-6" />
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
          <h2 className="text-2xl font-bold text-gray-700 mt-4">
            {formData.usr_name}
          </h2>
          <span className="text-sm bg-red-200 text-red-700 px-2 py-1 rounded-full mt-2">
            Admin
          </span>
          <button
            onClick={handleLogOut}
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 shadow-md"
          >
            Log Out
          </button>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-6">
            My Profile Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="usr_name"
                value={formData.usr_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="usr_email"
                value={formData.usr_email}
                readOnly
                className="w-full px-3 py-2 border rounded-md mt-1 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="usr_phone"
                value={formData.usr_phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="usr_date_of_birth"
                value={formatDate(formData.usr_date_of_birth)}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700">Gender</label>
              <div className="mt-2 flex gap-6">
                {["Nam", "Nữ"].map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="radio"
                      name="usr_sex"
                      value={gender}
                      checked={formData.usr_sex === gender}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleUpdateProfile}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 shadow-md"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
