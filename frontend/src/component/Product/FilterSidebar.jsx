import { useRef, useState } from "react";

const FilterSidebar = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => {
  const trackRef = useRef(null);

  const MIN = 0;
  const MAX = 50000000;

  // Add a state to track which checkbox is selected
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  const getPercentageFromPosition = (positionX) => {
    if (trackRef.current) {
      const { left, width } = trackRef.current.getBoundingClientRect();
      const clampedX = Math.max(left, Math.min(positionX, left + width));
      return ((clampedX - left) / width) * (MAX - MIN) + MIN;
    }
    return MIN;
  };

  const handleThumbMove = (e, thumb) => {
    const positionX = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;
    const newValue = getPercentageFromPosition(positionX);

    if (thumb === "min") {
      if (newValue < maxPrice && newValue >= MIN) {
        setMinPrice(newValue);
      }
    } else {
      if (newValue > minPrice && newValue <= MAX) {
        setMaxPrice(newValue);
      }
    }
  };

  const handleThumbStart = (e, thumb) => {
    e.preventDefault();
    const moveEvent = e.type.includes("mouse") ? "mousemove" : "touchmove";
    const endEvent = e.type.includes("mouse") ? "mouseup" : "touchend";

    const onMove = (moveEvent) => handleThumbMove(moveEvent, thumb);
    const onEnd = () => {
      document.removeEventListener(moveEvent, onMove);
      document.removeEventListener(endEvent, onEnd);
    };

    document.addEventListener(moveEvent, onMove);
    document.addEventListener(endEvent, onEnd);
  };

  // Hàm xử lý khi chọn checkbox "Tất cả"
  const handleOnClick1 = () => {
    setMinPrice(MIN); // Reset minPrice
    setMaxPrice(MAX); // Reset maxPrice
    setSelectedPriceRange(null); // Deselect all checkboxes
  };

  // Hàm xử lý khi chọn các khoảng giá cụ thể
  const handleOnClick2 = (range) => {
    setSelectedPriceRange(range); // Set the selected price range

    switch (range) {
      case "20-25":
        setMinPrice(20000000);
        setMaxPrice(25000000);
        break;
      case "25-30":
        setMinPrice(25000000);
        setMaxPrice(30000000);
        break;
      case "above-30":
        setMinPrice(30000000);
        setMaxPrice(MAX);
        break;
      default:
        break;
    }
  };

  return (
    <aside className="hidden lg:block w-1/4 p-4 rounded-lg shadow-md bg-white sticky top-16 h-max">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Bộ lọc tìm kiếm
      </h3>
      <div className="space-y-6">
        {/* Price Filter */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Mức giá</h4>
          <div className="flex flex-col space-y-1 mb-4">
            <label onClick={handleOnClick1}>
              <input
                type="checkbox"
                checked={selectedPriceRange === null}
                className="mr-2"
              />
              Tất cả
            </label>
            <label onClick={() => handleOnClick2("20-25")}>
              <input
                type="checkbox"
                checked={selectedPriceRange === "20-25"}
                className="mr-2"
              />
              Từ 20 - 25 triệu
            </label>
            <label onClick={() => handleOnClick2("25-30")}>
              <input
                type="checkbox"
                checked={selectedPriceRange === "25-30"}
                className="mr-2"
              />
              Từ 25 - 30 triệu
            </label>
            <label onClick={() => handleOnClick2("above-30")}>
              <input
                type="checkbox"
                checked={selectedPriceRange === "above-30"}
                className="mr-2"
              />
              Trên 30 triệu
            </label>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Hoặc nhập khoảng giá phù hợp với bạn:
          </p>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={`${Math.round(minPrice).toLocaleString()}đ`}
              readOnly
              className="w-1/2 border rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <span>~</span>
            <input
              type="text"
              value={`${Math.round(maxPrice).toLocaleString()}đ`}
              readOnly
              className="w-1/2 border rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div
            ref={trackRef}
            className="relative w-full h-2 mt-6 bg-gray-300 rounded"
          >
            <div
              className="absolute h-2 bg-blue-500 rounded"
              style={{
                left: `${((minPrice - MIN) / (MAX - MIN)) * 100}%`,
                right: `${100 - ((maxPrice - MIN) / (MAX - MIN)) * 100}%`,
              }}
            ></div>

            {/* Thumb Min */}
            <div
              className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((minPrice - MIN) / (MAX - MIN)) * 100}%`,
                top: "50%",
              }}
              onMouseDown={(e) => handleThumbStart(e, "min")}
              onTouchStart={(e) => handleThumbStart(e, "min")}
            ></div>

            {/* Thumb Max */}
            <div
              className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((maxPrice - MIN) / (MAX - MIN)) * 100}%`,
                top: "50%",
              }}
              onMouseDown={(e) => handleThumbStart(e, "max")}
              onTouchStart={(e) => handleThumbStart(e, "max")}
            ></div>
          </div>
        </div>

        {/* Other Filters */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Tính năng đặc biệt
          </h4>
          <div className="flex flex-col space-y-1">
            <label>
              <input type="checkbox" className="mr-2" />
              Sạc không dây
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
