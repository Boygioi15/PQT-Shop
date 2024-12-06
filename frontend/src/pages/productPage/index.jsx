import { useState } from "react";
import Rating from "../../reusable-components/Rating";
import ColorCard from "../../reusable-components/ColorCard";
import SizeCard from "../../reusable-components/SizeCard";
import QuantitySelector from "../../reusable-components/QuantitySelector";

const ProductPage = () => {
  const [selectedCapacityIndex, setSelectedCapacityIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const colorOptions = [
    {
      src: "https://s3-alpha-sig.figma.com/img/1716/729e/e5d47c38c8574c4c80068d49fd8dedc2?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TiA8W2VdUT7Iw8ud-83vS~f6X2C5HknEmxPimM95OffS-Wdfe-2CxiNiDchRxDf8gdcmyeAla9y17tPIgwRRmKWveIXU8~8BC3uwW4bDskKBheTGGh6yfFOqJqzYDdN1C7GuURHbUn3Iqm61rNhzuOH4R8nrVIm1rtkt3fs2xo8qDe4Cc9wSbuJaIZk~p6wMH2cixyNcJTTbB~BF0dBABfQwS3kjQqLMPis2zX1FDT9gB~eIIE-j2~19JtXSiUq3AyL8n2SYRh0ZIMIIC9Q4DufIpWiRgzdM9q~9SBNJtjgoXp2~7Xw~WdB72ZpJOXlloQ-gOWLfiuz2JI4IhxXJEw__",
    },
    {
      src: "https://s3-alpha-sig.figma.com/img/1716/729e/e5d47c38c8574c4c80068d49fd8dedc2?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TiA8W2VdUT7Iw8ud-83vS~f6X2C5HknEmxPimM95OffS-Wdfe-2CxiNiDchRxDf8gdcmyeAla9y17tPIgwRRmKWveIXU8~8BC3uwW4bDskKBheTGGh6yfFOqJqzYDdN1C7GuURHbUn3Iqm61rNhzuOH4R8nrVIm1rtkt3fs2xo8qDe4Cc9wSbuJaIZk~p6wMH2cixyNcJTTbB~BF0dBABfQwS3kjQqLMPis2zX1FDT9gB~eIIE-j2~19JtXSiUq3AyL8n2SYRh0ZIMIIC9Q4DufIpWiRgzdM9q~9SBNJtjgoXp2~7Xw~WdB72ZpJOXlloQ-gOWLfiuz2JI4IhxXJEw__",
    },
  ];

  const sizeOptions = [
    {
      label: "39",
    },
    {
      label: "40",
    },
    {
      label: "41",
    },
    {
      label: "42",
    },
    {
      label: "43",
    },
    {
      label: "44",
    },
    {
      label: "45",
    },
  ];

  return (
    <div className="lg:max-w-7xl max-w-4xl">
      <div className="grid items-start grid-cols-1 lg:grid-cols-6 gap-12 p-6 rounded-lg bg-white">
        <div className="lg:col-span-3 w-full h-full top-0 text-center relative ">
          <img
            src="https://s3-alpha-sig.figma.com/img/5fce/f6ca/dc73b3fb8b1261d17c73d55c93a3616e?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=D~9ZhqGhURKUn-6L~IFPSD6DQOQ3DTBulqjhfPWtkh6YwfneFzCFk7AlrmxhtueKeo9Fx0BvNW0F4iQP7dVMi6UGQacyH3~xjVJcYTSKhZkiLyY9ZG0u2DWJt8pLb2mAJU7XMUKmWWk-LDJdVaONS3zRoS9c1jPdo-aNRvap0uDgCeVYDPZLF1r6ESiG3sdIKCGWU0zJGallDuyQBsBdqaa4-iZd~uKX6ytwYY0r6sTIBkgaEUkWri5RxGrVa3XCzur5HVDaevhfzKLJBkz08dDxb0yubR8a0aczzUiuAMbMpn3L6wDVyvWVyw5mgWipK9X1ObYCj04ZrNuehMC-JA__"
            alt="iPhone 16 Pro Max"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-full w-12 h-6 flex items-center justify-start">
            TEVA
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">
            Dép Xỏ Ngón Nam Teva Mush Ii - Đen
          </h2>

          <div className="flex items-center space-x-2 mt-2">
            <span className=" underline">Dép xỏ ngón</span>
            <span className="text-[#666666]">SKU 4168-BKBL</span>
          </div>

          <div>
            <Rating />
          </div>
          <div className="flex items-center ju space-x-2 mt-3 text-[#EB4335] font-extrabold text-2xl">
            560.000<span className=" underline">đ</span>
          </div>
          {/* Dung lượng */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800">Dung lượng</h3>
            <ColorCard
              options={colorOptions}
              selectedIndex={selectedColorIndex}
              onSelectOption={(index) => setSelectedColorIndex(index)}
            />
          </div>

          {/* Màu sắc */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800">Màu sắc</h3>
            <SizeCard
              options={sizeOptions}
              selectedIndex={selectedCapacityIndex}
              onSelectOption={(index) => setSelectedCapacityIndex(index)}
            />
          </div>

          {/* Số lượng */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Số lượng</h3>
            <QuantitySelector
              initialQuantity={quantity}
              onChange={(newQuantity) => setQuantity(newQuantity)}
            />
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <button
              type="button"
              className="min-w-[200px] px-4 py-3 bg-[#6fdd00] hover:bg-[#81cb37] text-xl font-bold rounded-[10px]"
            >
              Mua ngay!
            </button>
            <button
              type="button"
              className="min-w-[200px] px-4 py-2.5 border border-1 border-black bg-transparent hover:bg-[#e8e8e8] text-gray-800 text-base rounded-[10px]"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
