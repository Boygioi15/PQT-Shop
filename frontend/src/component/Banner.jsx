import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import useWindowSize from "../utils/useWindowSize";
import { geLisPromotionEvent } from "../config/api";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { height, width } = useWindowSize();
  const navigate = useNavigate();

  const nextSlide = () => {
    if (promotions.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
    }
  };

  const prevSlide = () => {
    if (promotions.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? promotions.length - 1 : prevIndex - 1
      );
    }
  };

  useEffect(() => {
    const handleGetListImgofPromotion = async () => {
      try {
        const response = await geLisPromotionEvent();
        if (response?.metadata) {
          setPromotions(response.metadata);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };
    handleGetListImgofPromotion();
  }, []);

  useEffect(() => {
    let interval;
    if (isAutoPlaying && promotions.length > 1) {
      interval = setInterval(nextSlide, 5000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlaying, promotions.length, currentIndex]);

  const handleClickBanner = (id) => {
    navigate(`/promotion/${id}`);
  };

  return (
    <div className="relative w-full max-w-screen-2xl mx-auto mb-8">
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
        {promotions.map((promotion, index) => (
          <div
            key={promotion._id || index}
            className={`absolute w-full h-full transition-transform duration-700 ease-in-out ${
              index === currentIndex
                ? "translate-x-0 opacity-100"
                : index === (currentIndex + 1) % promotions.length
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
            }`}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <img
              src={promotion.prom_banner}
              onClick={() => handleClickBanner(promotion._id)}
              className="absolute block w-full h-full object-cover object-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 cursor-pointer transition-opacity duration-300 hover:opacity-95"
              alt={`Promotion ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Improved indicators */}
      <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
        {promotions.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-current={currentIndex === index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      {promotions.length > 1 && (
        <>
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 start-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300 focus:outline-none group"
            onClick={prevSlide}
          >
            <FaArrowLeft className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span className="sr-only">Previous</span>
          </button>
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 end-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300 focus:outline-none group"
            onClick={nextSlide}
          >
            <FaArrowRight className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span className="sr-only">Next</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Banner;
