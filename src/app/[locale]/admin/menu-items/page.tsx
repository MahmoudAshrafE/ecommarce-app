'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, ExternalLink, Camera, X } from 'lucide-react'
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
    nameAr: string | null
}

interface Product {
    id: string
    name: string
    nameAr: string | null
    description: string
    descriptionAr: string | null
    basePrice: number
    image: string
    categoryId: string | null
    category?: Category
    sizes: { id: string; name: string; price: number }[]
    extras: { id: string; name: string; price: number }[]
}

const PRODUCT_SIZES = ['SMALL', 'MEDIUM', 'LARGE'] as const
const PRODUCT_EXTRAS = ['ONION', 'TOMATO', 'CHEESE', 'POTATO', 'CURROTS'] as const

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
    const [uploading, setUploading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        nameAr: '',
        description: '',
        descriptionAr: '',
        basePrice: '',
        image: '',
        categoryId: '',
        sizes: [] as { name: string; price: string }[],
        extras: [] as { name: string; price: string }[]
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

        if (!formData.image) {
            toast({
                variant: 'destructive',
                title: t('messages.error'),
                description: t('admin.menu-items.form.image.validation.required')
            })
            return
        }

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            })

            if (res.ok) {
                const { url } = await res.json()
                setFormData(prev => ({ ...prev, image: url }))
                toast({
                    title: t('messages.success'),
                    description: t('messages.imageUploaded')
                })
            } else {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            toast({
                variant: 'destructive',
                title: t('messages.error'),
                description: error instanceof Error ? error.message : t('messages.unexpectedError')
            })
        } finally {
            setUploading(false)
        }
    }

    const resetForm = () => {
        setEditingProduct(null)
        setFormData({
            name: '',
            nameAr: '',
            description: '',
            descriptionAr: '',
            basePrice: '',
            image: '',
            categoryId: '',
            sizes: [{ name: 'SMALL', price: '' }],
            extras: []
        })
    }

    const openEditDialog = (product: Product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            nameAr: product.nameAr || '',
            description: product.description,
            descriptionAr: product.descriptionAr || '',
            basePrice: product.basePrice.toString(),
            image: product.image,
            categoryId: product.categoryId || '',
            sizes: product.sizes?.map(s => ({ name: s.name, price: s.price.toString() })) || [],
            extras: product.extras?.map(e => ({ name: e.name, price: e.price.toString() })) || []
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
                            dir={isRtl ? 'rtl' : 'ltr'}
                            className={`bg-secondary/20 rounded-lg sm:rounded-xl border border-border overflow-hidden flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}
                        >
                            <div className="relative h-40 sm:h-48 bg-white/5 p-4 flex items-center justify-center group/image">
                                <Link
                                    href={`/${locale}/menu/${product.id}`}
                                    className="h-full w-full flex items-center justify-center transition-transform duration-300 group-hover/image:scale-105"
                                >
                                    {product.image && (product.image.startsWith('/') || product.image.startsWith('http')) ? (
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                        <ExternalLink className="w-8 h-8 text-white" />
                                    </div>
                                </Link>
                                <div className="absolute top-2 end-2 flex gap-1 sm:gap-2 z-10">
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
                                <div className="flex justify-between items-start gap-2">
                                    <Link href={`/${locale}/menu/${product.id}`} className="flex-1">
                                        <h3 className={`font-semibold text-base sm:text-lg line-clamp-1 hover:text-primary transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>
                                            {isRtl ? product.nameAr || product.name : product.name}
                                        </h3>
                                    </Link>
                                    <span className="font-bold text-primary text-sm sm:text-base whitespace-nowrap">
                                        {formatCurrency(product.basePrice, locale as string)}
                                    </span>
                                </div>
                                <p className={`text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {isRtl ? product.descriptionAr || product.description : product.description}
                                </p>
                                {product.category && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full w-fit">
                                        {isRtl ? product.category.nameAr || product.category.name : product.category.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
                    <DialogHeader className={isRtl ? 'text-right sm:text-right' : 'text-left'}>
                        <DialogTitle className={`text-base sm:text-lg ${isRtl ? 'text-right' : ''}`}>
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
                                    {t('admin.menu-items.form.nameAr.label')}
                                </label>
                                <Input
                                    value={formData.nameAr}
                                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                    required
                                    dir="rtl"
                                    className="h-10 text-right"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    {t('admin.menu-items.form.basePrice.label')}
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.basePrice}
                                    required
                                    className="h-10"
                                    onChange={(e) => {
                                        const price = e.target.value
                                        setFormData(prev => ({
                                            ...prev,
                                            basePrice: price,
                                            sizes: prev.sizes.map(s => s.name === 'SMALL' ? { ...s, price } : s)
                                        }))
                                    }}
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
                                                {isRtl ? c.nameAr || c.name : c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    {t('admin.menu-items.form.descriptionAr.label')}
                                </label>
                                <Textarea
                                    value={formData.descriptionAr}
                                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                    required
                                    dir="rtl"
                                    className="min-h-20 text-right"
                                />
                            </div>
                        </div>

                        {/* Sizes Section */}
                        <div className="space-y-4 border-t border-border pt-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold uppercase tracking-wider text-primary">
                                    {t('sizes')}
                                </label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={formData.sizes.length >= PRODUCT_SIZES.length}
                                    onClick={() => {
                                        const availableSizes = PRODUCT_SIZES.filter(s => !formData.sizes.find(sz => sz.name === s))
                                        if (availableSizes.length === 0) return
                                        setFormData({
                                            ...formData,
                                            sizes: [...formData.sizes, { name: availableSizes[0], price: '' }]
                                        })
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {t('add')}
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {formData.sizes.map((size, index) => (
                                    <div key={index} className="flex gap-2 items-end bg-secondary/10 p-3 rounded-lg border border-border/50">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">{t('size')}</label>
                                            <Select
                                                value={size.name}
                                                onValueChange={(val) => {
                                                    const newSizes = [...formData.sizes]
                                                    newSizes[index].name = val
                                                    setFormData({ ...formData, sizes: newSizes })
                                                }}
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PRODUCT_SIZES
                                                        .filter(s => s === size.name || !formData.sizes.find(sz => sz.name === s))
                                                        .map(s => (
                                                            <SelectItem key={s} value={s}>{t(s)}</SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-32 space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">{t('admin.menu-items.form.basePrice.label')}</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={size.price}
                                                onChange={(e) => {
                                                    const newSizes = [...formData.sizes]
                                                    newSizes[index].price = e.target.value
                                                    setFormData({ ...formData, sizes: newSizes })
                                                }}
                                                disabled={size.name === 'SMALL'}
                                                className="h-9"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-destructive"
                                            onClick={() => {
                                                const newSizes = formData.sizes.filter((_, i) => i !== index)
                                                setFormData({ ...formData, sizes: newSizes })
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Extras Section */}
                        <div className="space-y-4 border-t border-border pt-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold uppercase tracking-wider text-primary">
                                    {t('extrasIngredients')}
                                </label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={formData.extras.length >= PRODUCT_EXTRAS.length}
                                    onClick={() => {
                                        const availableExtras = PRODUCT_EXTRAS.filter(e => !formData.extras.find(ex => ex.name === e))
                                        if (availableExtras.length === 0) return
                                        setFormData({
                                            ...formData,
                                            extras: [...formData.extras, { name: availableExtras[0], price: '' }]
                                        })
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {t('add')}
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {formData.extras.map((extra, index) => (
                                    <div key={index} className="flex gap-2 items-end bg-secondary/10 p-3 rounded-lg border border-border/50">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">{t('extras')}</label>
                                            <Select
                                                value={extra.name}
                                                onValueChange={(val) => {
                                                    const newExtras = [...formData.extras]
                                                    newExtras[index].name = val
                                                    setFormData({ ...formData, extras: newExtras })
                                                }}
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PRODUCT_EXTRAS
                                                        .filter(e => e === extra.name || !formData.extras.find(ex => ex.name === e))
                                                        .map(e => (
                                                            <SelectItem key={e} value={e}>{t(e)}</SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-32 space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">{t('admin.menu-items.form.basePrice.label')}</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={extra.price}
                                                onChange={(e) => {
                                                    const newExtras = [...formData.extras]
                                                    newExtras[index].price = e.target.value
                                                    setFormData({ ...formData, extras: newExtras })
                                                }}
                                                className="h-9"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-destructive"
                                            onClick={() => {
                                                const newExtras = formData.extras.filter((_, i) => i !== index)
                                                setFormData({ ...formData, extras: newExtras })
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {t('admin.menu-items.form.image.label')}
                            </label>
                            <div className="flex flex-col gap-4">
                                {formData.image && (
                                    <div className="relative w-full h-40 bg-secondary/20 rounded-xl overflow-hidden group flex items-center justify-center">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Invalid+URL'
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label htmlFor="item-image-upload" className="cursor-pointer bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors">
                                                <Camera className="w-6 h-6 text-white" />
                                            </label>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder={t('admin.menu-items.form.image.placeholder')}
                                        required
                                        className="h-10 flex-1"
                                    />
                                    <div className="relative">
                                        <input
                                            id="item-image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-10 gap-2"
                                            disabled={uploading}
                                            onClick={() => document.getElementById('item-image-upload')?.click()}
                                        >
                                            {uploading
                                                ? t('profile.uploadingImage')
                                                : formData.image
                                                    ? t('profile.changeImage')
                                                    : t('profile.uploadImage')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
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
                <AlertDialogContent dir={isRtl ? 'rtl' : 'ltr'}>
                    <AlertDialogHeader className={isRtl ? 'text-right' : 'text-left'}>
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
