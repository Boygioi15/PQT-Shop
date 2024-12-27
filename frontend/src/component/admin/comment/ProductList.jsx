import React, { useEffect, useState } from "react";
import { getAllProduct } from "../../../config/api";

const ProductList = ({ selectedProduct, setSelectedProduct }) => {
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Sản phẩm sau khi lọc
  const [searchQuery, setSearchQuery] = useState(""); // Giá trị tìm kiếm

  useEffect(() => {
    handleGetAllProduct();
  }, []);

  useEffect(() => {
    // Lọc sản phẩm theo tên khi người dùng nhập vào thanh tìm kiếm
    const filtered = productList.filter((product) =>
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, productList]);

  const handleGetAllProduct = async () => {
    try {
      const response = await getAllProduct();
      if (response && response.metadata) {
        setProductList(response.metadata);
        setFilteredProducts(response.metadata); // Hiển thị toàn bộ sản phẩm ban đầu
      } else {
        console.error("No products found");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
        Sản phẩm
      </h2>
      {/* Thanh Tìm Kiếm */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật giá trị tìm kiếm
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      {/* Danh sách sản phẩm */}
      <ul className="space-y-4 max-h-[500px] overflow-y-auto">
        {filteredProducts.map((product) => (
          <li
            key={product._id}
            className={`flex items-start justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition ${
              selectedProduct === product._id
                ? "bg-blue-50 border-blue-500"
                : ""
            }`}
            onClick={() => setSelectedProduct(product._id)}
          >
            {/* Hình ảnh sản phẩm */}
            <img
              src={product.product_thumb || "https://via.placeholder.com/50"}
              alt={product.product_name}
              className="w-16 h-16 object-cover rounded-lg mr-4"
            />
            {/* Chi tiết sản phẩm */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm">
                {product.product_name}
              </h3>
              <p className="text-sm text-gray-500">
                {product.product_price.originalPrice}₫
              </p>
              <p className="text-xs text-gray-500">
                Đã bán: {product.product_quantitySold}
              </p>
            </div>
            {/* Đánh giá sản phẩm */}
            <div className="text-yellow-500 text-sm">
              {product.product_ratingAverage || 0}⭐
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
