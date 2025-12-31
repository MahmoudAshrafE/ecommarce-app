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
import { CreditCard, MapPin, Phone, Lock, ChevronRight, FileText, AlertCircle } from "lucide-react"
import { Loader } from "@/components/ui/loader"
import { useRouter, useParams } from "next/navigation"
import { formatCurrency } from "@/lib/formaters"
import { cn } from "@/lib/utils"

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
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const subTotal = getSubTotal(cartItems)
  const deliveryFee = 5
  const totalPrice = subTotal + deliveryFee

  const validate = (name: string, value: string) => {
    let error = ''
    switch (name) {
      case 'phone':
        if (!/^\+?[\d\s-]{8,15}$/.test(value)) {
          error = t('checkout.validation.phone')
        }
        break
      case 'streetAddress':
        if (value.length < 5) {
          error = t('checkout.validation.streetAddress')
        }
        break
      case 'postalCode':
        if (value.length < 3) {
          error = t('checkout.validation.postalCode')
        }
        break
      case 'city':
        if (value.length < 2) {
          error = t('checkout.validation.city')
        }
        break
      case 'country':
        if (value.length < 2) {
          error = t('checkout.validation.country')
        }
        break
    }
    return error
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validate(name, formData[name as keyof typeof formData] || '')
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const error = validate(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final validation
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(key => {
      if (key === 'notes') return
      const error = validate(key, formData[key as keyof typeof formData] || '')
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
      toast({
        variant: "destructive",
        description: isRtl ? "يرجى تصحيح الأخطاء في النموذج" : "Please fix the errors in the form"
      })
      return
    }

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

  const renderInput = (id: string, label: string, icon: any, placeholder: string, type = "text") => {
    const hasError = touched[id] && errors[id]
    return (
      <div className="space-y-2 relative">
        <Label htmlFor={id} className={cn(
          "flex items-center gap-2 font-bold mb-1 transition-colors",
          hasError ? "text-destructive" : "text-foreground/70"
        )}>
          {icon && <icon.type {...icon.props} className={cn("w-4 h-4", hasError ? "text-destructive" : "text-primary")} />}
          {label}
        </Label>
        <div className="relative group">
          <Input
            id={id}
            value={formData[id as keyof typeof formData]}
            onChange={(e) => handleChange(id, e.target.value)}
            onBlur={() => handleBlur(id)}
            placeholder={placeholder}
            type={type}
            dir={isRtl ? 'rtl' : 'ltr'}
            className={cn(
              "h-12 md:h-14 rounded-xl md:rounded-2xl bg-secondary/50 border-border/50 transition-all focus:bg-background",
              hasError ? "border-destructive ring-destructive/20 ring-4" : "focus:ring-primary"
            )}
          />
          {hasError && (
            <AlertCircle className={cn(
              "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-destructive animate-in zoom-in duration-300",
              isRtl ? "left-4" : "right-4"
            )} />
          )}
        </div>
        {hasError && (
          <p className={cn(
            "text-[10px] md:text-xs font-bold text-destructive animate-in slide-in-from-top-1 duration-200"
          )}>
            {errors[id]}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSubmit} className="bg-card p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-border/50 shadow-xl space-y-6 md:space-y-8 relative overflow-hidden group">
        <div className={cn("absolute top-0 w-2 h-full bg-primary", isRtl ? "right-0" : "left-0")} />

        <div className={cn("flex items-center gap-4", isRtl ? "text-right" : "text-left")}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-xl md:rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
            <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className={isRtl ? "text-right" : "text-left"}>
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">{t('checkout.title')}</h2>
            <p className="text-[10px] md:text-xs text-muted-foreground font-bold tracking-widest uppercase">{t('checkout.securePayment')}</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {renderInput("phone", t('checkout.phone'), <Phone />, "+123 456 7890", "tel")}
          {renderInput("streetAddress", t('checkout.streetAddress'), <MapPin />, "123 Main St")}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput("postalCode", t('checkout.postalCode'), null, "12345")}
            {renderInput("city", t('checkout.city'), null, "New York")}
          </div>

          {renderInput("country", t('checkout.country'), null, "United States")}

          <div className="space-y-2">
            <Label htmlFor="notes" className={cn("flex items-center gap-2 font-bold mb-1 text-foreground/70")}>
              <FileText className="w-4 h-4 text-primary" />
              {t('checkout.notes')}
            </Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('checkout.notesPlaceholder')}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={cn(
                "w-full min-h-[100px] p-4 rounded-xl md:rounded-2xl bg-secondary/50 border border-border/50 focus:bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
              )}
            />
          </div>
        </div>

        {/* Order Summary inside form */}
        <div className="bg-secondary p-5 md:p-6 rounded-2xl md:rounded-[2rem] space-y-3 md:space-y-4 shadow-inner border border-border/50">
          <div className="flex justify-between font-bold text-muted-foreground">
            <span className="text-[10px] md:text-sm uppercase tracking-widest">{t('cart.subtotal')}</span>
            <span className="text-sm md:text-base">{formatCurrency(subTotal, locale as string)}</span>
          </div>
          <div className="flex justify-between font-bold text-muted-foreground">
            <span className="text-[10px] md:text-sm uppercase tracking-widest">{t('cart.delivery')}</span>
            <span className="text-sm md:text-base">{formatCurrency(deliveryFee, locale as string)}</span>
          </div>
          <div className="pt-3 md:pt-4 border-t border-border/50 flex justify-between items-center">
            <span className="text-lg md:text-xl font-black uppercase italic tracking-tighter">{t('cart.total')}</span>
            <span className="text-2xl md:text-3xl font-black text-primary">{formatCurrency(totalPrice, locale as string)}</span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-14 md:h-16 rounded-xl md:rounded-[1.5rem] text-lg md:text-xl font-black shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all group overflow-hidden relative"
          loading={loading}
          disabled={cartItems.length === 0}
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {!loading && <Lock className="w-5 h-5" />}
            {t('checkout.pay')}
            {!loading && <ChevronRight className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1", isRtl ? "rotate-180 group-hover:-translate-x-1" : "")} />}
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