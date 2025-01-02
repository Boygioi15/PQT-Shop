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
export const changePassword = async (
  email,
  currentPassword,
  newPassword,
  reNewPassword
) => {
  return axios.patch("/user", {
    email,
    currentPassword,
    newPassword,
    reNewPassword,
  });
};

/*Category*/
export const getAllCategory = async () => {
  return axios.get("/category/all");
};
export const getCategoryById = async (id) => {
  return axios.get(`/category/find-one/${id}`);
};
export const createCategory = async (newCategory) => {
  return axios.post("/category", { ...newCategory });
};
export const deleteCategory = async (id) => {
  return axios.delete(`/category/${id}`);
};
export const updateCategory = async (id, newCategory) => {
  return axios.patch(`/category/${id}`, { ...newCategory });
};

/*Product*/
export const getHomePageProduct = async () => {
  return axios.get("/product/home-page-product");
};
export const filterProduct = async ({
  product_status,
  stock_status,
  minPrice,
  maxPrice,
  categorySlug,
  sortBy,
  limit = 10,
  page = 0,
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
      page,
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
  page,
  limit,
}) => {
  return axios.get("/full-text-search", {
    params: {
      textSearch,
      minPrice,
      maxPrice,
      page,
      limit,
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

//Image
export const getImageLink = async (formData) => {
  try {
    const response = await axios.post("upload/product/thumb", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Đảm bảo content-type là multipart/form-data
      },
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi gửi ảnh:", error);
    throw error;
  }
};

//ProductStock
export const getAllProduct = async ({ limit, page, search }) => {
  return axios.get("/product/spu/get-all", {
    params: {
      search,
      limit,
      page,
    },
  });
};
export const getPublishedProduct = async ({ limit, page }) => {
  return axios.get("/product/spu/get-published", {
    params: {
      limit,
      page,
    },
  });
};
export const getDraftProduct = async ({ limit, page }) => {
  return axios.get("/product/spu/get-draft", {
    params: {
      limit,
      page,
    },
  });
};

export const publishProcduct = async (id) => {
  return axios.get(`/product/publish/${id}`);
};
export const unPublishProcduct = async (id) => {
  return axios.get(`/product/unpublish/${id}`);
};
export const deleteProduct = async (id) => {
  return axios.delete(`/product/spu/delete/${id}`);
};

//ProductAdd
export const creatNewProduct = async (productData) => {
  return axios.post("/product/spu/new", { ...productData });
};
export const editNewProduct = async (productData, id) => {
  return axios.patch(`/product/spu/update/${id}`, { ...productData });
};
//Admin
export const getAdminAllProduct = async (spuIds) => {
  return axios.post("/product/list-detail-product", { spuIds });
};

//Top Product
export const getTopProduct = async () => {
  return axios.get("/product/top-products");
};

//FlashSale
export const creatNewFlashSale = async (flashSaleData) => {
  return axios.post("/promotion", { ...flashSaleData });
};
export const EditFlashSale = async (flashSaleData, promId) => {
  return axios.patch("/promotion", { ...flashSaleData, promId });
};
export const getFlashSale = async (promId) => {
  return axios.get(`/promotion/get-one/${promId}`);
};
export const getListFlashSale = async ({
  eventType,
  status = null,
  page = 1,
  limit = 10,
  dateRange = null,
}) => {
  return axios.get("/promotion/get-list", {
    params: {
      eventType,
      status,
      page,
      limit,
      dateRange,
    },
  });
};
export const toggleFlashSale = async (promId) => {
  return axios.patch(`/promotion/toggle-disable/${promId}`);
};

export const filterProductFlashSale = async (
  startTime,
  endTime,
  categoryId,
  product_name
) => {
  return axios.post("/product/spu/filter-for-promotion", {
    startTime,
    endTime,
    categoryId,
    product_name,
  });
};

export const filterProductForVoucher = async (
  startTime,
  endTime,
  categoryId,
  product_name
) => {
  return axios.post("/product/spu/filter-for-voucher", {
    startTime,
    endTime,
    categoryId,
    product_name,
  });
};

//Voucher
export const createNewVoucher = async (voucherData) => {
  return axios.post("/discount", { ...voucherData });
};
export const editVoucher = async (voucherData, id) => {
  return axios.patch(`/discount/${id}`, { ...voucherData });
};

//Order
export const getAllOrder = async ({
  limit = 10,
  page = 1,
  order_status = null,
}) => {
  return axios.get("/order/get-all-for-admin", {
    params: {
      limit,
      page,
      order_status,
    },
  });
};

export const changeOrderStatus = async (orderId, status) => {
  return axios.post("/order/change-status", { orderId, status });
};

export const checkPurchase = async ({ userId, spuId }) => {
  return axios.post(`/order/check-purchase`, { userId, spuId });
};
// comment

export const getListCommentBySpuId = async ({
  productId,
  parentCommentId = null,
  limit = 10,
  page = 0,
}) => {
  return axios.get("/comment", {
    params: {
      productId,
      parentCommentId,
      limit,
      page,
    },
  });
};

export const createComment = async ({
  productId,
  userId,
  content,
  rating = 0,
  parentCommentId = null,
}) => {
  return axios.post("/comment", {
    productId,
    userId,
    content,
    rating,
    parentCommentId,
  });
};

export const toggleLikeComment = async (commentId) => {
  return axios.put(`/comment/${commentId}/like`);
};

export const checkExistCommentofPurchaser = async ({ userId, productId }) => {
  return axios.post(`/comment/check-has-purchased`, { userId, productId });
};

export const ratingCount = async ({ productId }) => {
  return axios.get(`/comment/rating-count/${productId}`);
};

export const totalRatingRateComment = async ({ productId }) => {
  return axios.get(`/comment/total-rating-comment/${productId}`);
};
export const getCommentWithRating = async ({ productId }) => {
  return axios.get(`/comment/with-rating/${productId}`);
};
// flash sale

export const getFlashSaleActive = async () => {
  return axios.get(`/promotion/active-flash-sale`);
};

export const findOnePromotion = async (promotionId) => {
  return axios.get(`/promotion/find-one/${promotionId}`);
};

// promotion event

export const getOneNearestPromotionEvent = async () => {
  return axios.get(`/promotion/get-event`);
};

export const getPromotionById = async (id) => {
  return axios.get(`/promotion/get-event/${id}`);
};

export const geLisPromotionEvent = async () => {
  return axios.get(`/promotion/get-events`);
};

//voucher
export const getListVoucher = async ({ page, limit }) => {
  return axios.get(`/discount/find-all`, {
    params: {
      page,
      limit,
    },
  });
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

// order
export const createOrder = async ({
  cartId,
  userId,
  products_order,
  shop_discount,
  user_payment,
  user_address,
  payment_method,
  isUseLoyalPoint,
  orderNote,
}) => {
  return axios.post(`/order`, {
    cartId,
    userId,
    products_order,
    user_payment,
    user_address,
    payment_method,
    shop_discount,
    isUseLoyalPoint,
    orderNote,
  });
};

export const getListOrder = async ({ userId, status }) => {
  return axios.post(`/order/find-all/${userId}`, {
    params: {
      status,
    },
  });
};

export const getOneOrder = async ({ orderId }) => {
  return axios.get(`/order/${orderId}`);
};

export const cancelOrder = async ({ orderId }) => {
  return axios.delete(`/order/${orderId}`);
};
export const getOneOrderForAdmin = async ({ orderId }) => {
  return axios.get(`/order/get-one-for-admin/${orderId}`);
};
export const getCountOrderStatus = async () => {
  return axios.get("/order/count-order");
};

//address
export const addNewUserAddress = async ({ id, address }) => {
  return axios.post(`/user/address`, { id, address });
};

export const getListUserAddress = async ({ id }) => {
  return axios.get(`/user/address/${id}`);
};

export const getUserDefaultAddress = async ({ id }) => {
  return axios.get(`/user/default/address/${id}`);
};

export const updateProfile = async ({
  usr_name,
  usr_phone,
  usr_email,
  usr_img,
  usr_sex,
  usr_date_of_birth,
}) => {
  return axios.put(`/user/profile`, {
    usr_name,
    usr_phone,
    usr_email,
    usr_img,
    usr_sex,
    usr_date_of_birth,
  });
};

// role permission
export const getAllReources = async () => {
  return axios.get(`/rbac/resources`);
};

export const getAllRole = async () => {
  return axios.get(`/rbac/list/roles-for-admin`);
};

export const createRole = async ({
  name,
  slug = null,
  description,
  grants = [],
}) => {
  return axios.post(`/rbac/role`, { name, slug, description, grants });
};

export const updateRole = async ({
  id,
  name = null,
  slug = null,
  description = null,
  grants,
}) => {
  return axios.patch(`/rbac/role`, { id, name, slug, description, grants });
};
export const changeRole = async (userId, roleId) => {
  return axios.post(`/user/change-role`, { userId, roleId });
};

//User
export const getAllUsers = async (query = {}) => {
  return axios.get(`/user/find-all`, { params: query });
};
export const getListRole = async () => {
  return axios.get("/rbac/list/roles");
};
export const lockUser = async (userId, status) => {
  return axios.post("/user/change-status", { userId, status });
};

//recommentd
export const getRecommendForDetailProductPage = async ({ productId }) => {
  return axios.get(`/product/recommendations/detail-product/${productId}`);
};

export const getRecommendTrending = async () => {
  return axios.get(`/product/recommendations/trending`);
};

export const getRecommendForHomePage = async () => {
  return axios.get(`/product/recommendations/home-page`);
};

export const getRecommendForCartPage = async () => {
  return axios.get(`/product/recommendations/cart`);
};

export const getRecommendForProfilePage = async () => {
  return axios.get(`/product/recommendations/profile`);
};

export const getStatisticPromotion = async (promotionId) => {
  return axios.get(`/promotion/statictis/${promotionId}`);
};

export const getUserRole = async () => {
  return axios.get(`/user/role`);
};

export const deleteRole = async (id) => {
  return axios.delete(`rbac/role/${id}`);
};

export const getOrderStatistic = async (timeRange) => {
  return axios.get(`order/statistic/value`, {
    params: { timeRange },
  });
};

export const getUserStatistic = async () => {
  return axios.get(`/user/statistic`);
};
