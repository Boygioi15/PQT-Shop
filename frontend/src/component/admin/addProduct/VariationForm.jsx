import React from "react";
import { IoRemoveOutline } from "react-icons/io5";
import OptionForm from "./OptionForm";

const VariationForm = ({
  variation,
  index,
  onChange,
  onRemove,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onImageUpload,
  onRemoveImage,
}) => {
  return (
    <div className="relative mb-4 p-4 w-full border rounded bg-[#f1f6ff] border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Phân loại {index + 1}</h3>
        <button
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 flex items-center gap-x-1"
        >
          <IoRemoveOutline className="text-xl" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row mb-2">
        <label className="font-medium w-1/3">Tên phân loại:</label>
        <input
          type="text"
          value={variation.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <OptionForm
        variation={variation}
        variationIndex={index}
        onOptionChange={onOptionChange}
        onAddOption={onAddOption}
        onRemoveOption={onRemoveOption}
        onImageUpload={onImageUpload} // Pass the handler
        onRemoveImage={onRemoveImage} // Pass the handler
      />
    </div>
  );
};

export default VariationForm;
