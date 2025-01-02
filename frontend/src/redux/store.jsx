import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlice";
import productReducer from "./slice/productSlice";
import cartReducer from "./slice/cartSlice";
import flashSaleReducer from "./slice/flashSaleSlice";
import rbacReducer from "./slice/rbacSlice";

const store = configureStore({
  reducer: {
    account: accountReducer,
    product: productReducer,
    cart: cartReducer,
    flashSale: flashSaleReducer,
    rbac: rbacReducer,
  },
});

export default store;
