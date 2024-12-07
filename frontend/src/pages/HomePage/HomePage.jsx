import { useEffect, useState } from "react";
import BriefProductCard from "../../reusable-components/BriefProductCard/BriefProductCard";

import "./style.css";
import axios from "axios";
import { formatPrice } from "../../utils";

export default function HomePage() {
  const [topSaleList, setTopSaleList] = useState([]);
  const [newList, setNewList] = useState([]);
  useEffect(() => {
    // Function to fetch events from the backend
    const fetchTopSaleList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/product/top-sale"
        );
        setTopSaleList(response.data); // Assigning the fetched list of events to the state
      } catch (error) {
        console.error("Error fetching top sale list:", error);
      }
    };
    fetchTopSaleList();
  }, []);
  useEffect(() => {
    // Function to fetch events from the backend
    const fetchNewList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/product/get-new"
        );
        console.log("🚀 ~ fetchNewList ~ response.data:", response.data);

        setNewList(response.data); // Assigning the fetched list of events to the state
      } catch (error) {
        console.error("Error fetching new list:", error);
      }
    };

    fetchNewList();
  }, []);
  //1 request to axios to get the product: top sale, moi
  //2 Title
  return (
    <div className="HomePage">
      <BriefProductShowcase
        productLists={topSaleList}
        title="Các sản phẩm bán chạy nhất"
      />
      <BriefProductShowcase productLists={newList} title="Các sản phẩm mới" />
    </div>
  );
}

function BriefProductShowcase({ productLists, title }) {
  // Function to map over the product list and return BriefProductCard components

  const renderProductCards = () => {
    return productLists.map((product, index) => {
      const brandName = product?.brandRef?.name || "Unknown Brand"; // Xử lý khi `brandRef` không tồn tại

      return (
        <BriefProductCard
          key={index}
          id={product._id}
          name={product.name}
          brand={brandName}
          price={formatPrice(product.price)}
          reviews={product.reviews}
          rating={product.rating || 2}
          imageUrl={product.init_ThumnbnailURL}
          isNew={product.isNew}
          isSale={product.sale}
        />
      );
    });
  };

  return (
    <div className="BriefProductShowcase">
      <p>{title}</p>
      <div>{renderProductCards()}</div>
    </div>
  );
}
