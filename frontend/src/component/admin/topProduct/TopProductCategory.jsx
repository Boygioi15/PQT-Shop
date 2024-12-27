import React from "react";
import { AiOutlineEllipsis } from "react-icons/ai";

const TopProductCategory = ({ category, products }) => {
  return (
    <div className="mb-6">
      {/* Category Header */}
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-lg ${
              category.iconBackground || "bg-blue-500"
            }`}
          >
            <span className="text-white">{category.icon}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800">{category.name}</h2>
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col"
          >
            {/* Product Image */}
            <div className="relative mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-contain rounded-lg"
              />
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                <AiOutlineEllipsis />
              </button>
            </div>

            {/* Product Details */}
            <h3 className="text-sm font-bold text-gray-800 mb-2">{product.name}</h3>
            <div className="flex items-center text-yellow-500 text-sm mb-2">
              {"⭐".repeat(product.rating)}
              {"☆".repeat(5 - product.rating)}
            </div>
            <p className="text-sm text-green-600">
              Available: {product.available}
            </p>
            <p className="text-sm text-blue-600">
              Already sold: {product.sold}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductCategory;
