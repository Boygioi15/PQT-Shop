import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaCommentAlt,
  FaUsers,
  FaImage,
  FaTags,
  FaBolt,
  FaGift,
  FaCog,
  FaHome,
  FaUser,
} from "react-icons/fa";

export const ROUTERS = {
  USER: {
    HOME: "",
    LOGIN: "/login",
    PRODUCTS: "/products",
    PRODUCT_DETAIL: (productId = ":productId") => `/products/${productId}`,
    CART: "/cart",
    PROFILE: "/profile",
    ORDER_LIST: "/profile/order-list",
    ORDER_DETAIL: (orderId = ":orderId") =>
      `/profile/order-list/detail/${orderId}`,

    CHANGE_PASS: "/profile/change-password",
    ADDRESS: "/profile/address",
  },
  ADMIN: [
    {
      name: "Thống kê doanh số",
      icon: <FaTachometerAlt />,
      path: "/admin/dashboard",
      permission: {
        resourceId: "dashboard",
        action: "read:any",
      },
    },
    {
      name: "Sản phẩm",
      icon: <FaBoxOpen />,
      permission: {
        resourceId: "product",
        action: "read:any",
      },
      links: [
        {
          name: "Nổi bật",
          path: "/admin/top-products",
          permission: {
            resourceId: "product",
            action: "read:any",
          },
        },
        {
          name: "Kho hàng",
          path: "/admin/stock",
          permission: {
            resourceId: "product",
            action: "read:any",
          },
        },
        {
          name: "Danh mục",
          path: "/admin/category",
          permission: {
            resourceId: "category",
            action: "read:any",
          },
        },
      ],
    },
    {
      name: "Đơn hàng",
      icon: <FaShoppingCart />,
      path: "/admin/orders",
      permission: {
        resourceId: "order",
        action: "read:any",
      },
    },
    {
      name: "Đánh giá",
      icon: <FaCommentAlt />,
      path: "/admin/feedback",
      permission: {
        resourceId: "comment",
        action: "read:any",
      },
    },
    {
      name: "Người dùng",
      icon: <FaUsers />,
      path: "/admin/users",
      permission: {
        resourceId: "user",
        action: "read:any",
      },
    },
    {
      name: "Voucher",
      icon: <FaTags />,
      path: "/admin/voucher",
      permission: {
        resourceId: "discount",
        action: "read:any",
      },
    },
    {
      name: "Flash Sale",
      icon: <FaBolt />,
      path: "/admin/flash-sale",
      permission: {
        resourceId: "promotion",
        action: "read:any",
      },
    },
    {
      name: "Sự kiện ưu đãi",
      icon: <FaGift />,
      path: "/admin/event",
      permission: {
        resourceId: "promotion",
        action: "read:any",
      },
    },
    {
      name: "Phân quyền",
      icon: <FaUser />,
      path: "/admin/role-permission",
      permission: {
        resourceId: "rbac",
        action: "read:any",
      },
    },
    {
      name: "Hồ sơ",
      icon: <FaCog />,
      path: "/admin/profile",
    },
  ],
};

export default ROUTERS;
