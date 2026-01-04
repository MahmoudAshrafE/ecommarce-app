'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from "@/lib/formaters"
import { Package, ChevronRight, MapPin, Phone, Info, ShoppingBag, CreditCard, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ui/loader"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Order {
    id: string
    totalPrice: number
    subTotal: number
    deliveryFee: number
    status: string
    paid: boolean
    createdAt: string
    phone: string
    streetAddress: string
    city: string
    postalCode: string
    country: string
    notes?: string
    products: {
        id: string
        quantity: number
        product: {
            name: string
            nameAr?: string
            image: string
            basePrice: number
        }
        size?: {
            name: string
            price: number
        }
        extras?: {
            name: string
            price: number
        }[]
    }[]
}


import { useTranslations } from 'next-intl'

const UserOrders = () => {
    const t = useTranslations('profile')
    const tRoot = useTranslations()
    const tStatus = useTranslations('statuses')
    const tPayment = useTranslations('paymentStatuses')

    const { locale } = useParams()
    const isRtl = locale === 'ar'
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders')
                if (res.ok) {
                    const data = await res.json()
                    setOrders(data)
                }
            } catch (err) {
                console.error("Failed to fetch orders", err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/10 text-yellow-500'
            case 'PREPARING': return 'bg-blue-500/10 text-blue-500'
            case 'ON_WAY': return 'bg-purple-500/10 text-purple-500'
            case 'DELIVERED': return 'bg-green-500/10 text-green-500'
            case 'CANCELLED': return 'bg-destructive/10 text-destructive'
            default: return ''
        }
    }

    if (loading) return (
        <div className="flex justify-center p-8">
            <Loader size="lg" variant="burger" />
        </div>
    )

    if (orders.length === 0) return (
        <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-dashed border-border mt-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-bold">{t('noOrdersYet')}</p>
        </div>
    )

    return (
        <div className="mt-8">
            <div className="grid gap-4">
                {orders.map((order) => (
                    <button
                        key={order.id}
                        onClick={() => {
                            setSelectedOrder(order)
                            setIsDetailOpen(true)
                        }}
                        className="w-full bg-card border border-border/50 p-5 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div className={cn("text-left", isRtl && "text-right")}>
                                <p className="font-black text-lg tracking-tight shrink-0">{t('orderNumber')} #{order.id.slice(0, 8)}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(order.createdAt).toLocaleDateString(locale as string, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className={cn(getStatusColor(order.status), "border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-sm")}>
                                {tStatus(order.status)}
                            </Badge>
                            {order.paid ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-sm">
                                    {tPayment('PAID')}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-sm border-none">
                                    {tPayment('UNPAID')}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6">
                            <div className={cn("text-right", isRtl && "text-left")}>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('totalAmount')}</p>
                                <p className="font-black text-primary text-xl tracking-tighter">{formatCurrency(order.totalPrice, locale as string)}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                <ChevronRight className={cn("w-5 h-5 transition-transform duration-300 group-hover:translate-x-1", isRtl && "rotate-180 group-hover:-translate-x-1")} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Order Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-4xl border-none shadow-2xl overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
                    <div className="relative">
                        {/* Header Gradient */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-purple-500/5 h-32" />

                        <div className="relative p-8 space-y-8">
                            <DialogHeader className={cn(isRtl ? "text-right" : "text-left")}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">
                                        {t('orderDetails')}
                                    </DialogTitle>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
                                    <span className="bg-secondary/50 px-3 py-1 rounded-full">{t('orderNumber')} #{selectedOrder?.id}</span>
                                    {selectedOrder && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            {new Date(selectedOrder.createdAt).toLocaleString(locale as string, { dateStyle: 'medium', timeStyle: 'short' })}
                                        </span>
                                    )}
                                </div>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Items Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-muted-foreground">
                                        <Package size={16} />
                                        {t('items')}
                                    </div>
                                    <div className="space-y-3">
                                        {selectedOrder?.products.map((item) => (
                                            <div key={item.id} className="bg-secondary/20 p-4 rounded-2xl border border-border/50 group hover:bg-secondary/40 transition-colors">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1">
                                                        <p className="font-black text-foreground uppercase tracking-tight">
                                                            {isRtl ? item.product.nameAr || item.product.name : item.product.name}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.size && (
                                                                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase">
                                                                    {tRoot(item.size.name)}
                                                                </span>
                                                            )}
                                                            {item.extras?.map((extra, idx) => (
                                                                <span key={idx} className="text-[10px] font-bold bg-secondary text-muted-foreground px-2 py-0.5 rounded-md uppercase">
                                                                    + {tRoot(extra.name)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-muted-foreground uppercase">{t('quantity')} x{item.quantity}</p>
                                                        <p className="font-black text-primary tracking-tighter">
                                                            {formatCurrency((item.product.basePrice + (item.size?.price || 0) + (item.extras?.reduce((sum, e) => sum + e.price, 0) || 0)) * item.quantity, locale as string)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>

                                {/* Summary & Delivery Section */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-muted-foreground">
                                            <CreditCard size={16} />
                                            {t('orderSummary')}
                                        </div>
                                        <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-3 shadow-sm">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span className="text-muted-foreground">{t('subTotal')}</span>
                                                <span className="font-bold">{formatCurrency(selectedOrder?.subTotal || 0, locale as string)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-medium">
                                                <span className="text-muted-foreground">{t('deliveryFee')}</span>
                                                <span className="font-bold">{formatCurrency(selectedOrder?.deliveryFee || 0, locale as string)}</span>
                                            </div>
                                            <div className="h-px bg-border/50 my-2" />
                                            <div className="flex justify-between items-center pt-1">
                                                <span className="font-black uppercase tracking-wider text-sm">{t('total')}</span>
                                                <span className="text-2xl font-black text-primary tracking-tighter">{formatCurrency(selectedOrder?.totalPrice || 0, locale as string)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-muted-foreground">
                                            <MapPin size={16} />
                                            {t('deliveryInformation')}
                                        </div>
                                        <div className="bg-secondary/20 rounded-2xl p-5 space-y-4 border border-border/50">
                                            <div className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center border border-border/50 text-muted-foreground">
                                                    <MapPin size={16} />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-black uppercase tracking-tighter mb-1 text-muted-foreground text-[10px]">{t('address')}</p>
                                                    <p className="font-bold leading-tight">
                                                        {selectedOrder?.streetAddress}, {selectedOrder?.city}<br />
                                                        {selectedOrder?.postalCode}, {selectedOrder?.country}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center border border-border/50 text-muted-foreground">
                                                    <Phone size={16} />
                                                </div>
                                                <div className="text-sm">
                                                    <p className="font-black uppercase tracking-tighter mb-1 text-muted-foreground text-[10px]">{t('phone')}</p>
                                                    <p className="font-bold">{selectedOrder?.phone}</p>
                                                </div>
                                            </div>
                                            {selectedOrder?.notes && (
                                                <div className="flex items-start gap-4 pt-2">
                                                    <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center border border-border/50 text-muted-foreground">
                                                        <Info size={16} />
                                                    </div>
                                                    <div className="text-sm">
                                                        <p className="font-black uppercase tracking-tighter mb-1 text-muted-foreground text-[10px]">{t('notes')}</p>
                                                        <p className="font-medium italic text-muted-foreground">{selectedOrder.notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UserOrders
