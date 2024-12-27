import { useState, useEffect } from "react";
import { formatVND } from "../../utils";
import { FaBitcoin } from "react-icons/fa";
import RecommendSectionForDetailPage from "../RecommendSection/RecommendSectionDetailProruct";

const FlashSaleBanner = ({
  promotion,
  originalPrice,
  priceAfterDiscount,
  points,
}) => {
  const { startTime, endTime } = promotion;
  const [remainingTime, setRemainingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const getVNTime = () => {
    return new Date().getTime() + 7 * 60 * 60 * 1000;
  };

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = getVNTime();
      const end = new Date(endTime).getTime();
      const timeLeft = end - now;

      if (timeLeft <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setRemainingTime(calculateTimeRemaining());

    const timer = setInterval(() => {
      const timeLeft = calculateTimeRemaining();
      setRemainingTime(timeLeft);

      if (
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
      ) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  // Check if sale has started using VN time
  const now = getVNTime();
  const start = new Date(startTime).getTime();
  const saleStarted = now >= start;

  if (!saleStarted) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Flash Sale Banner */}
      <div className="bg-[#F15A24] text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">F⚡ASH SALE</span>
        </div>
        <div className="flex items-center gap-2">
          <span>KẾT THÚC TRONG</span>
          <div className="flex gap-1">
            <span className="bg-black px-2 py-1 rounded">
              {String(remainingTime.hours).padStart(2, "0")}
            </span>
            <span className="bg-black px-2 py-1 rounded">
              {String(remainingTime.minutes).padStart(2, "0")}
            </span>
            <span className="bg-black px-2 py-1 rounded">
              {String(remainingTime.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-[#FFF1F0] p-3">
        <div className="flex items-center gap-2">
          <span className="text-[#E31837] text-2xl font-bold">
            {formatVND(priceAfterDiscount)}
          </span>
          <span className="line-through text-gray-500">
            {formatVND(originalPrice)}
          </span>
        </div>
        <div className="flex items-center justify-start mt-2 bg-[#fffbe5] rounded-full px-3 py-2 w-max">
          <FaBitcoin />
          <span className="ml-1 text-sm font-bold text-gray-600">
            +{points} Điểm thưởng
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
