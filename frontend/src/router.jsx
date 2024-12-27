import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccount } from "./redux/slice/accountSlice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Layouts
import MasterLayout from "./layout/userLayout";
import AdminLayout from "./layout/adminLayout";

// Pages
import HomePage from "./pages/user/homePage";
import LoginPage from "./pages/user/loginPage";
import ProductPage from "./pages/user/productPage";
import DetailProduct from "./pages/user/detailProduct";
import CartPage from "./pages/user/cartPage";
import ProfilePage from "./pages/user/profilePage";

// Admin Pages (commented out, can be added later)
import DashBoard from "./pages/admin/dashBoard";

import OrderHistory from "./component/Profile/OrderList"; // Thêm trang OrderHistory
import { ROUTERS } from "./utils/router";
import Info from "./component/Profile/Info";
import Favorites from "./component/Profile/ChangePass";
import Address from "./component/Profile/Address";
import SearchPage from "./pages/user/searchPage";
import AddProductPage from "./pages/admin/addProductPage";
import StockPage from "./pages/admin/stockPage";
import FlashSalePage from "./pages/admin/flashSalePage";
import FlashSaleCreate from "./pages/admin/flashSaleCreate";
import EventPage from "./pages/admin/eventPage";
import EventCreate from "./pages/admin/eventCreate";
import VoucherPage from "./pages/admin/voucherPage";
import VoucherCreate from "./pages/admin/voucherCreate";
import OrderPage from "./pages/admin/orderPage";
import FeedBackPage from "./pages/admin/feedBackPage";
import OrderDetails from "./component/Profile/OrderDetails";
import OrderSuccess from "./pages/user/order/OrderSuccess";
import OrderFailed from "./pages/user/order/OrderFailed";
import OrderDetailPage from "./pages/admin/orderDetailPage";
import PromotionPage from "./pages/user/eventPage";
import AccessDenied from "./pages/Other/AccessDenyPage";
import NotFound from "./pages/Other/NotFound";
import RolePermission from "./pages/admin/rolePermission";
import CustomerPage from "./pages/admin/userPage";
import UserPage from "./pages/admin/userPage";
import CategoryCreate from "./pages/admin/categoryCreate";
import CategoryPage from "./pages/admin/categoryPage";
import AdminProfilePage from "./pages/admin/adminProfilePage";
import TopProductPage from "./pages/admin/topProductPage";
import ChangePass from "./component/Profile/ChangePass";

const RouterCustom = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  useEffect(() => {
    if (!account || !account.id) {
      dispatch(fetchAccount());
    }
  }, [account, dispatch]);

  return (
    <>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<MasterLayout />}>
          <Route path={ROUTERS.USER.HOME} element={<HomePage />} />
          <Route path={ROUTERS.USER.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTERS.USER.HOME + "/:categorySlug"}
            element={<ProductPage />}
          />
          <Route
            path={ROUTERS.USER.HOME + "/tim-kiem"}
            element={<SearchPage />}
          />
          <Route path={ROUTERS.USER.CART} element={<CartPage />} />
          <Route
            path="/profile/order-list/:orderId"
            element={<OrderDetails />}
          />

          {/* Profile Routes */}
          <Route path={ROUTERS.USER.PROFILE} element={<ProfilePage />}>
            <Route index element={<Info />} />
            <Route path="" element={<Info />} />
            <Route path={ROUTERS.USER.ORDER_LIST} element={<OrderHistory />} />
            <Route path={ROUTERS.USER.CHANGE_PASS} element={<ChangePass />} />
            <Route path={ROUTERS.USER.ADDRESS} element={<Address />} />
          </Route>

          <Route
            path={ROUTERS.USER.PRODUCT_DETAIL(":productId")}
            element={<DetailProduct />}
          />
          <Route path={"/promotion/:id"} element={<PromotionPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/admin/products/add" element={<AddProductPage />} />
          <Route path="/admin/products/edit/:id" element={<AddProductPage />} />
          <Route path="/admin/category" element={<CategoryPage />} />
          <Route path="/admin/category-create" element={<CategoryCreate />} />
          <Route path="/admin/category-edit/:id" element={<CategoryCreate />} />
          <Route path="/admin/top-products" element={<TopProductPage />} />
          <Route path="/admin/flash-sale" element={<FlashSalePage />} />
          <Route
            path="/admin/flash-sale/create"
            element={<FlashSaleCreate />}
          />
          <Route
            path="/admin/flash-sale/edit/:id"
            element={<FlashSaleCreate />}
          />
          <Route path="/admin/event" element={<EventPage />} />
          <Route path="/admin/event/create" element={<EventCreate />} />
          <Route path="/admin/event/edit/:id" element={<EventCreate />} />
          <Route path="/admin/voucher" element={<VoucherPage />} />
          <Route
            path="/admin/voucher/create/:type"
            element={<VoucherCreate />}
          />
          <Route path="/admin/voucher/edit/:id" element={<VoucherCreate />} />
          <Route path="/admin/orders" element={<OrderPage />} />
          <Route
            path="/admin/orders/detail/:orderId"
            element={<OrderDetailPage />}
          />
          <Route path="/admin/stock" element={<StockPage />} />
          <Route path="/admin/feedback" element={<FeedBackPage />} />

          <Route path="/admin/role-permission" element={<RolePermission />} />
          <Route path="/admin/users" element={<UserPage />} />
        </Route>

        <Route path="/order/order-success/:id" element={<OrderSuccess />} />
        <Route path="/order/order-failed" element={<OrderFailed />} />

        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeButton={true}
        pauseOnHover={true}
        draggable={true}
        rtl={false}
      />
    </>
  );
};

export default RouterCustom;
