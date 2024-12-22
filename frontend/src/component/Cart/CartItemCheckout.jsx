import { useEffect, useState } from "react";

const CartItemCheckout = ({ cartItem }) => {
  const product = {
    skuId: cartItem.skuId,
    spuId: cartItem.spuId,
    name: cartItem.name,
    imageUrl: cartItem.thumb,
    price: cartItem.priceAfterDiscount,
    discountPrice: cartItem.originalPrice,
    loyalPoint: cartItem.loyalPoint,
    quantity: cartItem.quantity,
  };
  console.log("🚀 ~ product:", product);

  const [quantity, setQuantity] = useState(product.quantity);

  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <div className="col-span-2 flex items-center gap-4">
        <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md border border-gray-300">
          <img
            src={product.imageUrl}
            className="w-full h-full object-contain"
            alt={product.name}
          />
        </div>

        <div className="flex flex-col justify-between">
          <h3 className="lg:text-base md:text-sm text-xs font-bold text-gray-800">
            {product.name}
          </h3>
        </div>
      </div>

      <div className="ml-auto flex flex-col md:flex-row items-center justify-between w-full md:w-auto space-y-4 md:space-y-0 md:space-x-7">
        <div className="flex flex-col items-end">
          <span className="text-base font-bold text-gray-800">
            {product.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>

          {product?.discountPrice && (
            <span className="text-xs text-gray-500 line-through">
              {product.discountPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          )}
        </div>

        <div className="flex items-center pr-2">
          <div className="flex items-center space-x-4 pr-2">
            <span className="text-base font-semibold text-gray-800 w-6 text-center">
              x{quantity}
            </span>
          </div>
          {/* Nút xóa */}
        </div>
      </div>
    </div>
  );
};

export default CartItemCheckout;
