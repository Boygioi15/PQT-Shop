import { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductItem from "../Product/ProductItem";
import { getRecommendForCartPage } from "../../config/api";

const RecommendSectionForCart = ({ title = "Sản phẩm liên quan" }) => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [totalProductsToShow, setTotalProductsToShow] = useState(4);
  const [listProduct, setListProduct] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const handleGetLsitProduct = async () => {
      const response = await getRecommendForCartPage();
      if (response.status === 200) {
        const productsMap = response.metadata.map((product) => ({
          id: product._id,
          imageSrc: product.product_thumb,
          link: `/products/${product?.product_slug}`,
          name: product.product_name,
          productPrice: {
            originalPrice: product.product_price.originalPrice,
            priceAfterDiscount: product.product_price.priceAfterDiscount,
            discount: product.product_price.discount,
          },
          rating: product?.product_ratingAverage,
          tags: product?.product_tags,
        }));
        setListProduct(productsMap);
      }
    };
    handleGetLsitProduct();
  }, []);

  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const gap = 16; // space-x-4 = 16px
        const calculatedWidth =
          (containerWidth - gap * (totalProductsToShow - 1)) /
          totalProductsToShow;
        setCardWidth(calculatedWidth);
      }
    };

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setTotalProductsToShow(1);
      } else if (window.innerWidth < 800) {
        setTotalProductsToShow(2);
      } else if (window.innerWidth < 1180) {
        setTotalProductsToShow(3);
      } else {
        setTotalProductsToShow(4);
      }
    };

    handleResize();
    updateCardWidth();

    window.addEventListener("resize", () => {
      handleResize();
      updateCardWidth();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [totalProductsToShow]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => scrollElement.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount =
        cardWidth * totalProductsToShow + 16 * totalProductsToShow; // Add gap
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount =
        cardWidth * totalProductsToShow + 16 * totalProductsToShow; // Add gap
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">{title}</h2>

      <div className="flex items-center">
        <button
          onClick={scrollLeft}
          className={`flex-none p-2 mr-2 transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-100"
          }`}
        >
          <FaChevronLeft className="text-2xl" />
        </button>

        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div ref={containerRef} className="flex space-x-4">
            {listProduct.map((product, index) => (
              <div
                key={index}
                className="flex-none"
                style={{ width: `${cardWidth}px` }}
              >
                <ProductItem product={product} isForShow={true} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollRight}
          className={`flex-none p-2 ml-2 transition-opacity duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-100"
          }`}
        >
          <FaChevronRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default RecommendSectionForCart;
