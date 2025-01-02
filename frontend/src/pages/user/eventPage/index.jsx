import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "../../../component/Product/ProductItem";
import SortButton from "../../../component/Product/SortButton";
import FilterSidebar from "../../../component/Product/FilterSidebar";
import { SortOptions } from "../../../component/Product/SortButton/sortOption";
import { getPromotionById } from "../../../config/api";

const PromotionPage = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [promotion, setPromotion] = useState({});

  const handleFetchPromotion = async () => {
    const response = await getPromotionById(id);
    if (response.status === 200) {
      setPromotion(response.metadata);

      const products = response.metadata.appliedProduct.map((product) => ({
        id: product._id,
        name: product?.product_name,
        imageSrc: product?.product_thumb,
        productPrice: product?.product_price,
        link: `/products/${product?.product_slug}`,
        rating: product?.product_ratingAverage,
        tags: product?.product_tags,
      }));
      console.log("🚀 ~ products ~ products:", products);

      setProductList(products);
    }
  };

  useEffect(() => {
    handleFetchPromotion();
  }, [id]);

  return (
    <section className="bg-[#f3f4f6] antialiased">
      <div className="mx-auto max-w-screen-xl">
        {/* Updated banner section */}
        <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden rounded-b-lg shadow-md mb-6">
          {promotion?.prom_banner ? (
            <img
              src={promotion.prom_banner}
              alt="Promotion Banner"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex justify-center items-center text-white text-xl sm:text-2xl font-bold">
              {promotion?.prom_name || "Loading promotion..."}
            </div>
          )}
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900"></h3>
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
      <div className="py-10"></div>
    </section>
  );
};

export default PromotionPage;
