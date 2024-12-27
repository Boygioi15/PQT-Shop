import React, { useState } from "react";
import { FaUpload, FaTrash } from "react-icons/fa";
import { getImageLink } from "../../../config/api";
import Loading from "../../../component/Loading";

const ThumbnailUpload = ({ productData, setProductData }) => {
  console.log("🚀 ~ ThumbnailUpload ~ productData:", productData)
  const [previewUrl, setPreviewUrl] = useState(null); // State để lưu URL xem trước hình ảnh
  const [isLoading, setIsLoading] = useState(false); // State để quản lý trạng thái tải lên

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Tạo URL tạm thời cho file
      setPreviewUrl(fileURL); // Gán URL tạm thời vào previewUrl

      const formData = new FormData();
      formData.append("file", file);

      setIsLoading(true); // Bắt đầu trạng thái tải lên
      try {
        const response = await getImageLink(formData);
        console.log("🚀 ~ handleFileChange ~ response:", response);

        // Cập nhật thông tin ảnh vào productData
        setProductData({
          ...productData, // Duy trì các thuộc tính hiện có
          thumb: response.metadata.thumb_url, // Cập nhật thumb bằng URL từ API
        });
      } catch (error) {
        console.error("Lỗi khi tải hình ảnh lên:", error);
      } finally {
        setIsLoading(false); // Kết thúc trạng thái tải lên
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null); // Xóa URL xem trước
    setProductData({
      ...productData,
      thumb: null, // Xóa thumb trong productData
    });
  };

  return (
    <div className="w-full h-auto">
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <Loading />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-bold mb-4">Ảnh</h2>
            {(previewUrl || productData.thumb) && (
              <button
                onClick={handleRemoveImage}
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 w-8 h-8"
              >
                <FaTrash />
              </button>
            )}
          </div>
          <label
            htmlFor="uploadFile1"
            className={`bg-white text-gray-500 font-semibold text-base rounded h-auto flex flex-col items-center 
            justify-center cursor-pointer ${
              previewUrl || productData.thumb
                ? ""
                : "border-2 border-mainColor border-dashed"
            } 
            mx-auto font-[sans-serif]`}
          >
            {previewUrl || productData.thumb ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={previewUrl || productData.thumb}
                  alt="Thumbnail Preview"
                  className="max-w-full max-h-full object-contain transform scale-200"
                />
              </div>
            ) : (
              <div className="flex flex-col text-mainColor justify-center items-center p-20">
                <FaUpload className="w-11 mb-2 text-mainColor" />
                Upload file
              </div>
            )}
            <input
              type="file"
              id="uploadFile1"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange} // Khi chọn file, gọi handleFileChange
              className="hidden"
            />
          </label>
        </>
      )}
    </div>
  );
};

export default ThumbnailUpload;
