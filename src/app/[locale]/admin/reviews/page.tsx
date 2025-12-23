
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import ReviewsTable from './_components/ReviewsTable'

const ReviewsPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'admin.reviews' })

    const reviews = await prisma.review.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    image: true
                }
            },
            product: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="space-y-6">
            <ReviewsTable reviews={reviews} />
        </div>
    )
}

export default ReviewsPage
