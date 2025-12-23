'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/formaters'
import { toast } from '@/components/ui/use-toast'

interface Category {
    id: string
    name: string
}

interface Product {
    id: string
    name: string
    description: string
    basePrice: number
    image: string
    categoryId: string | null
    category?: Category
}

const MenuItemsPage = () => {
    const t = useTranslations()
    const { locale } = useParams()
    const isRtl = locale === 'ar'
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        image: '',
        categoryId: ''
    })

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('/api/admin/menu-items'),
                fetch('/api/admin/categories')
            ])

            if (productsRes.ok && categoriesRes.ok) {
                const productsData = await productsRes.json()
                const categoriesData = await categoriesRes.json()
                setProducts(productsData)
                setCategories(categoriesData)
            }
        } catch (error) {
            console.error('Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const url = editingProduct
                ? `/api/admin/menu-items/${editingProduct.id}`
                : '/api/admin/menu-items'

            const method = editingProduct ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                await fetchData()
                setIsDialogOpen(false)
                resetForm()
                toast({
                    description: editingProduct
                        ? t('messages.updateProductSucess')
                        : t('messages.productAdded')
                })
            }
        } catch (error) {
            console.error('Error saving product:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingProductId) return

        try {
            const response = await fetch(`/api/admin/menu-items/${deletingProductId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setProducts(products.filter((p: Product) => p.id !== deletingProductId))
                toast({
                    description: t('messages.deleteProductSucess')
                })
            }
        } catch (error) {
            console.error('Error deleting product:', error)
        } finally {
            setIsDeleteDialogOpen(false)
            setDeletingProductId(null)
        }
    }

    const openDeleteDialog = (id: string) => {
        setDeletingProductId(id)
        setIsDeleteDialogOpen(true)
    }

    const resetForm = () => {
        setEditingProduct(null)
        setFormData({
            name: '',
            description: '',
            basePrice: '',
            image: '',
            categoryId: ''
        })
    }

    const openEditDialog = (product: Product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            description: product.description,
            basePrice: product.basePrice.toString(),
            image: product.image,
            categoryId: product.categoryId || ''
        })
        setIsDialogOpen(true)
    }

    const openAddDialog = () => {
        resetForm()
        setIsDialogOpen(true)
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="bg-card rounded-xl sm:rounded-2xl border border-border shadow-sm p-4 sm:p-6">
            <div className={`flex flex-col sm:flex-row ${isRtl ? 'justify-start' : 'justify-end'} items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6`}>
                <Button onClick={openAddDialog} className="w-full sm:w-auto" size="sm">
                    <Plus className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    <span className="hidden sm:inline">{t('admin.menu-items.createNewMenuItem')}</span>
                    <span className="sm:hidden">{t('add')}</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground py-8 text-sm sm:text-base">
                        {t('noProductsFound')}
                    </div>
                ) : (
                    products.map((product: Product) => (
                        <div
                            key={product.id}
                            className={`bg-secondary/20 rounded-lg sm:rounded-xl border border-border overflow-hidden flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}
                        >
                            <div className="relative h-40 sm:h-48 bg-white/5 p-4 flex items-center justify-center group/image">
                                <Link
                                    href={`/${locale}/menu/${product.id}`}
                                    className="h-full w-full flex items-center justify-center transition-transform duration-300 group-hover/image:scale-105"
                                >
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full object-contain"
                                        />
                                    ) : (
                                        <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                        <ExternalLink className="w-8 h-8 text-white" />
                                    </div>
                                </Link>
                                <div className={`absolute top-2 ${isRtl ? 'start-2' : 'end-2'} flex gap-1 sm:gap-2 z-10`}>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-7 w-7 sm:h-8 sm:w-8"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            openEditDialog(product)
                                        }}
                                    >
                                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:bg-destructive/10"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            openDeleteDialog(product.id)
                                        }}
                                    >
                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
                                <div className={`flex justify-between items-start gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <Link href={`/${locale}/menu/${product.id}`} className="flex-1">
                                        <h3 className={`font-semibold text-base sm:text-lg line-clamp-1 hover:text-primary transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <span className="font-bold text-primary text-sm sm:text-base whitespace-nowrap">
                                        {formatCurrency(product.basePrice, locale as string)}
                                    </span>
                                </div>
                                <p className={`text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {product.description}
                                </p>
                                {product.category && (
                                    <span className={`text-xs bg-primary/10 text-primary px-2 py-1 rounded-full w-fit ${isRtl ? 'mr-auto ml-0' : ''}`}>
                                        {product.category.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">
                            {editingProduct ? t('edit') : t('create')} {t('admin.tabs.menuItems')}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {t('admin.menu-items.form.name.label')}
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {t('admin.menu-items.form.basePrice.label')}
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.basePrice}
                                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                    required
                                    className="h-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {t('admin.menu-items.form.description.label')}
                            </label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                className="min-h-20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {t('admin.menu-items.form.image.label')}
                            </label>
                            <Input
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder={t('admin.menu-items.form.image.placeholder')}
                                required
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {t('admin.menu-items.form.category.label')}
                            </label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                            >
                                <SelectTrigger className={`h-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <SelectValue placeholder={t('admin.menu-items.form.category.placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c: Category) => (
                                        <SelectItem key={c.id} value={c.id} className={isRtl ? 'text-right' : ''}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="w-full sm:w-auto">{t('cancel')}</Button>
                            </DialogClose>
                            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('messages.productDeleteConfirm')}</AlertDialogTitle>
                        <AlertDialogDescription className={isRtl ? 'text-right' : 'text-left'}>
                            {t('messages.productDeleteDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className={isRtl ? 'flex-row-reverse gap-2' : ''}>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default MenuItemsPage
