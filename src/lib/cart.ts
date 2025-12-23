import { CartItem } from "@/redux/features/cart/cartSlice";
import { ProductWithRelations } from "@/types/product";

export const getCartQuantity = (cart: CartItem[]) => {
   return cart.reduce((quantity, item) => item.quantity! + quantity , 0) 
}
export const getItemQuantity = (
  id: string,
  sizeId: string,
  extrasIds: string[],
  cart: CartItem[]
) => {
  return (
    cart.find(
      (item) =>
        item.id === id &&
        item.size?.id === sizeId &&
        item.extras?.map(e => e.id).sort().join(",") ===
          extrasIds.sort().join(",")
    )?.quantity || 0
  );
};

export const getSubTotal = (cart: CartItem[]) => {
   return cart.reduce((total, cartItem) => {
    const extrasTotal = cartItem.extras?.reduce((sumPrices, extra) => 
      sumPrices + (extra.price || 0)
    , 0)  
    const itemPriceTotal = cartItem.basePrice + (cartItem.size?.price || 0) + ( extrasTotal || 0)
    
    return total + itemPriceTotal * cartItem.quantity!;
   }, 0)
}
export const getExtraTotal = (item: ProductWithRelations) => {
       const extrasTotal = item.extras?.reduce((sumPrices, extra) => 
      sumPrices + (extra.price || 0)
    , 0)  
    return extrasTotal
}