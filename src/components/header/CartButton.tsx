'use client'
import { Routes } from "@/constants/enums"
import Link from "../link"
import { ShoppingBag } from "lucide-react"
import { useAppSelector } from "@/redux/hooks"
import { selectCartItems } from "@/redux/features/cart/cartSlice"
import { getCartQuantity } from "@/lib/cart"
import { useParams } from "next/navigation"

import { useState, useEffect } from "react"

interface CartButtonProps {
  onClose?: () => void
}

const CartButton = ({ onClose }: CartButtonProps) => {
  const cart = useAppSelector(selectCartItems)
  const quantity = getCartQuantity(cart)
  const { locale } = useParams();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;
  return (
    <Link
      href={`/${locale}/${Routes.CART}`}
      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/50 hover:bg-primary transition-all duration-300 group relative shadow-inner"
      onClick={onClose}
    >
      <ShoppingBag className="w-5 h-5 text-foreground group-hover:text-white transition-colors" />

      {quantity > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background group-hover:scale-110 transition-transform shadow-lg">
          {quantity}
        </span>
      )}
    </Link>
  )
}

export default CartButton