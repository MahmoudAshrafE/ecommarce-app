'use client'
import { Routes } from "@/constants/enums"
import Link from "../link"
import { ShoppingCart } from "lucide-react"
import { useAppSelector } from "@/redux/hooks"
import { selectCartItems } from "@/redux/features/cart/cartSlice"
import { getCartQuantity } from "@/lib/cart"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

const FloatingCartButton = () => {
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
            className="md:hidden fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary to-orange-500 dark:from-secondary dark:via-secondary dark:to-secondary shadow-2xl shadow-primary/40 dark:shadow-none flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group animate-in zoom-in duration-500"
        >
            <ShoppingCart className="w-7 h-7 text-white transition-transform group-hover:scale-110" />

            {quantity > 0 && (
                <span className="absolute -top-2 -right-2 rtl:-right-auto rtl:-left-2 min-w-[28px] h-[28px] px-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black rounded-full flex items-center justify-center border-3 border-background shadow-xl animate-in zoom-in duration-300 group-hover:scale-110 transition-transform">
                    {quantity}
                </span>
            )}

            {/* Pulse animation ring */}
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75" />
        </Link>
    )
}

export default FloatingCartButton
