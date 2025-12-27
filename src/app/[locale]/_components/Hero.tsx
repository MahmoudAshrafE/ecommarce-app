import Link from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { Routes } from '@/constants/enums'
import { ArrowRight, Star, Clock, ShieldCheck, Users, ShoppingBag, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { getTranslations, getLocale } from 'next-intl/server'
import { prisma } from '@/lib/prisma'

const Hero = async ({ locale }: { locale: string }) => {
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
      count: `${userCount >= 1000 ? (userCount / 1000).toFixed(1) + 'K' : userCount}+`,
      label: t('stats.happyCustomers'),
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: ShoppingBag,
      count: `${orderCount}+`,
      label: t('stats.ordersDelivered'),
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      icon: Star,
      count: reviewsData._avg.rating?.toFixed(1) || '0.0',
      label: t('stats.averageRating'),
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      icon: TrendingUp,
      count: `${productCount}`,
      label: t('stats.menuItems'),
      color: 'text-violet-500',
      bg: 'bg-violet-500/10'
    }
  ]

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background py-20 xl:py-0">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[70%] bg-primary/20 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-orange-500/10 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="container relative z-10 pt-10 px-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          <div className="text-center xl:text-start">
            {/* Trendy pill badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/30 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold tracking-wide uppercase text-foreground/80">{t('badge')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight mb-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
              {t('title').split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? 'text-primary' : 'text-foreground'}>
                  {word}{' '}
                </span>
              ))}
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto xl:mx-0 mb-10 leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
              {t('description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link
                href={`/${locale}/${Routes.MENU}`}
                className={`${buttonVariants({
                  size: 'lg',
                })} h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all group`}
              >
                {t('orderNow')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/${Routes.ABOUT}`}
                className="h-16 px-10 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-sm flex items-center justify-center font-bold hover:bg-secondary/50 text-foreground transition-all"
              >
                {t('learnMore')}
              </Link>
            </div>

            {/* Feature mini-list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-16 pt-8 border-t border-border/10 animate-in fade-in duration-1000 delay-500">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{t('features.delivery')}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{t('features.payment')}</span>
              </div>
              <div className="flex items-center gap-3 hidden sm:flex text-muted-foreground">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{t('features.rating')}</span>
              </div>
            </div>
          </div>

          <div className="relative h-[450px] md:h-[600px] xl:h-[700px] animate-in fade-in zoom-in duration-1000 delay-200 hidden xl:block">
            {/* Main Burger Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-[80%] h-[80%] bg-primary/20 rounded-full blur-[80px] animate-pulse" />
              <Image
                alt={t('title')}
                src="/assets/images/hero-burger.png"
                className="object-contain drop-shadow-[0_20px_50px_rgba(255,115,0,0.3)] animate-float"
                fill
                sizes="(max-width: 1280px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Floating Badges */}
            <div className={`absolute top-1/4 ${locale === 'ar' ? 'left-[-2%]' : 'right-[-2%]'} bg-card/80 backdrop-blur-xl p-4 rounded-2xl border border-border/50 shadow-2xl animate-bounce-slow hidden md:block z-30`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">{t('stats.averageRating')}</p>
                  <p className="font-black text-lg text-foreground">{reviewsData._avg.rating?.toFixed(1) || '0.0'}/5.0</p>
                </div>
              </div>
            </div>

            <div className={`absolute bottom-1/3 ${locale === 'ar' ? 'right-[-2%]' : 'left-[-2%]'} bg-card/80 backdrop-blur-xl p-4 rounded-2xl border border-border/50 shadow-2xl animate-float-delayed hidden md:block z-30`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">{t('stats.happyCustomers')}</p>
                  <p className="font-black text-lg text-foreground">{userCount >= 1000 ? (userCount / 1000).toFixed(1) + 'K' : userCount}+</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar at the bottom of Hero */}
        <div className="mt-20 xl:mt-32 pt-12 border-t border-border/10 relative z-20 pb-10">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center xl:items-start group transition-all duration-300">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl xl:text-4xl font-black text-foreground tracking-tight">
                    {stat.count}
                  </div>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
