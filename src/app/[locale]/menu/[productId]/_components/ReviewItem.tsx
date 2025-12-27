
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

import UserAvatar from '@/components/ui/user-avatar'

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
        <div className="bg-card dark:bg-secondary/10 p-4 sm:p-6 rounded-xl shadow-sm border border-border/50 transition-all hover:shadow-md group">
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        image={review.user.image}
                        name={review.user.name}
                    />
                    <div>
                        <h4 className="font-semibold text-foreground">{review.user.name}</h4>
                        <div className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString('en-US')}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 pl-[52px] sm:pl-0">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`}
                            />
                        ))}
                    </div>
                    {canDelete && (
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={isDeleting}
                            className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-2 text-destructive hover:bg-destructive/10 rounded-full"
                            title="Delete Review"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-foreground/80 leading-relaxed pl-0 sm:pl-[52px] text-sm sm:text-base">
                {review.comment}
            </p>
        </div>
    )
}

export default ReviewItem
