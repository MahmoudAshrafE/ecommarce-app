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
    <div className="space-y-10">
      <div className={`flex items-center justify-between pb-6 border-b border-border/50 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <ShoppingBasket className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">{t('cart.yourItems')}</h2>
        </div>
        <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-4 py-2 rounded-xl">
          {cart.length} {t('cart.items')}
        </div>
      </div>

      {cart && cart.length > 0 ? (
        <div className="space-y-6">
          {cart.map((item: CartItem) => (
            <div
              key={`${item.id}-${item.size?.id}-${item.extras?.map(e => e.id).join("_")}`}
              className="group relative flex flex-col sm:flex-row items-center gap-6 bg-card p-6 rounded-[2.5rem] border border-border/50 hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative w-32 h-32 flex-shrink-0 bg-secondary/30 rounded-[2rem] p-4 group-hover:bg-primary/5 transition-colors duration-500 overflow-hidden">
                <Image
                  src={item.image}
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 128px, 128px"
                />
              </div>

              {/* Product Info */}
              <div className={`flex-grow space-y-2 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-start justify-between gap-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <h4 className="font-black text-xl md:text-2xl tracking-tighter group-hover:text-primary transition-colors">{item.name}</h4>
                  <Button
                    onClick={() => dispatch(removeItemFromCart(item))}
                    variant="ghost"
                    className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                    size="icon"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className={`flex flex-wrap gap-2 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  {item.size && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary px-3 py-1 rounded-full text-muted-foreground">
                      {t('cart.size')}: {t(item.size.name)}
                    </span>
                  )}
                  {item.extras && item.extras.length > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary px-3 py-1 rounded-full text-muted-foreground">
                      {t('cart.extras')}: {item.extras.map((e: any) => t(e.name)).join(", ")}
                    </span>
                  )}
                </div>

                <div className={`flex items-center justify-between pt-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="font-black text-2xl text-primary">
                    {formatCurrency(((item.size?.price || 0) + item.basePrice), locale as string)}
                  </div>

                  <div className="flex items-center gap-4 bg-secondary p-1.5 rounded-[1.25rem] border border-border/50 shadow-inner">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 bg-background rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all"
                      onClick={() => dispatch(removeCartItem(item))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-black text-lg min-w-[24px] text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 bg-background rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all"
                      onClick={() => dispatch(addCartItem(item))}
                    >
                      <Plus className="h-4 w-4" />
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