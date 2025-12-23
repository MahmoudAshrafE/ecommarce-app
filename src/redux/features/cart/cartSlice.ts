import { Extra, Size } from "@/generated/prisma/client";
import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  name: string;
  id: string; // product id
  image: string;
  basePrice: number;
  quantity?: number;
  size?: Size;
  extras?: Extra[];
};

const isSameVariant = (a: CartItem, b: CartItem) =>
  a.id === b.id &&
  a.size?.id === b.size?.id &&
  JSON.stringify(a.extras?.map(e => e.id).sort()) ===
    JSON.stringify(b.extras?.map(e => e.id).sort());

interface cartState {
  items: CartItem[];
}

const initialState: cartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },

    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item =>
          item.id === action.payload.id &&
          item.size?.id === action.payload.size?.id &&
          // compare extras
          JSON.stringify(item.extras?.map(e => e.id).sort()) ===
          JSON.stringify(action.payload.extras?.map(e => e.id).sort())
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

removeCartItem: (state, action: PayloadAction<CartItem>) => {
  const existing = state.items.find(i => isSameVariant(i, action.payload));
  if (!existing) return;

  if ((existing.quantity || 0) > 1) {
    existing.quantity!--;
  } else {
    state.items = state.items.filter(i => !isSameVariant(i, action.payload));
  }
},

removeItemFromCart: (state, action: PayloadAction<CartItem>) => {
  state.items = state.items.filter(i => !isSameVariant(i, action.payload));
},


    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { hydrateCart, addCartItem, removeCartItem, removeItemFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;
