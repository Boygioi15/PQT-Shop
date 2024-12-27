import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterSidebar from "../../../component/Product/FilterSidebar";
import ProductItem from "../../../component/Product/ProductItem";
import SortButton from "../../../component/Product/SortButton";
import { SortOptions } from "../../../component/Product/SortButton/sortOption";
import { filterProduct } from "../../../config/api";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const ITEMS_PER_PAGE = 6;

const ProductPage = () => {
  const { categorySlug } = useParams();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(SortOptions.newest);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const handleGetListProduct = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const response = await filterProduct({
      categorySlug,
      minPrice,
      maxPrice,
      sortBy: selectedOption,
      limit: ITEMS_PER_PAGE,
      offset: offset,
    });

    if (response && response.status === 200) {
      const products = response.metadata.data.map((product) => ({
        id: product._id,
        name: product?.product_name,
        imageSrc: product?.product_thumb,
        productPrice: product?.product_price,
        link: `/products/${product?.product_slug}`,
      }));

      setProductList(products);
      setTotal(response.metadata.pagination.total);
      setTotalPages(
        Math.ceil(response.metadata.pagination.total / ITEMS_PER_PAGE)
      );
    }
    setLoading(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    handleGetListProduct();
  }, [categorySlug, minPrice, maxPrice, selectedOption, currentPage]); // Thêm currentPage vào dependencies

  return (
    <section className="bg-[#f3f4f6] antialiased min-h-[800px]">
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                  {productList.map((product) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      isEdit={false}
                    />
                  ))}
                </div>

                <ul className="flex space-x-5 justify-center mt-6">
                  <li
                    className={`flex items-center justify-center bg-gray-100 w-9 h-9 rounded-md cursor-pointer ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                  >
                    <AiOutlineLeft className="text-gray-500" />
                  </li>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <li
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center w-9 h-9 rounded-md cursor-pointer ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </li>
                  ))}

                  <li
                    className={`flex items-center justify-center bg-gray-100 w-9 h-9 rounded-md cursor-pointer ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                  >
                    <AiOutlineRight className="text-gray-500" />
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="py-10"></div>
    </section>
  );
};

export default ProductPage;
