import React from "react";
import { redirect, useNavigate } from "react-router-dom";

import iconStar from "../../assets/iconStar.png";
export default function BriefProductCard({ id, name, brand, price, reviews, rating, imageUrl, isNew, isSale }){
  const navigate = useNavigate();
  const navigateToDetailPage = () => {

  }
  return (
    <div onClick = {()=> {
      navigate(`/product/${id}`)
    }}
    className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden border border-gray-100 bg-white shadow-md">
      <a className="relative flex overflow-hidden" href="#">
        <img
          className="object-cover w-full" // Đảm bảo ảnh có kích thước đầy đủ và vừa vặn
          src={imageUrl}
          alt="product image"
        />
        {/* Hiển thị thẻ "MỚI" nếu isNew là true */}
        {isNew && (
          <span className="absolute top-2 right-1 m-2 bg-maincolor px-[20px] py-[5px] text-center text-sm font-black text-black">
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
            <span className="text-xl font-black italic text-slate-900">
              {price} VNĐ
            </span>
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
                className={`h-5 w-5 ${index < rating ? "text-yellow-300" : "text-gray-300"}`}
              />
            ))}
            <span className="mx-2 px-2 py-1 text-base font-thin text-[#666666]">{reviews} reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}
