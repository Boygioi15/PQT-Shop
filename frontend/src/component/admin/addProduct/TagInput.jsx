import React, { useState } from "react";

const TagInput = ({ productData, setProductData }) => {
  const [tagInput, setTagInput] = useState("");

  const handleTagChange = (e) => setTagInput(e.target.value);

  const addTag = () => {
    if (tagInput && !productData.tags.includes(tagInput)) {
      setProductData({
        ...productData,
        tags: [...productData.tags, tagInput],
      });
      setTagInput(""); // Reset the tag input after adding
    }
  };

  const removeTag = (tag) => {
    setProductData({
      ...productData,
      tags: productData.tags.filter((t) => t !== tag),
    });
  };

  return (
    <div className="mb-4">
      <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
        Tags
      </label>
      <div className="flex mb-2">
        <input
          type="text"
          id="tagInput"
          value={tagInput}
          onChange={handleTagChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tag"
        />
        <button
          type="button"
          onClick={addTag}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Thêm
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {productData.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full flex items-center"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-mainColor"
            >
              x
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
