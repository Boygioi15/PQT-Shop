import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddSPUInfo from "../../../component/admin/addProduct/AddSPUInfo";
import AddVariationsInfo from "../../../component/admin/addProduct/AddVariationsInfo";
import AddAttributesInfo from "../../../component/admin/addProduct/AddAttributesInfo";
import { toast } from "react-toastify";
import {
  getProduct,
  creatNewProduct,
  editNewProduct,
} from "../../../config/api";

const AddProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    category: [],
    description: "",
    tags: [],
    thumb: null,
    variations: [],
    sku_list: [],
    attributes: [],
    more_imgs: [],
  });
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      handleGetProduct(id).finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateAttributes = (updatedAttributes) => {
    setProductData((prev) => ({
      ...prev,
      attributes: updatedAttributes,
    }));
  };

  const handleUpdateVariations = (updatedVariations) => {
    setProductData((prev) => ({
      ...prev,
      variations: updatedVariations,
    }));
  };

  const handleUpdateSkuList = (updatedSkuList) => {
    setProductData((prev) => ({
      ...prev,
      sku_list: updatedSkuList,
    }));
  };

  const handleGetProduct = async (spu_id) => {
    try {
      const response = await getProduct(spu_id);
      if (response && response.metadata) {
        const product = response.metadata;
        const spu_info = product.spu_info;
        const sku_list = product.sku_list;

        const cleanedSkuList = sku_list.map((sku) => ({
          sku_index: sku.sku_index,
          sku_price: sku.sku_price.originalPrice,
          sku_stock: sku.sku_stock,
        }));

        setProductData({
          ...productData,
          name: spu_info.product_name || "",
          category: spu_info.product_category || [],
          description: spu_info.product_description || "",
          tags: spu_info.product_tags || [],
          thumb: spu_info.product_thumb || null,
          variations: spu_info.product_variations || [],
          sku_list: cleanedSkuList,
          attributes: spu_info.product_attributes || [],
          more_imgs: spu_info.product_more_imgs || [],
        });
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const handleConfirm = () => {
    const requiredFields = [
      { key: "name", label: "Tên sản phẩm" },
      { key: "category", label: "Danh mục sản phẩm" },
      { key: "description", label: "Mô tả sản phẩm" },
      { key: "tags", label: "Tags sản phẩm" },
    ];

    for (const field of requiredFields) {
      if (
        !productData[field.key] ||
        (Array.isArray(productData[field.key]) &&
          productData[field.key].length === 0) ||
        (typeof productData[field.key] === "string" &&
          productData[field.key].trim() === "")
      ) {
        toast.error(`Vui lòng nhập ${field.label}`);
        return;
      }
    }

    setShowDialog(true);
  };

  const handleCreateNew = async () => {
    try {
      const response = await creatNewProduct(productData);
      if (response && response.status === 200) {
        toast.success("Sản phẩm đã được tạo mới thành công!");
        navigate("/admin/stock"); // Redirect to "Kho hàng"
      } else {
        throw new Error("Đã xảy ra lỗi trong quá trình tạo sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error.message);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau!");
    } finally {
      setShowDialog(false);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await editNewProduct(productData, id);
      if (response && response.status === 200) {
        toast.success("Sản phẩm đã được cập nhật thành công!");
        navigate("/admin/inventory"); // Redirect to "Kho hàng"
      } else {
        throw new Error("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error.message);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau!");
    } finally {
      setShowDialog(false);
    }
  };

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading product data...</div>
      ) : (
        <>
          <AddSPUInfo
            productData={productData}
            handleChange={handleChange}
            setProductData={setProductData}
          />

          <div className="mt-10">
            <AddVariationsInfo
              productData={productData}
              onUpdateVariations={handleUpdateVariations}
              onUpdateSkuList={handleUpdateSkuList}
            />
          </div>

          <div className="mt-10">
            <AddAttributesInfo
              category={productData.category}
              productData={productData}
              onUpdateAttributes={handleUpdateAttributes}
            />
          </div>

          <div className="flex justify-end mt-5">
            <button
              className="bg-mainColor text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              onClick={handleConfirm}
            >
              {id ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
            </button>
          </div>

          {showDialog && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Xác nhận</h2>
                <p className="mb-6">
                  Bạn có chắc chắn muốn {id ? "cập nhật" : "thêm mới"} sản phẩm
                  này?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    onClick={() => setShowDialog(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={id ? handleEdit : handleCreateNew}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddProductPage;
