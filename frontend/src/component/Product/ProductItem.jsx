import {
  AiOutlineEye,
  AiOutlineHeart,
  AiFillStar,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaTruck, FaTag } from "react-icons/fa";
import { useState } from "react";
import { ROUTERS } from "../../utils/router"; // Đảm bảo đường dẫn đúng
import { formatVND } from "../../utils/format";
import { Link } from "react-router-dom";

const ProductItem = ({ product, isForShow }) => {
  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">Product not available</div>
    );
  }

  const { id, imageSrc, link, name, productPrice } = product;

  const [showTooltipFavorites, setShowTooltipFavorites] = useState(false);

  const calculateDiscount = () => {
    const { priceAfterDiscount, originalPrice } = productPrice;
    const discount =
      ((originalPrice - priceAfterDiscount) / originalPrice) * 100;
    return Math.round(discount * 100) / 100;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm relative flex flex-col">
      <div className="h-56 w-full">
        <a href={ROUTERS.USER.PRODUCT_DETAIL(id)} className="cursor-default">
          <img
            className="mx-auto h-full transition-transform duration-300 ease-in-out hover:scale-110"
            src={imageSrc}
            alt={name}
          />
        </a>
      </div>
      <div className="pt-6 flex-grow">
        {/* Sử dụng thẻ <a> với href để điều hướng, thêm điều kiện không cho bấm link khi isEdit */}
        <Link
          to={link}
          className="text-lg font-semibold leading-tight text-gray-900 hover:underline cursor-pointer"
        >
          {name}
        </Link>

        <div className="mt-2 flex items-center gap-2">
          {/* Star Rating */}
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <AiFillStar key={index} className="h-4 w-4 text-yellow-400" />
            ))}
          </div>
        </div>

        <ul className="mt-2 flex items-center gap-4">
          <li className="flex items-center gap-2">
            <FaTruck className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-500">Fast Delivery</p>
          </li>
          <li className="flex items-center gap-2">
            <FaTag className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-500">Best Price</p>
          </li>
        </ul>

        {/* Điều kiện để hiển thị giá và nút "Add to cart" hay nút "Edit" */}
        {productPrice.originalPrice !== productPrice.priceAfterDiscount ? (
          <div className="mt-5">
            <p className="text-sm text-slate-900">
              <span className="line-through">
                {formatVND(productPrice.originalPrice)}
              </span>
              <span className="font-light underline">đ</span>{" "}
              <span className="text-red-600">-{calculateDiscount()}%</span>
            </p>
            <p className="text-2xl font-bold mt-2 text-slate-900">
              {formatVND(productPrice.priceAfterDiscount)}
              <span className="text-xl font-bold text-slate-900 underline"></span>
            </p>
          </div>
        ) : (
          <div className="">
            <p className="text-sm text-slate-900"></p>
            <p className="text-2xl font-bold text-slate-900">
              {formatVND(productPrice.priceAfterDiscount)}
              <span className="text-xl font-bold text-slate-900 underline"></span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
