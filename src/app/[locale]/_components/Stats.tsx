import { Users, ShoppingBag, Star, TrendingUp } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'

const Stats = async ({ locale }: { locale: string }) => {
    const t = await getTranslations({ locale, namespace: 'home.hero' })

    // Fetch real data from DB
    const [userCount, orderCount, reviewsData, productCount] = await Promise.all([
        prisma.user.count(),
        prisma.order.count({ where: { status: 'DELIVERED' } }),
        prisma.review.aggregate({
            _avg: {
                rating: true
            }
        }),
        prisma.product.count()
    ])

    const stats = [
        {
            icon: Users,
            value: `${userCount >= 1000 ? (userCount / 1000).toFixed(1) + 'K' : userCount}+`,
            label: t('stats.happyCustomers'),
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            icon: ShoppingBag,
            value: `${orderCount}+`,
            label: t('stats.ordersDelivered'),
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            icon: Star,
            value: reviewsData._avg.rating?.toFixed(1) || '0.0',
            label: t('stats.averageRating'),
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            icon: TrendingUp,
            value: `${productCount}`,
            label: t('stats.menuItems'),
            color: 'text-violet-500',
            bg: 'bg-violet-500/10'
        }
    ]

    return (
        <section className="py-24 relative overflow-hidden bg-primary/5">
            {/* Decorative background shapes */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center group p-6 rounded-3xl transition-all duration-300"
                        >
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${stat.bg} mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-sm`}>
                                <stat.icon className={`w-10 h-10 ${stat.color}`} />
                            </div>
                            <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 text-foreground tracking-tight underline decoration-primary/30 decoration-4 underline-offset-8 group-hover:decoration-primary transition-all duration-300">
                                {stat.value}
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground font-bold uppercase tracking-widest mt-4">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Stats
