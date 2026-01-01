'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    Cell
} from 'recharts'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/formaters'

interface ChartData {
    date: string
    revenue: number
    orders: number
    users: number
}

interface AdminChartsProps {
    data: ChartData[]
}

export const AdminCharts = ({ data }: AdminChartsProps) => {
    const t = useTranslations('admin.dashboard')
    const { locale } = useParams()
    const isRtl = locale === 'ar'

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem.replace(/-/g, '/'))
        // Force Gregorian calendar and Western numerals (nu-latn) for consistency with the dashboard
        return new Intl.DateTimeFormat(isRtl ? 'ar-EG-u-nu-latn' : 'en-US', {
            month: 'short',
            day: 'numeric'
        }).format(date)
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const date = new Date(label.replace(/-/g, '/'))
            const formattedDate = new Intl.DateTimeFormat(isRtl ? 'ar-EG-u-nu-latn' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date)

            return (
                <div className="bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                    <p className="font-black text-sm mb-2 text-muted-foreground uppercase tracking-wider relative z-10">
                        {formattedDate}
                    </p>
                    <div className="space-y-2 relative z-10">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-xs font-bold uppercase tracking-tight">{entry.name}</span>
                                </div>
                                <span className="font-black text-foreground">
                                    {entry.name === t('revenue')
                                        ? formatCurrency(entry.value, locale as string)
                                        : entry.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Revenue & Orders Chart */}
            <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                <div className="relative bg-card p-4 xs:p-6 md:p-8 rounded-[2rem] border border-border/50 shadow-sm overflow-hidden h-[350px] md:h-[450px] flex flex-col">
                    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-8", isRtl && "sm:flex-row-reverse")}>
                        <div className={isRtl ? "text-right" : "text-left"}>
                            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase leading-none">{t('revenueStats')}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                {isRtl ? "نشاط آخر 15 يوم" : "Last 15 Days Activity"}
                            </p>
                        </div>
                        <div className={cn("flex flex-wrap gap-3 md:gap-4", isRtl && "flex-row-reverse")}>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">{t('revenue')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">{t('orders')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full mt-auto overflow-hidden text-[10px] relative min-h-[250px]" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: isRtl ? 40 : 10, left: isRtl ? 10 : 40, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-[0.05]" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatXAxis}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.5 }}
                                    dy={10}
                                    reversed={isRtl}
                                    interval={data.length > 7 ? 2 : 0}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.5 }}
                                    orientation={isRtl ? 'right' : 'left'}
                                    width={isRtl ? 45 : 45}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    name={t('revenue')}
                                    stroke="var(--primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    animationDuration={2000}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="orders"
                                    name={t('orders')}
                                    stroke="#a855f7"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorOrders)"
                                    animationDuration={2500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* User Growth Chart */}
            <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                <div className="relative bg-card p-4 xs:p-6 md:p-8 rounded-[2rem] border border-border/50 shadow-sm overflow-hidden h-[350px] md:h-[450px] flex flex-col">
                    <div className="flex items-center justify-between mb-4 md:mb-8">
                        <div className={isRtl ? "text-right" : "text-left"}>
                            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase leading-none">{t('userGrowth')}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                {isRtl ? "تسجيلات المستخدمين اليومية" : "Daily New Registrations"}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 w-full mt-auto overflow-hidden text-[10px] relative min-h-[250px]" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: isRtl ? 40 : 10, left: isRtl ? 10 : 40, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-[0.05]" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatXAxis}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.5 }}
                                    dy={10}
                                    reversed={isRtl}
                                    interval={data.length > 7 ? 2 : 0}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.5 }}
                                    orientation={isRtl ? 'right' : 'left'}
                                    width={isRtl ? 45 : 45}
                                />
                                <Tooltip
                                    cursor={{ fill: 'currentColor', opacity: 0.05 }}
                                    content={<CustomTooltip />}
                                />
                                <Bar
                                    dataKey="users"
                                    name={t('users')}
                                    radius={[10, 10, 0, 0]}
                                    animationDuration={2000}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index % 2 === 0 ? 'var(--primary)' : '#10b981'}
                                            fillOpacity={0.8}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
