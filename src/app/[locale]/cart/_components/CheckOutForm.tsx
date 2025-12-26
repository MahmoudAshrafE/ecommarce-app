'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { clearCart, selectCartItems } from "@/redux/features/cart/cartSlice"
import { getSubTotal } from "@/lib/cart"
import { toast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, MapPin, Phone, Lock, ChevronRight } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { formatCurrency } from "@/lib/formaters"

const CheckOutForm = () => {
  const { locale } = useParams()
  const t = useTranslations()
  const { data: session } = useSession()
  const cartItems = useAppSelector(selectCartItems)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isRtl = locale === 'ar'

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    streetAddress: '',
    postalCode: '',
    city: '',
    country: '',
  })

  const subTotal = getSubTotal(cartItems)
  const deliveryFee = 5
  const totalPrice = subTotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        variant: "destructive",
        description: t('checkout.mustBeLoggedIn')
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        description: t('checkout.emptyCartError')
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cartItems,
          subTotal,
          deliveryFee,
          totalPrice
        })
      })

      if (response.ok) {
        toast({
          description: t('checkout.orderSuccess')
        })
        dispatch(clearCart())
        router.push(`/${locale}/profile`)
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to place order")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-card p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-border/50 shadow-xl space-y-6 md:space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />

        <div className={`flex items-center gap-4 ${isRtl ? 'text-right' : ''}`}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-xl md:rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
            <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">{t('checkout.title')}</h2>
            <p className="text-[10px] md:text-xs text-muted-foreground font-bold tracking-widest uppercase">{t('checkout.securePayment')}</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className={`flex items-center gap-2 font-bold mb-1 text-foreground/70`}>
              <Phone className="w-4 h-4 text-primary" />
              {t('checkout.phone')}
            </Label>
            <Input
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+123 456 7890"
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`h-12 md:h-14 rounded-xl md:rounded-2xl bg-secondary/50 border-border/50 focus:bg-background focus:ring-primary ${isRtl ? 'text-right' : ''}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="streetAddress" className={`flex items-center gap-2 font-bold mb-1 text-foreground/70`}>
              <MapPin className="w-4 h-4 text-primary" />
              {t('checkout.streetAddress')}
            </Label>
            <Input
              id="streetAddress"
              required
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              placeholder="123 Main St"
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`h-12 md:h-14 rounded-xl md:rounded-2xl bg-secondary/50 border-border/50 focus:bg-background focus:ring-primary ${isRtl ? 'text-right' : ''}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="font-bold mb-1 block">{t('checkout.postalCode')}</Label>
              <Input
                id="postalCode"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="12345"
                dir={isRtl ? 'rtl' : 'ltr'}
                className={`h-12 md:h-14 rounded-xl md:rounded-2xl bg-secondary/50 border-border/50 ${isRtl ? 'text-right' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="font-bold mb-1 block">{t('checkout.city')}</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New York"
                dir={isRtl ? 'rtl' : 'ltr'}
                className={`h-12 md:h-14 rounded-xl md:rounded-2xl bg-secondary/50 border-border/50 ${isRtl ? 'text-right' : ''}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="font-bold mb-1 block">{t('checkout.country')}</Label>
            <Input
              id="country"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="United States"
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`h-12 md:h-14 rounded-xl md:rounded-2xl bg-secondary/50 border-border/50 ${isRtl ? 'text-right' : ''}`}
            />
          </div>
        </div>

        {/* Order Summary inside form - Optimized for all screens */}
        <div className="bg-secondary p-5 md:p-6 rounded-2xl md:rounded-[2rem] space-y-3 md:space-y-4 shadow-inner border border-border/50">
          <div className={`flex justify-between font-bold text-muted-foreground`}>
            <span className="text-[10px] md:text-sm uppercase tracking-widest">{t('cart.subtotal')}</span>
            <span className="text-sm md:text-base">{formatCurrency(subTotal, locale as string)}</span>
          </div>
          <div className={`flex justify-between font-bold text-muted-foreground`}>
            <span className="text-[10px] md:text-sm uppercase tracking-widest">{t('cart.delivery')}</span>
            <span className="text-sm md:text-base">{formatCurrency(deliveryFee, locale as string)}</span>
          </div>
          <div className={`pt-3 md:pt-4 border-t border-border/50 flex justify-between items-center`}>
            <span className="text-lg md:text-xl font-black uppercase italic tracking-tighter">{t('cart.total')}</span>
            <span className="text-2xl md:text-3xl font-black text-primary">{formatCurrency(totalPrice, locale as string)}</span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-14 md:h-16 rounded-xl md:rounded-[1.5rem] text-lg md:text-xl font-black shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all group overflow-hidden relative"
          disabled={loading || cartItems.length === 0}
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Lock className="w-5 h-5" />}
            {t('checkout.pay')}
            {!loading && <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />}
          </div>
        </Button>

        {!session && (
          <div className="flex items-center gap-2 justify-center py-1 text-destructive font-bold animate-pulse">
            <Lock className="w-3 h-3 md:w-4 md:h-4" />
            <p className="text-xs md:text-sm">{t('checkout.signInPrompt')}</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default CheckOutForm