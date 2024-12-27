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
} from "react-icons/fa"; // Các biểu tượng đã cập nhật
import { IoIosPaper } from "react-icons/io";

export const ROUTERS = {
  USER: {
    HOME: "",
    LOGIN: "/login",
    PRODUCTS: "/products", // Trang danh sách tất cả các sản phẩm
    PRODUCT_DETAIL: (productId = ":productId") => `/products/${productId}`, // Trang chi tiết sản phẩm
    CART: "/cart", // Giỏ hàng
    PROFILE: "/profile", // Hồ sơ người dùng
    ORDER_LIST: "/profile/order-list", // Danh sách đơn hàng
    ORDER_DETAIL: (orderId = ":orderId") =>
      `/profile/order-list/detail/${orderId}`, // Chi tiết đơn hàng

    CHANGE_PASS: "/profile/change-password", // Sản phẩm yêu thích
    ADDRESS: "/profile/address", // Địa chỉ giao hàng
  },
  ADMIN: [
    {
      name: "Thống kê doanh số",
      icon: <FaTachometerAlt />,
      path: "/admin/dashboard",
    },
    {
      name: "Sản phẩm",
      icon: <FaBoxOpen />,
      links: [
        { name: "Nổi bật", path: "/admin/top-products" },
        { name: "Kho hàng", path: "/admin/stock" },
        { name: "Danh mục", path: "/admin/category" },
        { name: "Thêm sản phẩm mới", path: "/admin/products/add" },
      ],
    },
    {
      name: "Đơn hàng",
      icon: <FaShoppingCart />,
      path: "/admin/orders",
    },
    {
      name: "Đánh giá",
      icon: <FaCommentAlt />,
      path: "/admin/feedback",
    },
    {
      name: "Người dùng",
      icon: <FaUsers />,
      path: "/admin/users",
    },
    {
      name: "Banners",
      icon: <FaImage />,
      path: "/admin/banners",
    },
    {
      name: "Voucher",
      icon: <FaTags />,
      path: "/admin/voucher",
    },
    {
      name: "Flash Sale",
      icon: <FaBolt />,
      path: "/admin/flash-sale",
    },
    {
      name: "Sự kiện ưu đãi",
      icon: <FaGift />,
      path: "/admin/event",
    },
    {
      name: "Phân quyền",
      icon: <FaUser />,
      path: "/admin/role-permission",
    },
    {
      name: "Trang quản trị",
      icon: <IoIosPaper />,
      links: [
        { name: "Đăng nhập", path: "/admin/login" },
        { name: "Trang 404", path: "/admin/404" },
      ],
    },
    {
      name: "Hồ sơ",
      icon: <FaCog />,
      path: "/admin/profile",
    },
  ],
};

export default ROUTERS;
