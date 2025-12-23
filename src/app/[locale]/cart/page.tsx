import { getTranslations } from 'next-intl/server'
import CartItems from './_components/CartItems'
import CheckOutForm from './_components/CheckOutForm'
import { ShoppingBag } from 'lucide-react'
import PageHero from '@/components/PageHero'

const Cart = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale })

  return (
    <main className="min-h-screen bg-background">
      {/* Cart Header Section */}
      <PageHero
        badgeIcon={ShoppingBag}
        badgeText={t('cart.checkoutProcess')}
        title={t('cart.title')}
        subtitle={t('cart.reviewSelection')}
      />

      {/* Cart Content */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-7 xl:col-span-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <CartItems />
            </div>

            {/* Checkout Sidebar */}
            <div className="lg:col-span-5 xl:col-span-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-100 sticky top-28">
              <CheckOutForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Cart