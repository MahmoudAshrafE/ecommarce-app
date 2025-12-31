'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from "@/lib/formaters"
import { Package, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ui/loader"

interface Order {
    id: string
    totalPrice: number
    status: string
    paid: boolean
    createdAt: string
    products: {
        quantity: number
        product: {
            name: string
        }
    }[]
}

import { useTranslations } from 'next-intl'

const UserOrders = () => {
    const t = useTranslations('profile')
    const tStatus = useTranslations('statuses')
    const tPayment = useTranslations('paymentStatuses')
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

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
            <p className="text-muted-foreground">{t('noOrdersYet')}</p>
        </div>
    )

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">{t('recentOrders')}</h3>
            <div className="grid gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">{t('orderNumber')} #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className={`${getStatusColor(order.status)} border-none px-3 py-1 font-semibold`}>
                                {tStatus(order.status)}
                            </Badge>
                            {order.paid ? (
                                <Badge className="bg-green-500/10 text-green-500 border-none px-3 py-1 font-semibold">
                                    {tPayment('PAID')}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="px-3 py-1 font-semibold">
                                    {tPayment('UNPAID')}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6">
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">{t('totalAmount')}</p>
                                <p className="font-bold text-primary text-lg">{formatCurrency(order.totalPrice)}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserOrders
