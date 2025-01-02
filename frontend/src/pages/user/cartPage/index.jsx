import React, { useEffect, useState } from "react";
import { getCartItemList, getShowCartForLocal } from "../../../config/api";
import { useSelector } from "react-redux";
import CartEmpty from "../../../component/Cart/CartEmpty";
import CartItem from "../../../component/Cart/CartItem";
import CheckOut from "../../../component/Cart/CheckOut";
import CheckoutInfo from "../../../component/Cart/CheckoutInfo"; // Import CheckoutInfo
import { IoIosArrowBack } from "react-icons/io";
import PaymentMethod from "../../../component/Cart/PaymentMethod";
import { RiDeleteBin6Line } from "react-icons/ri";
import CartItemCheckout from "../../../component/Cart/CartItemCheckout";
import LoginRequiredModal from "./LoginRequireModal";
import RecommendSectionForCart from "../../../component/RecommendSection/RecomendSectionInCart";

const CartPage = () => {
  const userId = useSelector((state) => state.account?.user?._id);
  const user = useSelector((state) => state.account?.user);

  const [cartItems, setCartItems] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCheckout, setIsCheckout] = useState(false); // Trạng thái thanh toán
  const [error, setError] = useState(null);
  const localCartItems = useSelector((state) => state.cart?.localCartItems);
  const [cartItemSelected, setCartItemsSelected] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  // state for create order
  const [orderAddress, setOrderAddress] = useState("");
  const [orderMethodPayment, setOrderMethodPayment] = useState("");
  const [orderNote, setOrderNote] = useState("");
  //

  useEffect(() => {
    if (isCheckout !== false) {
      return;
    }
    const getShowCart = async () => {
      try {
        setLoading(true);
        const response = userId
          ? await getCartItemList(userId)
          : await getShowCartForLocal({ carts: localCartItems });

        if (response.status === 200) {
          setCartItems(response.metadata);
        } else {
          throw new Error("Failed to fetch cart items");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getShowCart();
  }, [userId, localCartItems, isCheckout]);

  const handleCheckout = (formData) => {
    setIsCheckout(false);
  };
  const handleCheckAll = () => {
    setIsSelectAll((prev) => !prev);
  };
  const handleCheckoutAuth = () => {
    if (userId) {
      setIsCheckout(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="py-4">
      {loading ? (
        <div class="flex items-center justify-center h-[50vh]">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-4 ">
          <div className="md:col-span-2">
            <div className=" p-4 flex justify-between gap-4 bg-white rounded-md font-bold overflow-y-auto">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={isSelectAll} // Đảm bảo trạng thái đồng bộ
                  onChange={() => handleCheckAll()} // Sử dụng callback để thay đổi trạng thái
                  className="w-4 h-4 cursor-pointer"
                />
                Chọn tất cả ({selectedProducts.length}/{cartItems.length})
              </div>
              <button className="text-gray-600 hover:text-red-600">
                <RiDeleteBin6Line className="w-6 h-6" />
              </button>
            </div>

            <div className=" p-4 mt-3 flex flex-col gap-4 bg-white rounded-md overflow-x-auto">
              {isCheckout && (
                <a
                  onClick={() => {
                    setIsCheckout(false);
                  }}
                  className="text-mainColor flex flex-row items-center cursor-pointer"
                >
                  <IoIosArrowBack />
                  Quay lại giỏ hàng
                </a>
              )}
              <div className="space-y-4 ">
                {!isCheckout &&
                  cartItems.map((cartItem) => (
                    <CartItem
                      isSelectAll={isSelectAll}
                      key={cartItem.skuId}
                      cartItem={cartItem}
                      setSelectedProducts={setSelectedProducts}
                      setCartItems={setCartItems}
                      isCheckout={isCheckout}
                      setCartItemsSelected={setCartItemsSelected}
                    />
                  ))}
                {isCheckout &&
                  cartItemSelected.map((cartItem) => (
                    <CartItemCheckout cartItem={cartItem} />
                  ))}
              </div>
            </div>
            {isCheckout && (
              <>
                {userId && (
                  <div className="mt-6">
                    <div className="p-6 bg-white rounded-lg shadow-md">
                      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                        Thông tin người đặt
                      </h2>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            name="phone"
                            disabled
                            value={user?.name}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-500 transition-all"
                            required
                          />
                        </div>
                        {user?.email && (
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Email
                            </label>
                            <input
                              type="text"
                              name="phone"
                              disabled
                              value={user?.email}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-500 transition-all"
                              required
                            />
                          </div>
                        )}
                        {user?.phone && (
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Số điện thoại:
                            </label>
                            <p className="text-base font-medium text-gray-800">
                              {user?.phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 ">
                  <CheckoutInfo
                    onSubmit={handleCheckout} // Xác nhận thanh toán
                    setOrderAddress={setOrderAddress}
                    orderNote={orderNote}
                    setOrderNote={setOrderNote}
                  />
                </div>

                <div className="mt-4 ">
                  <PaymentMethod
                    orderMethodPayment={orderMethodPayment}
                    setOrderMethodPayment={setOrderMethodPayment}
                  />
                </div>
              </>
            )}
          </div>
          <LoginRequiredModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
          {cartItems.length > 0 && (
            <CheckOut
              products_order={cartItemSelected}
              userId={userId}
              onCheckout={() => handleCheckoutAuth()} // Start the checkout proces
              onContinueShopping={() => setIsCheckout(false)} // Go back to the cart
              isCheckout={isCheckout} // Pass the checkout state to toggle button text
              orderMethodPayment={orderMethodPayment}
              orderAddress={orderAddress}
              orderNote={orderNote}
            />
          )}
        </div>
      ) : (
        <CartEmpty />
      )}
      {!isCheckout && userId && cartItems.length > 0 && (
        <div className="py-14">
          <RecommendSectionForCart />
        </div>
      )}
      <div className="py-5"></div>
    </div>
  );
};

export default CartPage;
