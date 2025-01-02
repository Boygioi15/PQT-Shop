import React, { useEffect, useState } from "react";
import { getAllProduct } from "../../../config/api";
import Pagination from "../../Pagiantion";
import { AiFillStar } from "react-icons/ai";

const ITEMS_PER_PAGE = 6;

const ProductList = ({ selectedProduct, setSelectedProduct }) => {
  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleGetAllProduct();
  }, [searchQuery, currentPage]); // Lắng nghe cả searchQuery và currentPage

  const handleGetAllProduct = async () => {
    try {
      setIsLoading(true);
      const response = await getAllProduct({
        search: searchQuery,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      if (response && response.metadata) {
        setProductList(response.metadata.products);
        setTotalPages(response.metadata.pagination.totalPages);
      } else {
        console.error("No products found");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm mới
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="flex flex-col h-screen bg-white rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Danh sách sản phẩm
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange} // Thay đổi hàm xử lý
            placeholder="Tìm kiếm theo tên sản phẩm..."
            className="w-full pl-4 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50"
          />
          <svg
            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Product List Section */}
      <div className="flex-1 overflow-hidden px-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="space-y-3 overflow-y-auto h-full py-4">
            {productList.map((product) => (
              <li
                key={product._id}
                onClick={() => setSelectedProduct(product._id)}
                className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer
                  ${
                    selectedProduct === product._id
                      ? "bg-blue-50 border-blue-500 shadow-md"
                      : "hover:bg-gray-50 hover:border-gray-300"
                  }`}
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={
                      product.product_thumb || "https://via.placeholder.com/80"
                    }
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {product.product_name}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="mx-2">•</span>
                    <span>Đã bán: {product.product_quantitySold}</span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center text-yellow-400">
                      <AiFillStar className="h-4 w-4" />
                      <span className="ml-1 text-sm font-medium">
                        {product.product_ratingAverage?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    {product.product_ratingCount > 0 && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({product.product_ratingCount} đánh giá)
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination Section */}
      <div className="border-t p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProductList;
