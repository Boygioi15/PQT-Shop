import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { getImageLink } from "../../../config/api";
import Loading from "../../../component/Loading"; // Import component Loading

const MoreImagesUpload = ({ productData, setProductData }) => {
  console.log("🚀 ~ MoreImagesUpload ~ productData:", productData);
  const [previewUrls, setPreviewUrls] = useState([]); // State to store preview URLs for multiple images
  const [error, setError] = useState(""); // State to store error message
  const [isLoading, setIsLoading] = useState(false); // State for loading

  useEffect(() => {
    if (productData.more_imgs && productData.more_imgs.length > 0)
      setPreviewUrls(productData.more_imgs);
  }, []);

  const validateImageCount = (count) => {
    if (count < 4) {
      setError("Bạn cần tải lên ít nhất 4 ảnh.");
    } else {
      setError(""); // Clear error if enough images
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      const updatedPreviewUrls = [...previewUrls, ...newPreviewUrls];
      setPreviewUrls(updatedPreviewUrls); // Update preview URLs

      setIsLoading(true); // Bắt đầu loading
      try {
        const responses = await Promise.all(
          files.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            const response = await getImageLink(formData);
            return response.metadata.image_url; // Assuming API returns this field
          })
        );

        const updatedMoreImgs = [
          ...(productData.more_imgs || []),
          ...responses,
        ];
        setProductData((prev) => ({
          ...prev,
          more_imgs: updatedMoreImgs,
        }));

        // Validate image count
        validateImageCount(updatedPreviewUrls.length);
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    }
  };

  const handleRemoveImage = (index, event) => {
    event.preventDefault(); // Ngăn hành vi mặc định của button

    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);
    const updatedMoreImgs = productData.more_imgs.filter((_, i) => i !== index);

    setPreviewUrls(updatedPreviewUrls);
    setProductData((prev) => ({
      ...prev,
      more_imgs: updatedMoreImgs,
    }));

    // Validate image count
    validateImageCount(updatedPreviewUrls.length);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-auto">
      <h2 className="text-xl font-bold mb-4">Upload More Images</h2>

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Always show the upload button */}
      <label
        htmlFor="uploadFiles"
        className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-3 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 mr-2 fill-white inline"
          viewBox="0 0 32 32"
        >
          <path
            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
            data-original="#000000"
          />
          <path
            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
            data-original="#000000"
          />
        </svg>
        Upload
        <input
          type="file"
          id="uploadFiles"
          name="more_images"
          accept="image/*"
          multiple
          onChange={handleFileChange} // Call handleFileChange on file selection
          className="hidden"
        />
      </label>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-10">
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative group w-40 border border-gray-300 rounded-md overflow-hidden"
          >
            <img
              src={url}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button" // Chỉ định rõ loại button
              onClick={(event) => handleRemoveImage(index, event)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreImagesUpload;
