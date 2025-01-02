import React, { useState } from "react";
import { ImBin } from "react-icons/im";

const OptionForm = ({
  variation,
  variationIndex,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onImageUpload,
  onRemoveImage, // Thêm prop để xử lý xóa ảnh
}) => {
  const [loadingImages, setLoadingImages] = useState({}); // State lưu trạng thái tải ảnh

  const handleImageUpload = async (variationIndex, optionIndex, file) => {
    // Cập nhật trạng thái đang tải ảnh
    setLoadingImages((prev) => ({
      ...prev,
      [`${variationIndex}-${optionIndex}`]: true,
    }));

    // Gọi hàm tải ảnh từ props và chờ xử lý
    await onImageUpload(variationIndex, optionIndex, file);

    // Sau khi tải xong, tắt trạng thái đang tải
    setLoadingImages((prev) => ({
      ...prev,
      [`${variationIndex}-${optionIndex}`]: false,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row mb-4">
      <label className="font-medium w-1/3">Tùy chọn:</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
        {variation.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-4">
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  onOptionChange(variationIndex, optionIndex, e.target.value)
                }
                className="w-full mt-1 p-2 border rounded"
                placeholder={`Tùy chọn ${optionIndex + 1}`}
              />
              <button
                onClick={() => onRemoveOption(variationIndex, optionIndex)}
                className="text-red-500"
              >
                <ImBin />
              </button>
            </div>

            {/* Hiển thị ảnh nếu đã upload */}
            {variation.images && variation.images[optionIndex] && (
              <div className="relative w-40 h-40">
                <img
                  src={variation.images[optionIndex]}
                  alt={`Option ${optionIndex + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(variationIndex, optionIndex)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  X
                </button>
              </div>
            )}

            {/* Hiển thị trạng thái tải ảnh */}
            {loadingImages[`${variationIndex}-${optionIndex}`] && (
              <p className="text-sm text-blue-500">Đang tải ảnh...</p>
            )}

            {/* Upload ảnh */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(variationIndex, optionIndex, e.target.files[0])
              }
              className="mt-2"
            />
          </div>
        ))}

        <button
          onClick={() => onAddOption(variationIndex)}
          className="mt-2 px-4 py-1 text-sm text-mainColor border border-dashed rounded hover:bg-[#f1f6ff]"
        >
          Thêm tùy chọn
        </button>
      </div>
    </div>
  );
};

export default OptionForm;
