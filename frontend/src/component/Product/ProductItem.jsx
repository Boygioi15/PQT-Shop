import {
  AiOutlineEye,
  AiOutlineHeart,
  AiFillStar,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { FaTruck, FaTag } from "react-icons/fa";
import { useState } from "react";
import { ROUTERS } from "../../utils/router";
import { formatVND } from "../../utils/format";
import { Link } from "react-router-dom";

const ProductItem = ({ product, isForShow }) => {
  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">Product not available</div>
    );
  }

  const { id, imageSrc, link, name, productPrice, rating, tags } = product;

  const [showTooltipFavorites, setShowTooltipFavorites] = useState(false);

  const calculateDiscount = () => {
    const { priceAfterDiscount, originalPrice } = productPrice;
    const discount =
      ((originalPrice - priceAfterDiscount) / originalPrice) * 100;
    return Math.round(discount * 100) / 100;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <AiFillStar key={`full-${i}`} className="text-yellow-400 h-4 w-4" />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative h-4 w-4">
          <AiOutlineStar className="absolute text-yellow-400 h-4 w-4" />
          <div className="absolute overflow-hidden w-[50%]">
            <AiFillStar className="text-yellow-400 h-4 w-4" />
          </div>
        </div>
      );
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <AiOutlineStar key={`empty-${i}`} className="text-gray-300 h-4 w-4" />
      );
    }

    return stars;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm h-full flex flex-col">
      <div className="h-56 w-full">
        <a href={ROUTERS.USER.PRODUCT_DETAIL(id)} className="cursor-default">
          <img
            className="mx-auto h-full transition-transform duration-300 ease-in-out hover:scale-110"
            src={imageSrc}
            alt={name}
          />
        </a>
      </div>
      <div className="pt-6 flex flex-col flex-grow justify-around">
        <div className="text-center">
          <Link
            to={link}
            className="text-lg font-semibold leading-tight text-gray-900 hover:underline cursor-pointer"
          >
            {name}
          </Link>
        </div>

        {/* Rating display */}
        <div className="flex items-center justify-center mt-2 space-x-1">
          {renderStars(rating)}
          <span className="ml-1 text-sm text-gray-500">({rating})</span>
        </div>

        {/* Tags display */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-center">
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
              </p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatVND(productPrice.priceAfterDiscount)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
