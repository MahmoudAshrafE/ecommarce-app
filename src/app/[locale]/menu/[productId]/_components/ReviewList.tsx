
import { Review, User } from '@/generated/prisma/client'
import { Star, User as UserIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type ReviewWithUser = Review & {
    user: User
}

import ReviewItem from './ReviewItem'

const ReviewList = async ({ reviews }: { reviews: ReviewWithUser[] }) => {
    const t = await getTranslations('reviews')

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
                <p>{t('noReviews')}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
            ))}
        </div>
    )
}

export default ReviewList
