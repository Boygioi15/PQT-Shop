import { formatVND } from "../../utils";

const FlashSaleItem = ({ product, isUpcoming }) => {
  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">
        Sản phẩm không khả dụng
      </div>
    );
  }

  const calculateDiscount = () => {
    const { priceAfterDiscount, originalPrice } = product.product_price;
    const discount =
      ((originalPrice - priceAfterDiscount) / originalPrice) * 100;
    return Math.round(discount * 100) / 100;
  };

  return (
    <div className="rounded-lg border border-red-300 bg-white p-2 shadow-lg relative">
      <div className="h-56 flex flex-col items-center justify-center border border-[#a81f25] rounded-md p-2">
        <img className="max-h-40" src={product.product_thumb} />
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mt-2">
          {product?.product_name || ""}
        </h3>
      </div>
      <div className="pt-4 flex-grow">
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center justify-center bg-red-500 text-white w-full px-4 rounded-full">
            <span className="mr-2">🔥</span>
            <span className="font-medium">
              Đã bán {product.totalAppliedQuantity}/{product.totalQuantityLimit}{" "}
              suất
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 items-center">
          {product.product_price.originalPrice !==
            product.product_price.priceAfterDiscount && (
            <div className="mt-4 text-center">
              <p className="text-lg font-bold text-red-600 mb-2">
                {formatVND(product.product_price.priceAfterDiscount)}
              </p>
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <p className="line-through">
                  {formatVND(product.product_price.originalPrice)}
                </p>
                <p className="font-medium text-[#c0792c] bg-[#fce68b]">
                  {calculateDiscount()}%
                </p>
              </div>
            </div>
          )}

          {product.product_price.originalPrice ===
            product.product_price.priceAfterDiscount && (
            <p className="text-2xl font-bold text-gray-900 mt-4">
              {formatVND(product.product_price.priceAfterDiscount)}
            </p>
          )}

          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center w-full h-fit rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            {isUpcoming ? "Sắp diễn ra" : "Đang diễn ra"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleItem;
