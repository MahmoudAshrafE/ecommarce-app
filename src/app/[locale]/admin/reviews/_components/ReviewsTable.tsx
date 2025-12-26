'use client'

import { useTranslations } from 'next-intl'
import { Star, Trash2 } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import DeleteModal from '@/components/ui/delete-modal'
import { toast } from '@/components/ui/use-toast'

import UserAvatar from '@/components/ui/user-avatar'

interface Review {
    id: string
    comment: string
    rating: number
    createdAt: Date
    user: {
        name: string | null
        image: string | null
    }
    product: {
        name: string
    }
}

interface ReviewsTableProps {
    reviews: Review[]
}

const ReviewsTable = ({ reviews }: ReviewsTableProps) => {
    const t = useTranslations('admin.reviews')
    const { locale } = useParams()
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const isRtl = locale === 'ar'

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            setLoadingId(deleteId)
            const res = await fetch(`/api/reviews/${deleteId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast({
                    description: t('deleteSuccess') || 'Review deleted successfully'
                })
                router.refresh()
                setDeleteId(null)
            } else {
                const error = await res.text()
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error || 'Failed to delete review'
                })
            }
        } catch (error) {
            console.error(error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Something went wrong'
            })
        } finally {
            setLoadingId(null)
        }
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-dashed">
                {t('noReviewsFound')}
            </div>
        )
    }

    return (
        <>
            <DeleteModal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                loading={!!loadingId}
            />

            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground border-b border-border">
                        <tr className={isRtl ? 'flex-row-reverse' : ''}>
                            <th className={`px-6 py-4 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t('user')}</th>
                            <th className={`px-6 py-4 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t('product')}</th>
                            <th className={`px-6 py-4 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t('rating')}</th>
                            <th className={`px-6 py-4 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t('comment')}</th>
                            <th className={`px-6 py-4 font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{t('date')}</th>
                            <th className={`px-6 py-4 font-semibold ${isRtl ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {reviews.map((review: Review) => (
                            <tr key={review.id} className="hover:bg-secondary/20 transition-colors">
                                <td className={`px-6 py-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>
                                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <UserAvatar
                                            image={review.user.image}
                                            name={review.user.name}
                                            size="sm"
                                        />
                                        <span>{review.user.name || t('anonymous')}</span>
                                    </div>
                                </td>
                                <td className={`px-6 py-4 text-muted-foreground ${isRtl ? 'text-right' : 'text-left'}`}>{review.product.name}</td>
                                <td className={`px-6 py-4 ${isRtl ? 'flex justify-end' : ''}`}>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className={`px-6 py-4 max-w-xs truncate text-muted-foreground ${isRtl ? 'text-right' : 'text-left'}`} title={review.comment}>
                                    {review.comment}
                                </td>
                                <td className={`px-6 py-4 text-muted-foreground ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {new Date(review.createdAt).toLocaleDateString(locale as string)}
                                </td>
                                <td className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                                    <button
                                        onClick={() => setDeleteId(review.id)}
                                        disabled={loadingId === review.id}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        title={t('delete')}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ReviewsTable
