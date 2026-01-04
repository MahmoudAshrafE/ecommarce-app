import { getProductById } from "@/server/db/product"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatCurrency } from "@/lib/formaters"
import AddToCartButton from "@/components/menu/AddToCartButton"
import ReviewForm from "./_components/ReviewForm"
import ReviewList from "./_components/ReviewList"
import { getTranslations, getLocale } from "next-intl/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Star, Clock, Truck, Utensils } from "lucide-react"
import Link from "@/components/link"
import { Routes, Pages } from "@/constants/enums"
import Breadcrumbs from "@/components/Breadcrumbs"

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params
    const product = await getProductById(productId)

    if (!product) return { title: 'Product Not Found' }

    return {
        title: (await getLocale()) === 'ar' ? product.nameAr || product.name : product.name,
        description: (await getLocale()) === 'ar' ? product.descriptionAr || product.description : product.description
    }
}

export default async function ProductPage({ params }: { params: Promise<{ productId: string, locale: string }> }) {
    const { productId, locale } = await params
    const product = await getProductById(productId)
    const t = await getTranslations({ locale })
    const isRtl = locale === 'ar'
    const session = await getServerSession(authOptions)

    if (!product) {
        notFound()
    }

    const rating = product.reviews.length > 0
        ? (product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length).toFixed(1)
        : '0.0'

    return (
        <main className="min-h-screen pt-16 pb-20 overflow-hidden bg-[#f8fafc] dark:bg-background">
            <div className="container py-8">
                <Breadcrumbs labels={{ [productId]: isRtl ? product.nameAr || product.name : product.name }} />
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24 ${isRtl ? 'rtl' : ''}`}>
                    {/* Product Image Section */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-3 scale-95 transition-transform group-hover:rotate-0 group-hover:scale-100 duration-700" />
                        <div className="relative aspect-square rounded-4xl md:rounded-[3rem] bg-white dark:bg-card border border-border/50 shadow-2xl flex items-center justify-center p-4 md:p-8 overflow-hidden">
                            <Image
                                src={product.image}
                                alt={isRtl ? product.nameAr || product.name : product.name}
                                fill
                                className="object-contain p-8 md:p-12 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        {/* Floating Price Tag */}
                        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} md:top-8 md:${isRtl ? 'left-8' : 'right-8'} bg-primary text-white dark:text-black font-black px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-xl shadow-primary/30 text-xs md:text-sm rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
                            {formatCurrency(product.basePrice, locale)}
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className={`flex flex-col justify-center ${isRtl ? 'text-right' : 'text-left'}`}>
                        <div className="space-y-6">
                            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full text-sm font-black">
                                    <Star className="w-4 h-4 fill-current" />
                                    {rating}
                                </div>
                                <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
                                    {product.reviews.length} {t('admin.tabs.reviews')}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-foreground">
                                {isRtl ? product.nameAr || product.name : product.name}
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                                {isRtl ? product.descriptionAr || product.description : product.description}
                            </p>

                            <div className="pt-8 grid sm:grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                                <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{t('menu.product.freeDelivery')}</p>
                                        <p className="text-xs text-muted-foreground">{t('menu.product.ordersOver')}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{t('menu.product.fastPrep')}</p>
                                        <p className="text-xs text-muted-foreground">{t('menu.product.prepTime')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-secondary/30 p-4 sm:p-8 rounded-3xl md:rounded-4xl border border-border/50 backdrop-blur-sm relative overflow-hidden group">

                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                                <AddToCartButton item={product} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="max-w-4xl mx-auto pt-20 border-t border-border/50">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                        <div className={isRtl ? 'text-right' : 'text-left'}>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">{t('reviews.title')}</h2>
                            <p className="text-muted-foreground mt-2 font-medium">{t('menu.product.reviewsSub')}</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#0a0a0b] text-white px-8 py-4 rounded-3xl font-black text-xl shadow-2xl">
                            <Star className="w-6 h-6 fill-primary text-primary" />
                            {rating} / 5.0
                        </div>
                    </div>

                    <div className="space-y-16">
                        {/* Write Review Form */}
                        {session?.user ? (
                            <div className="bg-card p-4 sm:p-10 rounded-4xl md:rounded-[3rem] border border-border/50 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                                <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-8 uppercase tracking-tight">{t('reviews.writeReview')}</h3>
                                <ReviewForm productId={product.id} />
                            </div>
                        ) : (
                            <div className="bg-secondary/50 p-6 sm:p-12 rounded-4xl md:rounded-[3rem] text-center border-2 border-dashed border-border/50">

                                <Utensils className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6 text-muted-foreground opacity-30" />
                                <p className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6">{t('menu.product.loginReview')}</p>
                                <Link href={`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`} className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-primary px-6 sm:px-10 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                    {t('menu.product.loginBtn')}
                                </Link>
                            </div>
                        )}

                        {/* Reviews List */}
                        <div className="pt-10">
                            <ReviewList reviews={product.reviews} />

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
