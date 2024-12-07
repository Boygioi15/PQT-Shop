import { useEffect, useState } from "react";
import Rating from "../../reusable-components/Rating";
import ColorCard from "../../reusable-components/ColorCard";
import SizeCard from "../../reusable-components/SizeCard";
import QuantitySelector from "../../reusable-components/QuantitySelector";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  getPriceAndSku,
  getSizeAndColorOptions,
  transformProductData,
} from "../../utils";

const ProductPage = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  const [selectedCapacityIndex, setSelectedCapacityIndex] = useState(
    sizeOptions[0]?.label
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState(
    colorOptions[0]?.label
  );

  console.log("🚀 ~ ProductPage ~   colorOptions[0]:", colorOptions[0]);
  const [product, setProduct] = useState({});
  const [price, setPrice] = useState();
  const [sku, setSku] = useState(1);
  const [variation, setVariation] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/product/fetch/${productId}`
      );
      setProduct(response.data);
      setVariation(transformProductData(response.data));
      const colorAndSize = getSizeAndColorOptions(response.data);
      setColorOptions(colorAndSize.colorOptions);
      setSizeOptions(colorAndSize.sizeOptions);
    };
    fetchProduct();
  }, []);

  useEffect(() => {}, [selectedCapacityIndex, selectedColorIndex, variation]);
  return (
    <div className="lg:max-w-7xl max-w-4xl">
      <div className="grid items-start grid-cols-1 lg:grid-cols-6 gap-12 p-6 rounded-lg bg-white">
        <div className="lg:col-span-3 w-full h-full top-0 text-center relative ">
          <img
            src={product.init_ThumnbnailURL}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-full w-12 h-6 flex items-center justify-start">
            TEVA
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">
            {product.name}
          </h2>

          <div className="flex items-center space-x-2 mt-2">
            <span className=" underline">{product.name}</span>
            <span className="text-[#666666]">{sku}</span>
          </div>

          <div>
            <Rating />
          </div>
          <div className="flex items-center ju space-x-2 mt-3 text-[#EB4335] font-extrabold text-2xl">
            {product.price}
            <span className=" underline">đ</span>
          </div>
          {/* Dung lượng */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800">Color</h3>
            {/* <ColorCard
              options={colorOptions}
              selectedIndex={selectedColorIndex}
              onSelectOption={(index) => setSelectedColorIndex(index)}
            /> */}
            <SizeCard
              options={colorOptions}
              selectedIndex={selectedColorIndex}
              onSelectOption={(index) => setSelectedColorIndex(index)}
            />
          </div>

          {/* Màu sắc */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800">Size</h3>
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
