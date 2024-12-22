import { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductItem from "./ProductItem";

const ProductSection = ({ title }) => {
  const scrollRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [totalProductsToShow, setTotalProductsToShow] = useState(4); // Mặc định 4 sản phẩm trên md

  const product = {
    id: "123",
    imageSrc:
      "https://cdn2.fptshop.com.vn/unsafe/360x0/filters:quality(100)/iphone_16_pro_37987b6def.png",
    link: "",
    name: "Iphone",
    productPrice: {
      orignalPrice: 11000,
      priceAfterDiscount: 1000,
      discount: 100,
    },
  };

  useEffect(() => {
    const updateCardWidth = () => {
      if (scrollRef.current) {
        const firstCard = scrollRef.current.firstChild;
        if (firstCard) {
          setCardWidth(firstCard.offsetWidth + 16); // Tính chiều rộng của card và khoảng cách
        }
      }
    };

    const handleResize = () => {
      // Điều chỉnh số lượng sản phẩm hiển thị dựa vào kích thước màn hình
      if (window.innerWidth < 640) {
        setTotalProductsToShow(1); // Hiển thị 1 sản phẩm
      } else if (window.innerWidth < 800) {
        setTotalProductsToShow(2); // Hiển thị 2 sản phẩm
      } else if (window.innerWidth < 1180) {
        setTotalProductsToShow(3); // Hiển thị 3 sản phẩm
      } else {
        setTotalProductsToShow(4); // Hiển thị 4 sản phẩm
      }
      updateCardWidth();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -cardWidth * totalProductsToShow,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: cardWidth * totalProductsToShow,
      behavior: "smooth",
    });
  };

  return (
    <div className="p-6 relative shadow-2xl bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-black">{title}</h2>
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-2xl pl-2 z-10"
      >
        <FaChevronLeft />
      </button>
      <div className="flex space-x-4 overflow-hidden px-4" ref={scrollRef}>
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex-none"
            style={{
              width: `calc((100% - ${
                16 * (totalProductsToShow - 1)
              }px) / ${totalProductsToShow})`,
            }}
          >
            <ProductItem product={product} isForShow={true} />
          </div>
        ))}
      </div>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-2xl pr-2"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ProductSection;
