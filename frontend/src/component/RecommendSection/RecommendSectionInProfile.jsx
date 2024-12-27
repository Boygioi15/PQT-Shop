import { useRef, useEffect, useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductItem from "../Product/ProductItem";
import { getRecommendForProfilePage } from "../../config/api";

const RecommendSectionForProfile = ({ title = "Có thể bạn sẽ thích" }) => {
  const scrollRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const [listProduct, setListProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getRecommendForProfilePage();
        if (response.status === 200) {
          const productsMap = response.metadata.map((product) => ({
            id: product._id,
            imageSrc: product.product_thumb,
            link: `/products/${product.product_slug}`,
            name: product.product_name,
            productPrice: {
              originalPrice: product.product_price.originalPrice,
              priceAfterDiscount: product.product_price.priceAfterDiscount,
              discount: product.product_price.discount,
            },
          }));
          setListProduct(productsMap);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle responsive layout
  useEffect(() => {
    const updateLayout = () => {
      if (scrollRef.current?.firstChild) {
        setCardWidth(scrollRef.current.firstChild.offsetWidth + 16);
      }

      const width = window.innerWidth;
      if (width < 640) setVisibleProducts(1);
      else if (width < 800) setVisibleProducts(2);
      else if (width < 1180) setVisibleProducts(3);
      else setVisibleProducts(4);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Calculate card width style
  const cardStyle = useMemo(
    () => ({
      width: `calc((100% - ${
        16 * (visibleProducts - 1)
      }px) / ${visibleProducts})`,
    }),
    [visibleProducts]
  );

  // Scroll handlers
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: cardWidth * visibleProducts * direction,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6 bg-white rounded-lg">Loading...</div>;
  }

  if (listProduct.length === 0) {
    return null;
  }

  return (
    <div className="p-6 relative shadow-2xl bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-black">{title}</h2>

      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-2xl 
                   hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Scroll left"
      >
        <FaChevronLeft />
      </button>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-hidden scroll-smooth px-4"
      >
        {listProduct.map((product) => (
          <div
            key={product.id}
            className="flex-none transition-transform"
            style={cardStyle}
          >
            <ProductItem product={product} isForShow={true} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-2xl 
                   hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Scroll right"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default RecommendSectionForProfile;
