
'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea' // Assuming this exists or I use standard
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from '@/components/ui/use-toast'

const ReviewForm = ({ productId }: { productId: string }) => {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const t = useTranslations()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment
                })
            })

            if (res.ok) {
                setComment('')
                setRating(5)
                router.refresh()
                toast({
                    title: t('messages.success') || 'Success',
                    description: 'Review submitted successfully'
                })
            } else {
                const data = await res.json().catch(() => ({}));
                toast({
                    variant: 'destructive',
                    title: t('messages.error') || 'Error',
                    description: data.error || 'Failed to submit review'
                })
            }
        } catch (error: any) {
            console.error(error)
            toast({
                variant: 'destructive',
                title: t('messages.error') || 'Error',
                description: error.message || 'Failed to submit review'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">{t('reviews.rating')}</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        >
                            <Star
                                className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${star <= rating ? 'fill-primary text-primary' : 'text-gray-200 dark:text-gray-700'}`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">{t('reviews.comment')}</label>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('reviews.placeholder')}
                    required
                    className="min-h-[120px] bg-background resize-none"
                />
            </div>

            <Button loading={isSubmitting} type="submit" size="lg" className="w-full md:w-auto font-bold">
                {t('reviews.submit')}
            </Button>
        </form>
    )
}

export default ReviewForm
