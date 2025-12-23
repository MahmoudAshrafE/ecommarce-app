'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, Loader2, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "@/lib/formaters"
import { toast } from '@/components/ui/use-toast'

interface OrderProduct {
    id: string
    quantity: number
    product: {
        name: string
        basePrice: number
    }
    size?: {
        name: string
        price: number
    }
    extras: {
        id: string
        name: string
        price: number
    }[]
}

interface Order {
    id: string
    userEmail: string
    totalPrice: number
    status: string
    paid: boolean
    createdAt: string
    streetAddress: string
    city: string
    products: OrderProduct[]
}

const ORDER_STATUSES = [
    "PENDING",
    "PREPARING",
    "ON_WAY",
    "DELIVERED",
    "CANCELLED"
]

const OrdersPage = () => {
    const { locale } = useParams()
    const t = useTranslations()
    const isRtl = locale === 'ar'
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/admin/orders')
            if (response.ok) {
                const data = await response.json()
                setOrders(data)
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                toast({ description: t('admin.orders.updatedStatus') })
            } else {
                fetchOrders() // Rollback
                toast({ variant: 'destructive', description: t('admin.orders.failedUpdate') })
            }
        } catch (error) {
            console.error('Error updating status:', error)
            fetchOrders() // Rollback
        }
    }

    const togglePaid = async (orderId: string, currentPaid: boolean) => {
        try {
            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, paid: !currentPaid } : o))

            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paid: !currentPaid })
            })

            if (response.ok) {
                toast({ description: t('admin.orders.updatedPayment') })
            } else {
                fetchOrders() // Rollback
            }
        } catch (error) {
            console.error('Error updating payment:', error)
            fetchOrders() // Rollback
        }
    }

    const openDetails = (order: Order) => {
        setSelectedOrder(order)
        setDetailsOpen(true)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            case 'PREPARING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'ON_WAY': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'DELIVERED': return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'CANCELLED': return 'bg-destructive/10 text-destructive border-destructive/20'
            default: return 'bg-secondary text-secondary-foreground'
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="table-container">
                <Table className={isRtl ? 'text-right' : 'text-left'}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('admin.orders.orderId')}</TableHead>
                            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('admin.orders.user')}</TableHead>
                            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('admin.orders.date')}</TableHead>
                            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('admin.orders.total')}</TableHead>
                            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('admin.orders.paid')}</TableHead>
                            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('admin.orders.status')}</TableHead>
                            <TableHead className={isRtl ? 'text-left' : 'text-right'}>{t('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    {t('admin.orders.noOrdersFound')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {order.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <div className={`flex flex-col ${isRtl ? 'items-end' : 'items-start'}`}>
                                            <span className="font-medium text-sm">{order.userEmail}</span>
                                            <span className="text-xs text-muted-foreground">{order.city}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(order.createdAt).toLocaleDateString(locale as string)}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {formatCurrency(order.totalPrice)}
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => togglePaid(order.id, order.paid)}>
                                            {order.paid ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onValueChange={(val) => handleStatusChange(order.id, val)}
                                        >
                                            <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold border ${getStatusColor(order.status)} ${isRtl ? 'flex-row-reverse' : ''}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ORDER_STATUSES.map(status => (
                                                    <SelectItem key={status} value={status} className={`text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
                                                        {t(`statuses.${status}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className={isRtl ? 'text-left' : 'text-right'}>
                                        <Button variant="ghost" size="icon" onClick={() => openDetails(order)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('admin.orders.orderDetails')}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground mb-1">{t('admin.orders.customer')}</p>
                                    <p className="font-medium">{selectedOrder.userEmail}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1">{t('admin.orders.date')}</p>
                                    <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString(locale as string)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1">{t('admin.orders.address')}</p>
                                    <p className="font-medium">{selectedOrder.streetAddress}, {selectedOrder.city}</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-3">
                                <p className="text-sm font-semibold border-b pb-2">{t('admin.orders.items')}</p>
                                {selectedOrder.products.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-sm bg-secondary/20 p-3 rounded-lg">
                                        <div className={isRtl ? 'text-right' : 'text-left'}>
                                            <p className="font-medium">
                                                {item.product.name}
                                                {item.size && <span className="text-xs text-muted-foreground ml-1">({item.size.name})</span>}
                                            </p>
                                            {item.extras.length > 0 && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    + {item.extras.map(e => e.name).join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`text-right ${isRtl ? 'mr-auto ml-0' : 'ml-auto'}`}>
                                            <p className="font-medium">x{item.quantity}</p>
                                            <p className="text-xs text-muted-foreground">{formatCurrency((item.size?.price || item.product.basePrice) * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="pt-4 border-t flex justify-between items-center font-bold text-lg">
                                <span>{t('admin.orders.total')}</span>
                                <span>{formatCurrency(selectedOrder.totalPrice)}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default OrdersPage
