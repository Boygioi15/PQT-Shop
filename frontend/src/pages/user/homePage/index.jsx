import React, { memo, useEffect, useState } from "react";
import Banner from "../../../component/Banner";
import ProductCategory from "../../../component/Product/Category/ProductCategory";
import DiscountProduct from "../../../component/Product/DiscountProduct";
import ProductSection from "../../../component/Product/ProductSection";
import FlashSale from "../../../component/Product/FlashSale";
import RecommendSection from "../../../component/RecommendSection/RecommendSection";
import { useSelector } from "react-redux";
import RecommendSectionTrending from "../../../component/RecommendSection/RecommendSectionTrending";
import { getCategoryById, getHomePageProduct } from "../../../config/api";

const HomePage = () => {
  const [homePageData, setHomePageData] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("user");
    const accessToken = queryParams.get("token");

    if (userId && accessToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user_id", userId);
    }

    handleGetHomePageProduct();
  }, []);

  const handleGetHomePageProduct = async () => {
    try {
      const response = await getHomePageProduct();
      if (response && response.metadata) {
        // Định dạng lại sản phẩm
        const formattedData = response.metadata
          .map((category) => ({
            ...category,
            spusWithPrice: category.spusWithPrice.map((product) => ({
              id: product._id,
              name: product?.product_name,
              imageSrc: product?.product_thumb,
              productPrice: product?.product_price,
              link: `/products/${product?.product_slug}`,
            })),
          }))
          .filter((category) => category.spusWithPrice.length > 0);

        setHomePageData(formattedData);

        // Fetch category names and descriptions
        const categoryNamePromises = response.metadata.map((category) =>
          getCategoryById(category.category._id).then((res) => ({
            id: category.category._id,
            name: res?.metadata?.category_name || "Unnamed Category",
            description:
              res?.metadata?.category_description || "No description",
          }))
        );

        const names = await Promise.all(categoryNamePromises);
        const nameMap = names.reduce((acc, { id, name, description }) => {
          acc[id] = { name, description }; // Map category ID với name và description
          return acc;
        }, {});

        setCategoryNames(nameMap); // Update state với category names và descriptions
      } else {
        console.error("Failed to fetch home page data.");
      }
      console.log("🚀 ~ handleGetHomePageProduct ~ response:", response);
    } catch (error) {
      console.error("Error fetching home page data:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div>
        <Banner />
      </div>

      {/* Product Categories */}
      <div>
        <ProductCategory />
      </div>

      {/* Flash Sale */}
      <div>
        <FlashSale />
      </div>

      {/* Discounted Products */}
      <div>
        <DiscountProduct />
      </div>

      {/* Recommended Sections */}
      {isAuthenticated ? (
        <div>
          <RecommendSection />
        </div>
      ) : (
        <div>
          <RecommendSectionTrending />
        </div>
      )}

      {/* Dynamic Product Sections */}
      {homePageData.map((category) => (
        <div key={category._id}>
          <ProductSection
            products={category.spusWithPrice}
            title={`${
              categoryNames[category.category._id]?.name || "Loading..."
            } - ${
              categoryNames[category.category._id]?.description ||
              "Loading description..."
            }`}
          />
        </div>
      ))}
      <div className="py-10"></div>
    </div>
  );
};

export default memo(HomePage);
