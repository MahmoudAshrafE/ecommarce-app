'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
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
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
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

            <div className="grid gap-3 sm:gap-4">
                {categories.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8 text-sm sm:text-base">{t('noCategoriesFound')}</p>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            dir={isRtl ? 'rtl' : 'ltr'}
                            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-secondary/20 rounded-lg sm:rounded-xl border border-border gap-3 sm:gap-0 ${isRtl ? 'sm:flex-row-reverse' : ''}`}
                        >
                            <div className={`flex-1 w-full sm:w-auto ${isRtl ? 'text-right' : 'text-left'}`}>
                                <h3 className="font-semibold text-base sm:text-lg">
                                    {isRtl ? category.nameAr || category.name : category.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {t('admin.categories.productsCount', { count: category._count?.products || 0 })}
                                </p>
                            </div>
                            <div className={`flex gap-2 w-full sm:w-auto ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 sm:flex-none"
                                    onClick={() => openEditDialog(category)}
                                >
                                    <Pencil className={`w-3 h-3 sm:w-4 sm:h-4 ${isRtl ? 'ml-1' : 'mr-1'}`} />
                                    <span className="sm:hidden">{t('edit')}</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 sm:flex-none text-destructive hover:text-destructive"
                                    onClick={() => openDeleteDialog(category.id)}
                                >
                                    <Trash2 className={`w-3 h-3 sm:w-4 sm:h-4 ${isRtl ? 'ml-1' : 'mr-1'}`} />
                                    <span className="sm:hidden">{t('delete')}</span>
                                </Button>
                            </div>
                        </div>
                    ))
                )}
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
                                {t('admin.categories.form.name.label')}
                            </label>
                            <Input
                                value={formData.nameAr}
                                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                placeholder="الفئة..."
                                required
                                dir="rtl"
                                className="h-10 text-right"
                            />
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
