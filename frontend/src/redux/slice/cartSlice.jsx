// cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart } from "../../config/api";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, thunkAPI) => {
    const response = await getCart({ userId });
    return response.metadata;
  }
);

const initialState = {
  isLoading: false,
  _id: "",
  cart_state: "",
  cart_products: [],
  localCartItems: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartId: (state, action) => {
      state.cart._id = action.payload?.id;
    },

    addToLocalCart: (state, action) => {
      const { skuId, quantity } = action.payload;
      const existingItem = state.localCartItems.find(
        (item) => item.skuId === skuId
      );

      if (existingItem) {
        existingItem.quantity += quantity; // Tăng số lượng sản phẩm
      } else {
        state.localCartItems.push({ skuId, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(state.localCartItems));
    },

    // Xóa sản phẩm khỏi giỏ hàng cục bộ
    removeFromLocalCart: (state, action) => {
      const { skuId } = action.payload;
      state.localCartItems = state.localCartItems.filter(
        (item) => item.skuId !== skuId
      );

      localStorage.setItem("cart", JSON.stringify(state.localCartItems));
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng cục bộ
    updateLocalCartQuantity: (state, action) => {
      const { skuId, quantity } = action.payload;

      const existingItem = state.localCartItems.find(
        (item) => item.skuId === skuId
      );
      if (existingItem) {
        existingItem.quantity = quantity; // Cập nhật số lượng mới
      }

      localStorage.setItem("cart", JSON.stringify(state.localCartItems));
    },

    // Xóa toàn bộ giỏ hàng cục bộ
    clearLocalCart: (state) => {
      state.localCartItems = [];
      localStorage.removeItem("cart");
    },
    resetCart: (state) => {
      state._id = "";
      state.cart_state = "";
      state.cart_products = [];
      state.localCartItems = [];
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state._id = action.payload._id;
        state.cart_products = action.payload.cart_products;
        state.cart_state = action.payload.cart_state;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setCartId,
  addToLocalCart,
  removeFromLocalCart,
  updateLocalCartQuantity,
  clearLocalCart,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
