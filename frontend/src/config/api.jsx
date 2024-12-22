import axios from "./axios_custom";

/* Module Auth */
export const callLogin = async (email, password) => {
  return axios.post("/auth/sign-in", { email, password });
};
export const callSignUp = async (email) => {
  return axios.post("/auth/sign-up", { email });
};
export const callLogout = () => {
  return axios.post("/auth/log-out");
};

export const callLoginGG = () => {
  return axios.post("/auth/google");
};

export const callAccount = async () => {
  return axios.get("/auth/account");
};

/*Category*/
export const getAllCategory = async () => {
  return axios.get("/category/all");
};

/*Product*/
export const filterProduct = async ({
  product_status,
  stock_status,
  minPrice,
  maxPrice,
  categorySlug,
  sortBy,
  limit = 10,
  skip = 0,
}) => {
  return axios.get("/product/spu/filter", {
    params: {
      product_status,
      stock_status,
      minPrice,
      maxPrice,
      categorySlug,
      sortBy,
      limit,
      skip,
    },
  });
};

export const getAllProductByCategory = async (categorySlug) => {
  return axios.post("/product/published/all", {
    categorySlug,
  });
};

export const getProduct = async (spu_id) => {
  return axios.get("/product/spu", {
    params: {
      spu_id,
    },
  });
};

export const searchProduct = async ({
  textSearch,
  minPrice,
  maxPrice,
  sortBy,
}) => {
  return axios.get("/full-text-search", {
    params: {
      textSearch,
      minPrice,
      maxPrice,
      sortBy,
    },
  });
};

export const suggestionSearchProduct = async (textSearch) => {
  return axios.get("/full-text-search/autocomplete", {
    params: {
      textSearch,
    },
  });
};

// Cart

export const addToCart = async ({ userId, skuId, quantity = 1 }) => {
  return axios.post("/cart", { userId, skuId, quantity });
};

export const addToCartFromLocal = async ({ userId, carts }) => {
  return axios.post("/cart/add-cart-from-local", { carts, userId });
};

export const deleteItemInCart = async ({ userId, skuId }) => {
  return axios.delete("/cart", {
    data: { userId, skuId }, // Đưa payload vào thuộc tính `data`
  });
};

export const getCartItemList = async (userId) => {
  return axios.get("/cart", {
    params: {
      userId,
    },
  });
};

export const updateQuantity = async ({ userId, item_products }) => {
  return axios.post("/cart/update", { userId, item_products });
};

export const getCart = async ({ userId }) => {
  return axios.post("/cart/get-cart", { userId });
};

export const getShowCartForLocal = async ({ carts }) => {
  return axios.post("/cart/cart-for-local", { carts });
};

//  Checkout
export const getCheckout = async ({
  cartId = "6757bcb643aba0bc50e3e44e",
  userId,
  shop_discount = [],
  products_order = [],
  isUseLoyalPoint,
}) => {
  return axios.post("/checkout/review", {
    cartId,
    userId,
    shop_discount,
    products_order,
    isUseLoyalPoint,
  });
};

// comment

export const getListCommentBySpuId = async ({
  productId,
  parentCommentId = null,
  limit = 50,
  offset = 0,
}) => {
  return axios.get("/comment", {
    params: {
      productId,
      parentCommentId,
      limit,
      offset,
    },
  });
};

export const createComment = async ({
  productId,
  userId,
  content,
  parentCommentId = null,
}) => {
  return axios.post("/comment", {
    productId,
    userId,
    content,
    parentCommentId,
  });
};

export const toggleLikeComment = async (commentId) => {
  return axios.put(`/comment/${commentId}/like`);
};

// flash sale

export const getFlashSaleActive = async () => {
  return axios.get(`/promotion/active-flash-sale`);
};

export const findOnePromotion = async (promotionId) => {
  return axios.get(`/promotion/find-one/${promotionId}`);
};

//voucher
export const getListVoucher = async () => {
  return axios.get(`/discount/find-all`);
};

export const getListVoucherAvailable = async ({ userId, products }) => {
  return axios.post(`/discount/find-all/available`, { userId, products });
};

export const getListVoucherPrivate = async ({ code }) => {
  return axios.post(`/discount/find-all/private`, { code });
};

export const getDiscountAmmountV2 = async (discountId, products) => {
  return axios.post(`/discount/amountV2`, { discountId, products });
};
