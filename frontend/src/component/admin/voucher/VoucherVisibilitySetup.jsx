import React, { useState, useEffect } from "react";
import { getAdminAllProduct } from "../../../config/api";
import { FaTrashAlt } from "react-icons/fa"; // Import biểu tượng thùng rác
import ProductSelectionModal from "../flashSale/ProductSeletionModal";
import ProductSelectionModalForVoucher from "./ProductSelectionModalForVoucher";

const VoucherVisibilitySetup = ({ voucherData, setVoucherData, type }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(
    voucherData.product_ids || []
  );
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (selectedProducts.length > 0) {
        try {
          const response = await getAdminAllProduct(selectedProducts);
          setProductDetails(response.metadata || []);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      } else {
        setProductDetails([]);
      }
    };

    fetchProductDetails();
  }, [selectedProducts]);

  const handleVisibilityChange = (value) => {
    setVoucherData({ ...voucherData, isPublic: value });
  };

  const handleAddProducts = (selected) => {
    setSelectedProducts(selected);
    setVoucherData({ ...voucherData, product_ids: selected });
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Hiển thị mã giảm giá và các sản phẩm áp dụng
      </h2>

      {/* Visibility Settings */}
      <div className="flex flex-col md:flex-row md:items-center mb-8 gap-4">
        <label className="font-bold text-gray-700 w-full md:w-1/4">
          Thiết lập hiển thị
        </label>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="public"
              name="visibility"
              className="w-5 h-5 text-mainColor focus:ring-mainColor border-gray-300"
              checked={voucherData.isPublic}
              onChange={() => handleVisibilityChange(true)}
            />
            <label htmlFor="public" className="text-gray-700">
              Hiển thị nhiều nơi
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="private"
              name="visibility"
              className="w-5 h-5 text-mainColor focus:ring-mainColor border-gray-300"
              checked={!voucherData.isPublic}
              onChange={() => handleVisibilityChange(false)}
            />
            <label htmlFor="private" className="text-gray-700">
              Chia sẻ thông qua mã Voucher
            </label>
          </div>
        </div>
      </div>

      {!voucherData.isPublic && type !== "all" && (
        <p className="text-sm text-gray-500 mb-6">
          Mã giảm giá của bạn sẽ không được công khai, bạn có thể chia sẻ mã
          giảm giá với người dùng khác.
        </p>
      )}

      {/* Product Selection */}
      <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
        <label className="font-bold text-gray-700 w-full md:w-1/4">
          Sản phẩm được áp dụng
        </label>
        {type === "all" ? (
          <div className="bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-lg">
            Tất cả sản phẩm
          </div>
        ) : (
          <button
            className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition ${
              voucherData.start_date && voucherData.end_date
                ? "border-mainColor text-mainColor hover:bg-mainColor hover:text-white"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => setIsModalOpen(true)}
            disabled={!voucherData.start_date || !voucherData.end_date} // Điều kiện vô hiệu hóa
          >
            <span className="text-xl">+</span> Thêm sản phẩm
          </button>
        )}
      </div>

      {productDetails.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-md text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-800 font-medium">
                <th className="px-4 py-3 text-left">Sản phẩm</th>
                <th className="px-4 py-3 text-left">Giá gốc</th>
                <th className="px-4 py-3  text-center">Số lượng hàng</th>
                <th className="px-4 py-3 text-center">Hoạt động</th>
              </tr>
            </thead>
            <tbody>
              {productDetails.map((product) => (
                <tr
                  key={product.spu_info._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 border-b flex items-center gap-4">
                    <img
                      src={product.spu_info.product_thumb}
                      alt={product.spu_info.product_name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <span className="font-semibold text-gray-700">
                      {product.spu_info.product_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b text-gray-600">
                    {product.spu_info.product_price}
                  </td>
                  <td className="px-4 py-3 border-b text-gray-600 text-center">
                    {product.spu_info.product_quantity}
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() =>
                        handleAddProducts(
                          selectedProducts.filter(
                            (id) => id !== product.spu_info._id
                          )
                        )
                      }
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Selection Modal */}
      <ProductSelectionModalForVoucher
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddProducts}
        productList={[]}
        setProductList={() => {}}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        flashSaleData={{
          startTime: voucherData.start_date,
          endTime: voucherData.end_date,
        }}
      />
    </div>
  );
};

export default VoucherVisibilitySetup;
