import React, { useState, useEffect } from "react";
import { AiOutlineReload } from "react-icons/ai";
import Loading from "../../../component/Loading"; // Component loading giả định
import { formatVND } from "../../../utils/format"; // Hàm giả định format tiền tệ
import { getTopProduct } from "../../../config/api";

const TopProductPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);

  useEffect(() => {
    handleGetTopProducts();
  }, []);

  const handleGetTopProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getTopProduct();
      if (response.status === 200 && response.metadata) {
        console.log("🚀 ~ handleGetTopProducts ~ response:", response);
        setCategoriesWithProducts(response.metadata);
      } else {
        console.error("Failed to fetch top products.");
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white px-6 py-4 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Top Products</h1>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loading />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Sales by Categories */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-extrabold mb-4">
              Top Sales by Categories
            </h2>
            <div className="space-y-4">
              {categoriesWithProducts.map((category, index) => (
                <div key={index} className="space-y-2">
                  {/* Tên danh mục và giá trị */}
                  <div className="flex justify-between">
                    <span className="text-gray-800 text-lg font-medium">
                      {category.category?.category_name || "Unknown Category"}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {formatVND(category.totalRevenue || 0)}
                    </span>
                  </div>
                  {/* Thanh tiến trình */}
                </div>
              ))}
            </div>
          </div>

          {/* Best Sold Products By Category */}
          <div>
            {categoriesWithProducts
              .filter((category) => category.bestSold?.length > 0) // Lọc danh mục có sản phẩm
              .map((category, index) => (
                <div key={index} className="space-y-6">
                  {/* Category Info */}
                  <div className="flex items-center mb-4">
                    <img
                      src={category.category?.category_img || ""}
                      alt={category.category?.category_name || "Category"}
                      className="w-24 h-24 rounded-lg object-cover mr-6"
                    />
                    <h2 className="text-2xl font-extrabold text-gray-800">
                      {category.category?.category_name || "Unknown Category"}
                    </h2>
                  </div>

                  {/* Best Sold Products */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.bestSold.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white p-4 rounded-lg shadow-md flex flex-col"
                      >
                        <img
                          src={product.product_thumb}
                          alt={product.product_name}
                          className="w-full h-40 object-contain rounded-lg mb-4"
                        />
                        <h3 className="font-bold text-gray-800 mb-2">
                          {product.product_name}
                        </h3>
                        <p className="font-bold text-green-600">
                          Available: {product.product_quantity}
                        </p>
                        <p className="font-bold text-blue-600">
                          Sold: {product.product_quantitySold}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopProductPage;
