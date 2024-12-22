import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterSidebar from "../../../component/Product/FilterSidebar";
import ProductItem from "../../../component/Product/ProductItem";
import SortButton from "../../../component/Product/SortButton"; // Import SortButton
import { SortOptions } from "../../../component/Product/SortButton/sortOption"; // Import constants
import { filterProduct } from "../../../config/api";

const ProductPage = () => {
  const { categorySlug } = useParams();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  console.log("🚀 ~ ProductPage ~ productList:", productList);
  const [selectedOption, setSelectedOption] = useState(SortOptions.newest);
  const [loading, setLoading] = useState(true); // Add loading state

  const handleGetListProduct = async () => {
    setLoading(true); // Start loading
    const response = await filterProduct({
      categorySlug,
      minPrice,
      maxPrice,
      sortBy: selectedOption,
    });
    if (response && response.status === 200) {
      const products = response.metadata.map((product) => ({
        id: product._id,
        name: product?.product_name,
        imageSrc: product?.product_thumb,
        productPrice: product?.product_price,
        link: `/products/${product?.product_slug}`,
      }));

      setProductList(products);
    }
    setLoading(false); // Stop loading
  };

  // Hàm xử lý mở/đóng dropdown
  const toggleSortDropdown = () => {
    setIsSortDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    handleGetListProduct();
  }, [categorySlug, minPrice, maxPrice, selectedOption]);

  return (
    <section className="bg-[#f3f4f6] antialiased">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex gap-6">
          <FilterSidebar
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {categorySlug}
              </h3>
              <SortButton
                isSortDropdownOpen={isSortDropdownOpen}
                toggleSortDropdown={toggleSortDropdown}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              </div>
            ) : productList.length === 0 ? (
              <div className="text-center text-lg text-gray-600">
                Không tìm thấy sản phẩm nào
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                {productList.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    isEdit={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
