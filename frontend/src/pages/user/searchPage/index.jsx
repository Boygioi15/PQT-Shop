import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useParams
import FilterSidebar from "../../../component/Product/FilterSidebar";
import ProductItem from "../../../component/Product/ProductItem";
import { getAllProductByCategory, searchProduct } from "../../../config/api";
import SortButton from "../../../component/Product/SortButton";
import { SortOptions } from "../../../component/Product/SortButton/sortOption";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const searchTerm = queryParams.get("s");
  const [numberResult, setNumberResult] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(SortOptions.newest);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleGetListSearchProduct = async () => {
    setLoading(true);
    const response = await searchProduct({
      textSearch: searchTerm,
      minPrice,
      maxPrice,
      sortBy: selectedOption,
    });
    if (response && response.status === 200) {
      setNumberResult(response.metadata.totalResult);
      const products = response.metadata.products.map((product) => ({
        id: product._id, // Hoặc _id, tùy theo cấu trúc của response
        name: product?.product_name,
        imageSrc: product?.product_thumb,
        productPrice: product?.product_price, // Hoặc thuộc tính hình ảnh phù hợp
        link: `/products/${product?.product_slug}`, // Giả sử slug là một thuộc tính trong API
      }));

      setProductList(products); // Cập nhật state categoryList
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetListSearchProduct();
  }, [searchTerm]);

  // Hàm xử lý mở/đóng dropdown
  const toggleSortDropdown = () => {
    setIsSortDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    handleGetListSearchProduct();
  }, [minPrice, maxPrice, selectedOption]);

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
                Tìm thấy <strong>{numberResult}</strong> kết quả với từ khoá{" "}
                <strong>{searchTerm}</strong>
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

export default SearchPage;
