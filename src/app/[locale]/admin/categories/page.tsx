'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Loader } from "@/components/ui/loader"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { toast } from '@/components/ui/use-toast'
import { useParams } from 'next/navigation'

interface Category {
    id: string
    name: string
    nameAr: string | null
    _count?: {
        products: number
    }
}

const CategoriesPage = () => {
    const { locale } = useParams()
    const t = useTranslations()
    const isRtl = locale === 'ar'
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: '', nameAr: '' })
    const [submitting, setSubmitting] = useState(false)

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories')
            if (response.ok) {
                const data = await response.json()
                setCategories(data)
            }
        } catch (error) {
            console.error('Failed to fetch categories')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const url = editingCategory
                ? `/api/admin/categories/${editingCategory.id}`
                : '/api/admin/categories'

            const method = editingCategory ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                await fetchCategories()
                setIsDialogOpen(false)
                setEditingCategory(null)
                setFormData({ name: '', nameAr: '' })
                toast({
                    description: editingCategory
                        ? t('messages.updatecategorySucess')
                        : t('messages.categoryAdded')
                })
            }
        } catch (error) {
            console.error('Error saving category:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingCategoryId) return

        try {
            const response = await fetch(`/api/admin/categories/${deletingCategoryId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setCategories(categories.filter(c => c.id !== deletingCategoryId))
                toast({
                    description: t('messages.deleteCategorySucess')
                })
            }
        } catch (error) {
            console.error('Error deleting category:', error)
        } finally {
            setIsDeleteDialogOpen(false)
            setDeletingCategoryId(null)
        }
    }

    const openDeleteDialog = (id: string) => {
        setDeletingCategoryId(id)
        setIsDeleteDialogOpen(true)
    }

    const openEditDialog = (category: Category) => {
        setEditingCategory(category)
        setFormData({ name: category.name, nameAr: category.nameAr || '' })
        setIsDialogOpen(true)
    }

    const openAddDialog = () => {
        setEditingCategory(null)
        setFormData({ name: '', nameAr: '' })
        setIsDialogOpen(true)
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader size="lg" variant="burger" /></div>
    }

    return (
        <div className="bg-card rounded-xl sm:rounded-2xl border border-border shadow-sm p-4 sm:p-6">
            <div className={`flex flex-col sm:flex-row ${isRtl ? 'justify-start' : 'justify-end'} items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6`}>
                <Button onClick={openAddDialog} className="w-full sm:w-auto" size="sm">
                    <Plus className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    <span className="hidden sm:inline">{t('admin.categories.createCategory')}</span>
                    <span className="sm:hidden">{t('add')}</span>
                </Button>
            </div>

            <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40">
                            <tr className="border-b border-border">
                                <th className={`p-4 font-semibold text-muted-foreground ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {t('category')}
                                </th>
                                <th className={`p-4 font-semibold text-muted-foreground ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {t('admin.dashboard.totalProducts')}
                                </th>
                                <th className={`p-4 font-semibold text-muted-foreground ${isRtl ? 'text-left' : 'text-right'}`}>
                                    {t('actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                                    <td className={`p-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>
                                        <div className="flex flex-col">
                                            <span className="text-foreground text-base">{isRtl ? category.nameAr || category.name : category.name}</span>
                                            {category.nameAr && <span className="text-xs text-muted-foreground">{isRtl ? category.name : category.nameAr}</span>}
                                        </div>
                                    </td>
                                    <td className={`p-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {category._count?.products || 0}
                                        </span>
                                    </td>
                                    <td className={`p-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                                        <div className={`flex items-center gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                                                onClick={() => openEditDialog(category)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => openDeleteDialog(category.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-muted-foreground">
                                        {t('noCategoriesFound')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Grid View */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                    {categories.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">{t('noCategoriesFound')}</p>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-card rounded-xl p-4 border border-border shadow-sm active:scale-[0.99] transition-transform"
                                dir={isRtl ? 'rtl' : 'ltr'}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg text-foreground">
                                            {isRtl ? category.nameAr || category.name : category.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="bg-secondary px-2 py-0.5 rounded-md">
                                                {isRtl ? category.name : category.nameAr}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                        {category._count?.products || 0} {t('admin.dashboard.totalProducts').split(' ')[1]}
                                    </span>
                                </div>

                                <div className={`flex gap-3 pt-3 border-t border-border/50 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 hover:bg-secondary/50 hover:border-primary/30 transition-colors"
                                        onClick={() => openEditDialog(category)}
                                    >
                                        <Pencil className={`w-3.5 h-3.5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                                        {t('edit')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                                        onClick={() => openDeleteDialog(category.id)}
                                    >
                                        <Trash2 className={`w-3.5 h-3.5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                                        {t('delete')}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit/Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
                    <DialogHeader className={isRtl ? 'text-right sm:text-right' : 'text-left'}>
                        <DialogTitle className={`text-base sm:text-lg ${isRtl ? 'text-right' : ''}`}>
                            {editingCategory ? t('admin.categories.editCategory') : t('admin.categories.createCategory')}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className={`text-sm font-medium block ${isRtl ? 'text-right' : ''}`}>
                                {t('admin.categories.form.name.label')}
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={t('admin.categories.form.name.placeholder')}
                                required
                                className={`h-10 ${isRtl ? 'text-right' : ''}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-sm font-medium block ${isRtl ? 'text-right' : ''}`}>
                                {t('admin.categories.form.nameAr.label')}
                            </label>
                            <Input
                                value={formData.nameAr}
                                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                placeholder={t('admin.categories.form.nameAr.placeholder')}
                                required
                                dir="rtl"
                                className="h-10 text-right"
                            />
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="w-full sm:w-auto">{t('cancel')}</Button>
                            </DialogClose>
                            <Button type="submit" loading={submitting} className="w-full sm:w-auto">
                                {t('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent dir={isRtl ? 'rtl' : 'ltr'}>
                    <AlertDialogHeader className={isRtl ? 'text-right' : 'text-left'}>
                        <AlertDialogTitle>{t('messages.categoryDeleteConfirm')}</AlertDialogTitle>
                        <AlertDialogDescription className={isRtl ? 'text-right' : 'text-left'}>
                            {isRtl ? 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف هذه الفئة نهائيًا.' : 'This action cannot be undone. This will permanently delete the category.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
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

export default CategoriesPage
