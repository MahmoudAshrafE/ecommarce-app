
'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea' // Assuming this exists or I use standard
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

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
            } else {
                // error handling
                alert('Failed to submit review')
            }
        } catch (error) {
            console.error(error)
            alert('Failed to submit review')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4">{t('reviews.writeReview')}</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">{t('reviews.rating')}</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">{t('reviews.comment')}</label>
                <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-h-[100px]"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('reviews.placeholder')}
                    required
                />
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full md:w-auto">
                {isSubmitting ? t('reviews.submitting') : t('reviews.submit')}
            </Button>
        </form>
    )
}

export default ReviewForm
