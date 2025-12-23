"use client";

import { useEffect } from "react";
import { hydrateCart } from "@/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import { loadCartFromStorage } from "@/lib/cartStorge";

export default function CartHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const items = loadCartFromStorage();
    if (items.length > 0) {
      dispatch(hydrateCart(items));
    }
  }, [dispatch]);

  return null;
}
