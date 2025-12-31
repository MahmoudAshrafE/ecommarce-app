import { getTranslations } from 'next-intl/server'
import CartItems from './_components/CartItems'
import CheckOutForm from './_components/CheckOutForm'
import { ShoppingBag } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Breadcrumbs from '@/components/Breadcrumbs'

const Cart = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale })

  return (
    <main className="min-h-screen bg-background pt-16 pb-20">
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs />
        <div className="mb-8 mt-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('cart.title')}</h1>
          <p className="text-muted-foreground">{t('cart.reviewSelection')}</p>
        </div>
      </div>

      {/* Cart Content - Mobile Optimized Grid */}
      <section>
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start">
            {/* Cart Items List - Full width on mobile */}
            <div className="lg:col-span-7 xl:col-span-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <CartItems />
            </div>

            {/* Checkout Sidebar - Full width on mobile, sticky on desktop */}
            <div className="lg:col-span-5 xl:col-span-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-100 lg:sticky lg:top-24">
              <CheckOutForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Cart