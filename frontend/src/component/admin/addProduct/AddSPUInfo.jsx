// src/component/admin/addproduct/ProductForm.js

import React from "react";
import AddProductForm from "./AddProductForm";
import CategorySelect from "./CategorySelect";
import TagInput from "./TagInput";
import ThumbnailUpload from "./ThumbnailUpload";
import MoreImagesUpload from "./MoreImagesUpload";

const AddSPUInfo = ({
  productData,
  handleChange,
  setProductData,
  handleSubmit,
}) => {
  return (
    <div className="flex w-full justify-center items-center bg-white rounded-lg shadow-md p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
        <form onSubmit={handleSubmit} className="w-full pr-4 space-y-5">
          <h2 className="text-xl font-bold mb-4">Thông tin sản phẩm</h2>

          {/* AddProductForm: Nhập tên và mô tả sản phẩm */}
          <AddProductForm
            productData={productData}
            handleChange={handleChange}
            setProductData={setProductData}
          />

          {/* CategorySelect: Chọn danh mục sản phẩm */}
          <CategorySelect
            productData={productData}
            handleChange={handleChange}
            setProductData={setProductData}
          />

          {/* TagInput: Thêm thẻ cho sản phẩm */}
          <TagInput productData={productData} setProductData={setProductData} />
          <MoreImagesUpload
            productData={productData}
            setProductData={setProductData}
          />
        </form>

        {/* ThumbnailUpload: Upload ảnh thumbnail */}
        <ThumbnailUpload
          productData={productData}
          setProductData={setProductData}
        />
      </div>
    </div>
  );
};

export default AddSPUInfo;
