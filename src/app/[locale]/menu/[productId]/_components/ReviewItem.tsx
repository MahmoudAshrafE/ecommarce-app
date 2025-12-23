
'use client'

import { Review, User } from '@/generated/prisma/client'
import { Star, Trash2, User as UserIcon, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/ui/use-toast'
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

type ReviewWithUser = Review & {
    user: User
}

const ReviewItem = ({ review }: { review: ReviewWithUser }) => {
    const t = useTranslations('admin.reviews')
    const { data: session } = useSession()
    const router = useRouter()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const res = await fetch(`/api/reviews/${review.id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast({
                    description: t('deleteSuccess') || 'Review deleted successfully'
                })
                router.refresh()
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
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const canDelete = session?.user?.role === 'ADMIN' || session?.user?.id === review.userId

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md group">
            <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteTitle') || 'Delete Review'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('deleteConfirm') || 'Are you sure you want to delete your review?'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>{t('cancel') || 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {t('deleting') || 'Deleting...'}
                                </div>
                            ) : (
                                t('delete') || 'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                        {review.user.image ? (
                            <img src={review.user.image} alt={review.user.name || ''} className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-5 h-5" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                        <div className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US')}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>
                    {canDelete && (
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={isDeleting}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded-full"
                            title="Delete Review"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-gray-700 leading-relaxed pl-[52px]">
                {review.comment}
            </p>
        </div>
    )
}

export default ReviewItem
