import React, { useState, useEffect } from "react";
import { filterProductFlashSale, getAllProduct } from "../../../config/api";
import { formatVND } from "../../../utils/format";
import CategorySelect from "../../CategorySelect";

const ProductSelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  productList,
  setProductList,
  selectedProducts,
  setSelectedProducts,
  flashSaleData,
}) => {
  console.log("🚀 ~ flashSaleData:", flashSaleData);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered product list
  const [filterCategory, setFilterCategory] = useState(""); // Category filter
  console.log("🚀 ~ filterCategory:", filterCategory);
  const [filterName, setFilterName] = useState("");
  // Fetch products when the modal opens
  const handleGetAllProduct = async () => {
    try {
      const response = await filterProductFlashSale(
        flashSaleData.startTime,
        flashSaleData.endTime
      );
      const products = response.metadata || [];
      setProductList(products);
      setFilteredProducts(products); // Initialize filteredProducts
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleGetAllProduct();
    }
  }, [isOpen]);

  // Handle filtering logic
  const handleFilter = async () => {
    let filtered = productList;

    // Apply category filter
    if (filterCategory) {
      const response = await filterProductFlashSale(
        flashSaleData.startTime,
        flashSaleData.endTime,
        filterCategory,
        filterName
      );
      setFilteredProducts(response.metadata);
      console.log("🚀 ~ handleFilter ~ response:", response);
    } else {
      setFilteredProducts(filtered);
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setIsAllSelected(checked);
    if (checked) {
      setSelectedProducts(filteredProducts.map((product) => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (e, productId) => {
    const checked = e.target.checked;
    let updatedSelectedProducts = [];

    if (checked) {
      updatedSelectedProducts = [...selectedProducts, productId];
    } else {
      updatedSelectedProducts = selectedProducts.filter(
        (id) => id !== productId
      );
    }

    setSelectedProducts(updatedSelectedProducts);

    // Update isAllSelected state
    setIsAllSelected(
      updatedSelectedProducts.length === filteredProducts.length
    );
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
        <div className="bg-white w-3/4 max-w-4xl rounded-lg shadow-lg p-6 relative">
          <h2 className="text-lg font-bold mb-4">Chọn Sản Phẩm</h2>

          {/* Filter Section */}
          <div className="flex justify-between items-center gap-4 mb-4">
            <CategorySelect setFilterCategory={setFilterCategory} />
            <div className="flex items-center gap-4 w-2/3">
              <input
                type="text"
                placeholder="Tìm kiếm tên sản phẩm"
                className="border border-gray-300 rounded-md px-3 py-2 w-full ml-15"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
              <button
                className="bg-mainColor text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={handleFilter}
              >
                Lọc
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            <table className="w-full border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left px-4 py-2 border-b">Sản Phẩm</th>
                  <th className="text-left px-4 py-2 border-b">Giá</th>
                  <th className="text-left px-4 py-2 border-b">Kho hàng</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="">
                      <td className="p-5 py-2 border-b ">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={(e) => handleSelectProduct(e, product._id)}
                        />
                      </td>
                      <td className="p-5 border-b flex items-center space-x-4">
                        <img
                          src={product.product_thumb}
                          alt={product.product_name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <span>{product.product_name}</span>
                      </td>
                      <td className="p-5 border-b">
                        {formatVND(product.product_price)}
                      </td>
                      <td className="p-5 border-b">
                        {product.product_quantity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-5 border-b text-center" colSpan="4">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md mr-4 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={() => onConfirm(selectedProducts)}
              className="bg-mainColor text-white py-2 px-6 rounded-md hover:bg-blue-700"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductSelectionModal;
