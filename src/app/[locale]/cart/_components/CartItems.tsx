'use client'

import { Button } from "@/components/ui/button"
import { getSubTotal } from "@/lib/cart"
import { formatCurrency } from "@/lib/formaters"
import { addCartItem, removeCartItem, removeItemFromCart, selectCartItems, CartItem } from "@/redux/features/cart/cartSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Trash2, Plus, Minus, ShoppingBasket, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { useTranslations } from "next-intl"

const CartItems = () => {
  const { locale } = useParams()
  const t = useTranslations()
  const cart = useAppSelector(selectCartItems)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const subTotal = getSubTotal(cart)
  const DeliverFee = 5

  return (
    <div className="space-y-6 md:space-y-10">
      <div className={`flex items-center justify-between pb-4 md:pb-6 border-b border-border/50`}>
        <div className={`flex items-center gap-3 md:gap-4`}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary">
            <ShoppingBasket className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{t('cart.yourItems')}</h2>
        </div>
        <div className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">
          {cart.length} {t('cart.items')}
        </div>
      </div>

      {cart && cart.length > 0 ? (
        <div className="space-y-4 md:space-y-6">
          {cart.map((item: CartItem) => (
            <div
              key={`${item.id}-${item.size?.id}-${item.extras?.map(e => e.id).join("_")}`}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 bg-card p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-border/50 hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image - Responsive: Full width on mobile/stacked, fixed on sm+ */}
              <div className="relative w-full sm:w-32 h-44 sm:h-32 flex-shrink-0 bg-secondary/30 rounded-xl md:rounded-[2rem] p-3 md:p-4 group-hover:bg-primary/5 transition-colors duration-500 overflow-hidden">
                {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                  <Image
                    src={item.image}
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    alt={locale === 'ar' ? item.nameAr || item.name : item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 128px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <ShoppingBasket className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className={`flex-grow space-y-2 md:space-y-3 w-full`}>
                <div className={`flex items-start justify-between gap-2 md:gap-4`}>
                  <h4 className="font-black text-lg sm:text-xl md:text-2xl tracking-tighter group-hover:text-primary transition-colors line-clamp-2">{locale === 'ar' ? item.nameAr || item.name : item.name}</h4>
                  <Button
                    onClick={() => dispatch(removeItemFromCart(item))}
                    variant="ghost"
                    className="h-9 w-9 md:h-10 md:w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all flex-shrink-0"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </div>

                <div className={`flex flex-wrap gap-2`}>
                  {item.size && (
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-secondary px-2 md:px-3 py-1 rounded-full text-muted-foreground">
                      {t('cart.size')}: {t(item.size.name)}
                    </span>
                  )}
                  {item.extras && item.extras.length > 0 && (
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-secondary px-2 md:px-3 py-1 rounded-full text-muted-foreground line-clamp-1">
                      {t('cart.extras')}: {item.extras.map((e: any) => t(e.name)).join(", ")}
                    </span>
                  )}
                </div>

                <div className={`flex items-center justify-between pt-2 md:pt-4 gap-3`}>
                  <div className="font-black text-xl md:text-2xl text-primary">
                    {formatCurrency(
                      (item.basePrice + (item.size?.price || 0) + (item.extras?.reduce((acc, extra) => acc + extra.price, 0) || 0)) * (item.quantity || 1),
                      locale as string
                    )}
                  </div>

                  <div className="flex items-center gap-2 md:gap-4 bg-secondary p-1 md:p-1.5 rounded-xl md:rounded-[1.25rem] border border-border/50 shadow-inner">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 md:h-9 md:w-9 bg-background rounded-lg md:rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all"
                      onClick={() => dispatch(removeCartItem(item))}
                    >
                      <Minus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                    <span className="font-black text-base md:text-lg min-w-[20px] md:min-w-[24px] text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 md:h-9 md:w-9 bg-background rounded-lg md:rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all"
                      onClick={() => dispatch(addCartItem(item))}
                    >
                      <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-[3rem] border border-border/50 shadow-inner space-y-8 animate-in zoom-in duration-500">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping " />
            <div className="relative w-32 h-32 bg-secondary rounded-full flex items-center justify-center text-6xl shadow-xl">
              🛒
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black tracking-tighter">{t('cart.noItemsInCart')}</h3>
            <p className="text-muted-foreground max-w-sm mx-auto font-medium">{t('cart.emptyCartDescription')}</p>
          </div>
          <Button
            onClick={() => router.push(`/${locale}/menu`)}
            className="h-14 px-10 rounded-full font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft className={`w-5 h-5 ${locale === 'ar' ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {t('cart.browseMenu')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default CartItems