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
import { Eye, CheckCircle, XCircle, Search, ShoppingBag, Clock, DollarSign, Package, FileText, Trash2 } from "lucide-react"
import { Loader } from "@/components/ui/loader"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/formaters"
import { toast } from '@/components/ui/use-toast'

interface OrderProduct {
    id: string
    quantity: number
    product: {
        name: string
        nameAr: string | null
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
    phone: string
    subTotal: number
    deliveryFee: number
    totalPrice: number
    status: string
    paid: boolean
    createdAt: string
    streetAddress: string
    city: string
    postalCode: string
    country: string
    notes?: string
    user?: {
        name: string
        image?: string
    }
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
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')

    // Statistics
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        revenue: orders.filter(o => o.paid).reduce((acc, current) => acc + current.totalPrice, 0)
    }

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

    useEffect(() => {
        let result = orders
        if (searchTerm) {
            result = result.filter(o =>
                o.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.id.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if (statusFilter !== 'ALL') {
            result = result.filter(o => o.status === statusFilter)
        }
        setFilteredOrders(result)
    }, [searchTerm, statusFilter, orders])

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
            fetchOrders() // Rollback
        }
    }

    const openDetails = (order: Order) => {
        setSelectedOrder(order)
        setDetailsOpen(true)
    }

    const handleDeleteOrder = async (orderId: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setOrders(orders.filter(o => o.id !== orderId))
                setDetailsOpen(false)
                toast({ description: t('admin.orders.deleteSuccess') })
            } else {
                toast({ variant: 'destructive', description: t('admin.orders.failedUpdate') })
            }
        } catch (error) {
            toast({ variant: 'destructive', description: "Failed to delete order" })
        }
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
        return <div className="flex justify-center p-8"><Loader size="lg" variant="burger" /></div>
    }

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: t('admin.orders.total'), value: stats.total, icon: ShoppingBag, color: 'blue' },
                    { label: t('admin.dashboard.pendingAttention', { count: '' }).replace(/\{count\}/g, '').split('.')[0], value: stats.pending, icon: Clock, color: 'orange' },
                    { label: t('statuses.DELIVERED'), value: stats.delivered, icon: Package, color: 'green' },
                    { label: t('admin.dashboard.totalRevenue'), value: formatCurrency(stats.revenue), icon: DollarSign, color: 'emerald' },
                ].map((stat, i) => (
                    <div key={i} className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl bg-opacity-10", {
                            "bg-blue-500 text-blue-500": stat.color === 'blue',
                            "bg-orange-500 text-orange-500": stat.color === 'orange',
                            "bg-green-500 text-green-500": stat.color === 'green',
                            "bg-emerald-500 text-emerald-500": stat.color === 'emerald',
                        })}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4", isRtl ? "right-3" : "left-3")} />
                    <Input
                        placeholder={t('admin.orders.searchPlaceholder')}
                        className={cn("h-10", isRtl ? "pr-10" : "pl-10")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['ALL', ...ORDER_STATUSES].map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'outline'}
                            size="sm"
                            className="rounded-full h-8 px-4 text-xs font-bold whitespace-nowrap"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === 'ALL' ? (isRtl ? 'الكل' : 'All') : t(`statuses.${status}`)}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 overflow-hidden">
                <div className="table-container">
                    <Table className={isRtl ? 'text-right' : 'text-left'}>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b">
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
                            {filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <Package size={64} />
                                            <p className="font-black text-xl uppercase tracking-widest">{t('admin.orders.noOrdersFound')}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="group">
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {order.id.slice(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            <div className={cn("flex flex-col", isRtl ? "items-end" : "items-start")}>
                                                <span className="font-medium text-sm">{order.userEmail}</span>
                                                <span className="text-xs text-muted-foreground">{order.city}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString(locale as string)}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {formatCurrency(order.totalPrice)}
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => togglePaid(order.id, order.paid)}
                                                className="hover:scale-110 transition-transform"
                                            >
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
                                                <SelectTrigger className={cn(
                                                    "w-[130px] h-8 text-xs font-semibold border rounded-lg",
                                                    getStatusColor(order.status),
                                                    isRtl ? "flex-row-reverse" : ""
                                                )}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ORDER_STATUSES.map(status => (
                                                        <SelectItem key={status} value={status} className={cn("text-xs", isRtl ? "text-right" : "text-left")}>
                                                            {t(`statuses.${status}`)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className={isRtl ? 'text-left' : 'text-right'}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openDetails(order)}
                                                className="group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
                    <DialogHeader className={isRtl ? 'text-right sm:text-right' : 'text-left'}>
                        <DialogTitle className={isRtl ? 'text-right' : ''}>{t('admin.orders.orderDetails')}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className={cn("space-y-6", isRtl ? "text-right" : "text-left")}>
                            {/* Customer Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-secondary/10 p-5 rounded-2xl border border-border/50">
                                <div className="col-span-1 sm:col-span-2 border-b border-border/50 pb-3 mb-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{t('admin.orders.customer')}</p>
                                    <p className="font-extrabold text-xl">{selectedOrder.user?.name || t('admin.users.anonymous')}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">{t('profile.form.email.label')}</p>
                                    <p className="font-semibold truncate">{selectedOrder.userEmail}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">{t('profile.form.phone.label')}</p>
                                    <p className="font-semibold">{selectedOrder.phone}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">{t('admin.orders.date')}</p>
                                    <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString(locale as string)}</p>
                                </div>
                                <div className="col-span-1 sm:col-span-2 pt-3 border-t border-border/50">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">{t('admin.orders.address')}</p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <div>
                                            <p className="text-muted-foreground text-[9px] font-bold uppercase">{t('profile.form.streetAddress.label')}</p>
                                            <p className="font-medium text-xs leading-relaxed">{selectedOrder.streetAddress}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-[9px] font-bold uppercase">{t('profile.form.city.label')}</p>
                                            <p className="font-medium text-xs leading-relaxed">{selectedOrder.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-[9px] font-bold uppercase">{t('profile.form.postalCode.label')}</p>
                                            <p className="font-medium text-xs leading-relaxed">{selectedOrder.postalCode}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-[9px] font-bold uppercase">{t('profile.form.country.label')}</p>
                                            <p className="font-medium text-xs leading-relaxed">{selectedOrder.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-widest border-b border-border/50 pb-2 flex items-center gap-2">
                                    <FileText size={14} className="text-primary" />
                                    {t('admin.orders.notes')}
                                </p>
                                <div className={cn(
                                    "p-4 rounded-2xl border border-border/50",
                                    selectedOrder.notes ? "bg-primary/5 border-primary/10" : "bg-secondary/20"
                                )}>
                                    <p className={cn(
                                        "text-xs leading-relaxed",
                                        selectedOrder.notes ? "font-medium italic text-foreground/80" : "text-muted-foreground italic text-center"
                                    )}>
                                        {selectedOrder.notes ? `"${selectedOrder.notes}"` : (isRtl ? 'لا توجد ملاحظات خاصة' : 'No special instructions provided')}
                                    </p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-3">
                                <p className="text-xs font-black uppercase tracking-widest border-b border-border/50 pb-2 flex items-center gap-2">
                                    <ShoppingBag size={14} className="text-primary" />
                                    {t('admin.orders.items')}
                                </p>
                                <div className="space-y-2">
                                    {selectedOrder.products.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-start text-sm bg-card border border-border/40 p-3 rounded-xl shadow-sm">
                                            <div className={isRtl ? 'text-right' : 'text-left'}>
                                                <p className="font-bold">
                                                    {isRtl ? item.product.nameAr || item.product.name : item.product.name}
                                                    {item.size && <span className="text-[10px] text-primary ml-1 font-black bg-primary/5 px-1.5 py-0.5 rounded">({item.size.name})</span>}
                                                </p>
                                                {item.extras.length > 0 && (
                                                    <p className="text-[10px] text-muted-foreground mt-1 font-medium bg-secondary/30 px-2 py-0.5 rounded-full w-fit">
                                                        + {item.extras.map(e => e.name).join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={cn("text-right", isRtl ? "mr-auto ml-0" : "ml-auto")}>
                                                <p className="font-black text-xs text-primary">x{item.quantity}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground">{formatCurrency((item.size?.price || item.product.basePrice) * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="pt-4 space-y-2 border-t border-border/50">
                                <div className={cn("flex justify-between items-center text-xs text-muted-foreground font-bold uppercase tracking-tighter", isRtl ? "flex-row-reverse" : "")}>
                                    <span>{t('cart.subtotal')}</span>
                                    <span>{formatCurrency(selectedOrder.subTotal)}</span>
                                </div>
                                <div className={cn("flex justify-between items-center text-xs text-muted-foreground font-bold uppercase tracking-tighter", isRtl ? "flex-row-reverse" : "")}>
                                    <span>{t('cart.delivery')}</span>
                                    <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                                </div>
                                <div className={cn("pt-2 flex justify-between items-center border-t-2 border-dashed", isRtl ? "flex-row-reverse" : "")}>
                                    <span className="font-black text-sm uppercase tracking-tighter text-muted-foreground">{t('admin.orders.total')}</span>
                                    <span className="font-black text-2xl tracking-tighter text-primary">{formatCurrency(selectedOrder.totalPrice)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-border/50 flex justify-end">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2 font-bold rounded-xl"
                                    onClick={() => {
                                        setOrderToDelete(selectedOrder.id)
                                        setDeleteOpen(true)
                                    }}
                                >
                                    <Trash2 size={16} />
                                    {t('delete')}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent dir={isRtl ? 'rtl' : 'ltr'}>
                    <AlertDialogHeader className={isRtl ? 'text-right' : 'text-left'}>
                        <AlertDialogTitle>{t('messages.orderDeleteConfirm')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('messages.orderDeleteDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className={cn("flex items-center gap-2", isRtl ? "flex-row-reverse" : "")}>
                        <AlertDialogCancel className="font-bold rounded-xl">{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold rounded-xl"
                            onClick={() => orderToDelete && handleDeleteOrder(orderToDelete)}
                        >
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default OrdersPage
