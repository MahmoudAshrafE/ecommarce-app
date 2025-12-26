'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import {
    Users,
    Package,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ArrowRight,
    Sparkles,
    Waves
} from 'lucide-react'
import { formatCurrency } from '@/lib/formaters'
import { cn } from '@/lib/utils'

const AdminDashboard = () => {
    const { locale } = useParams()
    const t = useTranslations('admin.dashboard')
    const { data: session, status } = useSession()
    const router = useRouter()
    const isRtl = locale === 'ar'

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        serverLoad: 0,
        activeUsers: 0,
        trends: {
            users: 0,
            products: 0,
            orders: 0,
            revenue: 0
        }
    })

    const [greeting, setGreeting] = useState('')

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting(t('goodMorning') || 'Good Morning')
        else if (hour < 18) setGreeting(t('goodAfternoon') || 'Good Afternoon')
        else setGreeting(t('goodEvening') || 'Good Evening')
    }, [t])

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats')
                if (response.ok) {
                    const data = await response.json()
                    setStats(data)
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            }
        }

        if (status === 'authenticated') {
            fetchStats()
        }
    }, [status])

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground font-bold animate-pulse">
                    {t('analyzingMetrics')}
                </p>
            </div>
        )
    }

    if (!session?.user) return null

    const statCards = [
        {
            title: t('totalUsers'),
            value: stats.totalUsers,
            icon: Users,
            gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
            iconColor: 'bg-blue-500',
            trend: stats.trends.users,
            border: 'border-blue-500/20'
        },
        {
            title: t('totalProducts'),
            value: stats.totalProducts,
            icon: Package,
            gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
            iconColor: 'bg-emerald-500',
            trend: stats.trends.products,
            border: 'border-emerald-500/20'
        },
        {
            title: t('totalOrders'),
            value: stats.totalOrders,
            icon: ShoppingCart,
            gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
            iconColor: 'bg-purple-500',
            trend: stats.trends.orders,
            border: 'border-purple-500/20'
        },
        {
            title: t('totalRevenue'),
            value: formatCurrency(stats.totalRevenue, locale as string),
            icon: DollarSign,
            gradient: 'from-orange-500/20 via-orange-500/5 to-transparent',
            iconColor: 'bg-orange-500',
            trend: stats.trends.revenue,
            border: 'border-orange-500/20'
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            {/* Welcome Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                <div className="relative flex flex-col md:flex-row items-center justify-between p-5 xs:p-8 md:p-10 bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Waves className="w-32 h-32" />
                    </div>

                    <div className={cn("space-y-2 text-center md:text-left", isRtl && "md:text-right")}>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase tracking-widest text-xs">
                            <Sparkles className="w-4 h-4" />
                            <span>{t('statusOnline')}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-3">
                            {greeting},
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                {session.user.name?.split(' ')[0]}
                            </span>
                            <span className="animate-bounce">👋</span>
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-md">
                            {t('pendingAttention', { count: stats.pendingOrders })}
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0 flex gap-3">
                        <div className="px-6 py-3 bg-secondary/80 backdrop-blur-sm rounded-2xl border border-border/50 text-center">
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('serverLoad')}</div>
                            <div className="text-xl font-black text-foreground">{stats.serverLoad}%</div>
                        </div>
                        <div className="px-6 py-3 bg-primary/10 rounded-2xl border border-primary/20 text-center">
                            <div className="text-xs font-bold text-primary uppercase tracking-widest">{t('activeNow')}</div>
                            <div className="text-xl font-black text-primary">{stats.activeUsers}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div
                            key={index}
                            className={cn(
                                "group relative overflow-hidden bg-card p-6 rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5",
                                stat.border
                            )}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.gradient)} />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={cn("p-3 rounded-2xl text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-500", stat.iconColor)}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-tight",
                                        stat.trend >= 0
                                            ? "bg-emerald-500/10 text-emerald-600"
                                            : "bg-red-500/10 text-red-600"
                                    )}>
                                        {stat.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {Math.abs(stat.trend)}%
                                    </div>
                                </div>
                                <h3 className="text-muted-foreground font-bold text-sm tracking-tight mb-1 uppercase">
                                    {stat.title}
                                </h3>
                                <p className={cn("text-3xl font-black tracking-tighter text-foreground group-hover:scale-110 transition-transform origin-left", isRtl ? "origin-right" : "origin-left")}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Quick Actions & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Modern Quick Actions */}
                <div className="lg:col-span-12">
                    <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] p-5 xs:p-8 md:p-10 border border-border/50">
                        <div className="flex items-center justify-between mb-6 xs:mb-10">
                            <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">{t('quickActions')}</h2>
                            <div className="h-px flex-1 mx-8 bg-border/50 hidden md:block" />
                            <ArrowRight className={cn("text-muted-foreground w-6 h-6 transition-transform cursor-pointer", isRtl ? "rotate-180 hover:-translate-x-2" : "hover:translate-x-2")} />
                        </div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
                            {[
                                {
                                    label: t('manageUsers'),
                                    desc: t('manageUsersDesc'),
                                    path: '/admin/users',
                                    icon: Users,
                                    color: 'blue'
                                },
                                {
                                    label: t('manageProducts'),
                                    desc: t('manageProductsDesc'),
                                    path: '/admin/menu-items',
                                    icon: Package,
                                    color: 'emerald'
                                },
                                {
                                    label: t('viewOrders'),
                                    desc: t('viewOrdersDesc'),
                                    path: '/admin/orders',
                                    icon: ShoppingCart,
                                    color: 'purple'
                                }
                            ].map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => router.push(action.path)}
                                    className={cn(
                                        "group relative p-5 xs:p-6 md:p-8 bg-secondary/40 hover:bg-card border border-border/50 rounded-[1.5rem] xs:rounded-[2rem] transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 active:scale-95",
                                        isRtl ? "text-right" : "text-left"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-[0.03] transform rotate-12 transition-transform duration-700 group-hover:rotate-45 group-hover:scale-150",
                                        `text-${action.color}-600 dark:text-${action.color}-400`
                                    )}>
                                        <action.icon className="w-full h-full" />
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-xl w-fit mb-6 transition-all duration-500",
                                        `bg-${action.color}-500/10 text-${action.color}-600 dark:text-${action.color}-400 group-hover:bg-${action.color}-500 group-hover:text-white`
                                    )}>
                                        <action.icon className={cn("w-6 h-6", isRtl && action.icon === ArrowRight && "rotate-180")} />
                                    </div>
                                    <h3 className="font-black text-xl tracking-tight mb-2 uppercase">{action.label}</h3>
                                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                                        {action.desc}
                                    </p>
                                    <div className={cn(
                                        "mt-8 flex items-center gap-2 text-xs font-black uppercase text-primary opacity-0 group-hover:opacity-100 transition-all duration-500",
                                        isRtl ? "translate-x-[10px] group-hover:translate-x-0" : "translate-x-[-10px] group-hover:translate-x-0"
                                    )}>
                                        <span>{t('proceedNow')}</span>
                                        <ArrowRight className={cn("w-3 h-3", isRtl && "rotate-180")} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
