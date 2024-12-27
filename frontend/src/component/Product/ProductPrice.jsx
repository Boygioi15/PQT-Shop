import { useEffect, useState } from "react";
import { FaBitcoin } from "react-icons/fa";
import { formatVND } from "../../utils";
import { findOnePromotion } from "../../config/api";
import FlashSaleBanner from "../DetailPage/FlashSaleBanner";
const ProductPrice = ({
  originalPrice,
  priceAfterDiscount,
  points,
  promotionId = null,
}) => {
  const [promotion, setPromotion] = useState(null);
  console.log("🚀 ~ promotion:", promotion);

  const calculateDiscount = () => {
    const discount =
      ((originalPrice - priceAfterDiscount) / originalPrice) * 100;
    return Math.round(discount * 100) / 100;
  };

  const getPromotion = async () => {
    if (promotionId && promotionId !== "") {
      try {
        const response = await findOnePromotion(promotionId);
        console.log("🚀 ~ getPromotion ~ response:", response);
        if (response.metadata.eventType === "Custom") return;
        setPromotion(response.metadata);
      } catch (error) {
        console.error("Error fetching promotion:", error);
        setPromotion(null);
      }
    } else {
      setPromotion(null);
    }
  };

  useEffect(() => {
    getPromotion();
  }, [promotionId]);

  return (
    <>
      {promotion !== null ? (
        <FlashSaleBanner
          promotion={promotion}
          originalPrice={originalPrice}
          priceAfterDiscount={priceAfterDiscount}
          points={points}
        />
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
          <div className="flex items-center">
            {/* Price Section */}
            <div className="flex flex-col mr-4">
              <div className="grid grid-cols-3 justify-center">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    Mua ngay với giá
                  </span>
                  <span className="text-2xl font-bold text-gray-800">
                    {formatVND(priceAfterDiscount)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 line-through">
                      {formatVND(originalPrice)}
                    </span>
                    <span className="text-sm text-red-600 ml-2">
                      {calculateDiscount()}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-start mt-2 bg-[#fffbe5] rounded-full px-3 py-2 w-max">
                <FaBitcoin />
                <span className="ml-1 text-sm font-bold text-gray-600">
                  +{points} Điểm thưởng
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPrice;
