import { Quote, Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

const Testimonials = async ({ locale }: { locale: string }) => {
    const t = await getTranslations({ locale })

    const reviews = await prisma.review.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    name: true,
                    image: true
                }
            }
        }
    })

    return (
        <section className="py-20 md:py-28 bg-secondary/10">
            <div className="container px-4">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        {t('reviews.title')}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                        {t('home.about.descriptions.three')}
                    </p>
                </div>

                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl relative group"
                            >
                                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors" />

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-primary/20">
                                        {review.user.image ? (
                                            <Image
                                                src={review.user.image}
                                                alt={review.user.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary">
                                                {review.user.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base md:text-lg">{review.user.name}</h4>
                                        <div className="flex gap-0.5 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 md:w-4 md:h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-4">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-12 bg-card rounded-2xl border border-dashed">
                        {t('reviews.noReviews')}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Testimonials
