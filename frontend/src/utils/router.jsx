export const ROUTERS = {
  USER: {
    HOME: "",
    LOGIN: "/login",
    PRODUCTS: "/products", // Trang danh sách tất cả các sản phẩm
    PRODUCT_DETAIL: (productId = ":productId") => `/products/${productId}`, // Trang chi tiết sản phẩm
    CART: "/cart", // Giỏ hàng
    PROFILE: "/profile",
    ORDER_LIST: "/profile/order-list",
    ORDER_DETAIL: (orderId = ":orderId") =>
      `/profile/order-list/detail/${orderId}`,

    FAVORITES: "/profile/favorites",
    ADDRESS: "/profile/address",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    MANAGE_PRODUCTS: "/admin/products",
    ADD_PRODUCT: "/admin/products/add",
    STOCK: "/admin/stock",
    ORDER: "/admin/order",
    EDIT_PRODUCT: (productId = ":productId") =>
      `/admin/products/edit/${productId}`,
  },
};
