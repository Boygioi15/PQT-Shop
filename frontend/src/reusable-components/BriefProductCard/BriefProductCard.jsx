import React, { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";

import iconStar from "../../assets/iconStar.png";
export default function BriefProductCard({
  id,
  name,
  brand,
  price,
  reviews,
  rating,
  imageUrl,
  imageUrlHover,
  isNew,
  isSale,
}) {
  const navigate = useNavigate();
  const navigateToDetailPage = () => {};
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const handleMouseEnter = () => {
    if (imageUrlHover) {
      setCurrentImage(imageUrlHover);
    }
  };
  const handleMouseLeave = () => {
    setCurrentImage(imageUrl);
  };
  return (
    <div
      onClick={() => {
        navigate(`/product/${id}`);
      }}
      className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden border border-gray-100 bg-white shadow-md"
    >
      <a
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex overflow-hidden"
        href="#"
      >
        <img
          className="object-cover w-full"
          src={currentImage}
          alt="product image"
          key={currentImage}
        />
        {/* Hiển thị thẻ "MỚI" nếu isNew là true */}
        {isNew && (
          <span className="absolute top-[20px] right-[20px] m-2 bg-maincolor px-[20px] py-[5px] text-center text-sm font-black text-black">
            MỚI
          </span>
        )}
      </a>
      <div className="mt-4 px-2 flex flex-col">
        <a href="#">
          <h1 className="text-xl text-black">{name}</h1>
          <h2 className="text-xl text-gray-600 mt-1">{brand}</h2>
        </a>
        <div className="mt-2">
          <p>
            <span>{price} </span>
          </p>
        </div>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <div className="flex items-center">
            {/* Vòng lặp sao */}
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src={iconStar}
                alt={`star-${index}`}
                className={`h-5 w-5 ${
                  index < rating ? "text-yellow-300" : "text-gray-300"
                }`}
              />
            ))}
            <span className="mx-2 px-2 py-1 text-base font-thin text-[#666666]">
              {reviews} reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
