import React, { useState, useEffect } from "react";
import VariationForm from "./VariationForm";
import SkuTable from "./SkuTable";
import { formatNumber, parseNumber } from "../../../utils/format";
import { getImageLink } from "../../../config/api";

const AddVariationsInfo = ({
  productData,
  onUpdateVariations,
  onUpdateSkuList,
}) => {
  const [variationsList, setVariationsList] = useState([]);
  const [sku_list, setSku_list] = useState([]);
  const [price, setPrice] = useState(""); // Giá cho tất cả các SKU
  const [stock, setStock] = useState(0); // Kho cho tất cả các SKU

  useEffect(() => {
    if (productData.variations && productData.variations.length > 0) {
      setVariationsList(productData.variations);
    }
    if (productData.sku_list && productData.sku_list.length > 0) {
      setSku_list(productData.sku_list);
    }
  }, [productData]);

  const setVariationsListAndUpdate = (newVariationsList) => {
    setVariationsList(newVariationsList);
    onUpdateVariations(newVariationsList); // Cập nhật dữ liệu lên component cha
    generateSkuList(newVariationsList);
  };

  const setSkuListAndUpdate = (newSkuList) => {
    setSku_list(newSkuList);
    onUpdateSkuList(newSkuList);
  };

  const addNewVariation = () => {
    const newVariations = [
      ...variationsList,
      { name: "", options: [""], images: [] }, // Thêm trường images rỗng
    ];
    setVariationsListAndUpdate(newVariations);
  };

  const removeVariation = (index) => {
    const updatedVariations = variationsList.filter((_, i) => i !== index);
    setVariationsListAndUpdate(updatedVariations);
  };

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = variationsList.map((variation, i) =>
      i === index ? { ...variation, [field]: value } : variation
    );
    setVariationsListAndUpdate(updatedVariations);
  };

  const handleOptionChange = (variationIndex, optionIndex, value) => {
    const updatedVariations = variationsList.map((variation, i) => {
      if (i === variationIndex) {
        const updatedOptions = [...variation.options];
        updatedOptions[optionIndex] = value;

        // Đảm bảo images khớp với options
        const updatedImages = [...(variation.images || [])];
        while (updatedImages.length < updatedOptions.length) {
          updatedImages.push(""); // Thêm giá trị rỗng cho ảnh
        }

        return { ...variation, options: updatedOptions, images: updatedImages };
      }
      return variation;
    });
    setVariationsListAndUpdate(updatedVariations);
  };

  const addOption = (variationIndex) => {
    const updatedVariations = variationsList.map((variation, i) => {
      if (i === variationIndex) {
        const updatedOptions = [...variation.options, ""];

        // Đảm bảo images khớp với options
        const updatedImages = [...(variation.images || [])];
        updatedImages.push(""); // Thêm giá trị rỗng cho ảnh

        return { ...variation, options: updatedOptions, images: updatedImages };
      }
      return variation;
    });
    setVariationsListAndUpdate(updatedVariations);
  };

  const removeOption = (variationIndex, optionIndex) => {
    const updatedVariations = variationsList.map((variation, i) => {
      if (i === variationIndex) {
        const updatedOptions = variation.options.filter(
          (_, idx) => idx !== optionIndex
        );

        // Loại bỏ hình ảnh tương ứng
        const updatedImages = variation.images.filter(
          (_, idx) => idx !== optionIndex
        );

        return { ...variation, options: updatedOptions, images: updatedImages };
      }
      return variation;
    });
    setVariationsListAndUpdate(updatedVariations);
  };

  const handlePriceChange = (skuIndexId, value) => {
    const updatedSkuList = sku_list.map((sku, i) =>
      i === skuIndexId ? { ...sku, sku_price: value } : sku
    );
    setSkuListAndUpdate(updatedSkuList);
  };

  const handleStockChange = (skuIndexId, value) => {
    const updatedSkuList = sku_list.map((sku, i) =>
      i === skuIndexId ? { ...sku, sku_stock: +value } : sku
    );
    setSkuListAndUpdate(updatedSkuList);
  };

  const generateSkuList = (variations = variationsList) => {
    const skuList = [];
    const optionsCount = variations.map(
      (variation) => variation.options.length
    );
    const totalCombinations = optionsCount.reduce(
      (acc, count) => acc * count,
      1
    );

    for (let i = 0; i < totalCombinations; i++) {
      const skuIndex = [];
      let combinationIndex = i;

      variations.forEach((variation) => {
        const optionIndex = combinationIndex % variation.options.length;
        skuIndex.push(optionIndex);
        combinationIndex = Math.floor(
          combinationIndex / variation.options.length
        );
      });

      skuList.push({
        sku_index: skuIndex,
        sku_price: "",
        sku_stock: 0,
      });
    }

    setSkuListAndUpdate(skuList);
  };

  const applyToAll = () => {
    const updatedSkuList = sku_list.map((sku) => ({
      ...sku,
      sku_price: price,
      sku_stock: +stock,
    }));
    setSkuListAndUpdate(updatedSkuList);
  };

  useEffect(() => {
    if (!productData.sku_list || !productData.sku_list.length > 0) {
      generateSkuList();
    }
  }, [variationsList]);
  const handleImageUpload = async (variationIndex, optionIndex, file) => {
    if (!file) return;

    try {
      // Upload file và lấy link ảnh từ API
      const formData = new FormData();
      formData.append("file", file);
      const response = await getImageLink(formData);
      const uploadedImageUrl = response.metadata.image_url; // Lấy link ảnh từ API

      // Cập nhật trường images của variation
      const updatedVariations = variationsList.map((variation, i) => {
        if (i === variationIndex) {
          const updatedImages = [...(variation.images || [])];
          updatedImages[optionIndex] = uploadedImageUrl;
          return { ...variation, images: updatedImages };
        }
        return variation;
      });

      setVariationsListAndUpdate(updatedVariations);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleRemoveImage = (variationIndex, optionIndex) => {
    const updatedVariations = variationsList.map((variation, i) => {
      if (i === variationIndex) {
        const updatedImages = [...(variation.images || [])];
        updatedImages[optionIndex] = ""; // Xóa ảnh tại vị trí optionIndex
        return { ...variation, images: updatedImages };
      }
      return variation;
    });

    setVariationsListAndUpdate(updatedVariations);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Thông tin phân loại SKU</h2>
      <div className="md:p-10 p-0">
        <div className="flex flex-col md:flex-row ">
          <label className="w-32">Phân loại hàng</label>
          <div className="md:ml-10 ml-0 mt-5 md:mt-0 w-full">
            <div>
              {variationsList.length > 0 && (
                <div>
                  {variationsList.map((variation, index) => (
                    <VariationForm
                      key={index}
                      variation={variation}
                      index={index}
                      onChange={handleVariationChange}
                      onRemove={removeVariation}
                      onOptionChange={handleOptionChange}
                      onAddOption={addOption}
                      onRemoveOption={removeOption}
                      onImageUpload={handleImageUpload}
                      onRemoveImage={handleRemoveImage} // Truyền hàm xử lý xóa ảnh
                    />
                  ))}
                </div>
              )}
              <button
                onClick={addNewVariation}
                className="px-4 py-2 border border-dashed text-mainColor rounded hover:bg-[#f1f6ff]"
              >
                Thêm phân loại mới
              </button>
              {variationsList.length > 0 && (
                <>
                  <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <div className="flex items-center md:flex-col md:items-start w-full md:w-1/2 gap-x-4 md:gap-y-2">
                      <label className="font-medium w-24 md:w-full">Giá</label>
                      <input
                        type="text"
                        value={formatNumber(price) || ""}
                        onChange={(e) => {
                          const rawValue = parseNumber(e.target.value);
                          setPrice(rawValue);
                        }}
                        className="w-full md:w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex items-center md:flex-col md:items-start w-full md:w-1/2 gap-x-4 md:gap-y-2">
                      <label className="font-medium w-24 md:w-full">
                        Kho hàng
                      </label>
                      <input
                        type="number"
                        value={stock || ""}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full md:w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <button
                    onClick={applyToAll}
                    className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Áp dụng cho tất cả
                  </button>
                </>
              )}

              {variationsList.length > 0 && (
                <SkuTable
                  skuList={sku_list}
                  variationsList={variationsList}
                  onPriceChange={handlePriceChange}
                  onStockChange={handleStockChange}
                />
              )}
            </div>
          </div>
        </div>
        {variationsList.length === 0 && (
          <>
            <div className="mt-4 flex flex-col gap-y-6">
              {/* Giá */}
              <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-y-0">
                <label className="font-medium w-32">Giá</label>
                <input
                  type="text"
                  value={formatNumber(price) || ""}
                  onChange={(e) => {
                    const rawValue = parseNumber(e.target.value);
                    setPrice(rawValue);
                  }}
                  className="md:ml-4 w-full md:w-1/3 p-2 border rounded"
                />
              </div>

              {/* Kho hàng */}
              <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-y-0">
                <label className="font-medium w-32">Kho hàng</label>
                <input
                  type="number"
                  value={stock || ""}
                  onChange={(e) => setStock(e.target.value)}
                  className="md:ml-4 w-full md:w-1/3 p-2 border rounded"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddVariationsInfo;
