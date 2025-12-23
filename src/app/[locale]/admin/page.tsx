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
    DollarSign
} from 'lucide-react'
import { formatCurrency } from '@/lib/formaters'

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
        trends: {
            users: 0,
            products: 0,
            orders: 0,
            revenue: 0
        }
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
        // TODO: Check if user is admin
    }, [status, router])

    useEffect(() => {
        // Fetch dashboard stats
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
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </main>
        )
    }

    if (!session?.user) {
        return null
    }

    const statCards = [
        {
            title: t('totalUsers'),
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-blue-500',
            trend: stats.trends.users
        },
        {
            title: t('totalProducts'),
            value: stats.totalProducts,
            icon: Package,
            color: 'bg-green-500',
            trend: stats.trends.products
        },
        {
            title: t('totalOrders'),
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'bg-purple-500',
            trend: stats.trends.orders
        },
        {
            title: t('totalRevenue'),
            value: formatCurrency(stats.totalRevenue, locale as string),
            icon: DollarSign,
            color: 'bg-orange-500',
            trend: stats.trends.revenue
        }
    ]

    return (
        <div className="py-4 sm:py-6 md:py-8">
            <div className="max-w-7xl">
                {/* Header removed - now in layout */}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className={`flex items-center justify-between mb-3 sm:mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className={`${stat.color} p-2 sm:p-3 rounded-lg sm:rounded-xl`}>
                                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${stat.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.trend >= 0 ? (
                                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                    )}
                                    {stat.trend > 0 ? `+${stat.trend}` : stat.trend}%
                                </div>
                            </div>
                            <h3 className={`text-muted-foreground text-xs sm:text-sm font-medium mb-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                                {stat.title}
                            </h3>
                            <p className={`text-2xl sm:text-3xl font-bold ${isRtl ? 'text-right' : 'text-left'}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-lg">
                    <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isRtl ? 'text-right' : ''}`}>{t('quickActions')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <button
                            onClick={() => router.push('/admin/users')}
                            className={`p-4 sm:p-6 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg sm:rounded-xl transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
                        >
                            <Users className={`w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mb-2 sm:mb-3 ${isRtl ? 'ml-auto' : ''}`} />
                            <h3 className="font-semibold text-base sm:text-lg">{t('manageUsers')}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {t('manageUsersDesc')}
                            </p>
                        </button>

                        <button
                            onClick={() => router.push('/admin/menu-items')}
                            className={`p-4 sm:p-6 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg sm:rounded-xl transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
                        >
                            <Package className={`w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-2 sm:mb-3 ${isRtl ? 'ml-auto' : ''}`} />
                            <h3 className="font-semibold text-base sm:text-lg">{t('manageProducts')}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {t('manageProductsDesc')}
                            </p>
                        </button>

                        <button
                            onClick={() => router.push('/admin/orders')}
                            className={`p-4 sm:p-6 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg sm:rounded-xl transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
                        >
                            <ShoppingCart className={`w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-2 sm:mb-3 ${isRtl ? 'ml-auto' : ''}`} />
                            <h3 className="font-semibold text-base sm:text-lg">{t('viewOrders')}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {t('viewOrdersDesc')}
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
