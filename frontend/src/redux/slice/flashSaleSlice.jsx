import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listProductSku: [],
};

const flashSaleSlice = createSlice({
  name: "flashSale",
  initialState,
  reducers: {
    setFlashSaleState: (state, action) => {
      state.listProductSku = action.payload?.listProductSku;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    // builder.addCase(fetchAccount.pending, (state, action) => {});
    // builder.addCase(fetchAccount.fulfilled, (state, action) => {});
    // builder.addCase(fetchAccount.rejected, (state, action) => {});
  },
});

export const { setFlashSaleState } = flashSaleSlice.actions;

export default flashSaleSlice.reducer;
