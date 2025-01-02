import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterSidebar from "../../../component/Product/FilterSidebar";
import ProductItem from "../../../component/Product/ProductItem";
import SortButton from "../../../component/Product/SortButton";
import { SortOptions } from "../../../component/Product/SortButton/sortOption";
import { filterProduct } from "../../../config/api";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Pagination from "../../../component/Pagiantion";

const ITEMS_PER_PAGE = 9;

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

  const handleGetListProduct = async () => {
    setLoading(true);

    const response = await filterProduct({
      categorySlug,
      minPrice,
      maxPrice,
      sortBy: selectedOption,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    });

    if (response && response.status === 200) {
      const products = response.metadata.data.map((product) => ({
        id: product._id,
        name: product?.product_name,
        imageSrc: product?.product_thumb,
        productPrice: product?.product_price,
        link: `/products/${product?.product_slug}`,
        rating: product?.product_ratingAverage,
        tags: product?.product_tags,
      }));

      setProductList(products);
      setTotalPages(response.metadata.pagination.totalPages);
    }
    setLoading(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen((prev) => !prev);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    handleGetListProduct();
  }, [categorySlug, minPrice, maxPrice, selectedOption, currentPage]);

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
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
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
