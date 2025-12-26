import { formatCurrency } from "@/lib/formaters"
import Image from "next/image"
import AddToCartButton from "./AddToCartButton"
import { ProductWithRelations } from "@/types/product"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Star } from "lucide-react"
import UserAvatar from "../ui/user-avatar"

const MenuItem = ({ item, locale }: { item: ProductWithRelations, locale: string }) => {
    const t = useTranslations();
    const isRtl = locale === 'ar';

    return (
        <li className="group relative bg-card rounded-[2.5rem] p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border/50 flex flex-col h-full overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500" />

            <Link href={`/${locale}/menu/${item.id}`} className="relative flex-1">
                {/* Image Container */}
                <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-[2rem] bg-secondary/30">
                    <Image
                        alt={item.name}
                        src={item.image}
                        className='object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out'
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        loading='eager'
                        priority
                    />

                    {/* Quality Badge */}
                    <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} bg-background/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-border/50 scale-90 group-hover:scale-100 transition-transform duration-500`}>
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span className="text-[10px] font-black uppercase text-foreground">{t('menu.item.topRated')}</span>
                    </div>
                </div>

                {/* Content */}
                <div className={`space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-start justify-between gap-4">
                        <h4 className="font-black text-xl md:text-2xl tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
                            {item.name}
                        </h4>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-xl text-sm font-black whitespace-nowrap border border-primary/10">
                            {formatCurrency(item.basePrice, locale)}
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                        {item.description}
                    </p>
                </div>
            </Link>

            {/* Footer / Action */}
            <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between gap-4">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                    {item.reviews && item.reviews.length > 0 ? (
                        <>
                            {item.reviews.slice(0, 3).map((review) => (
                                <UserAvatar
                                    key={review.id}
                                    image={review.user.image}
                                    name={review.user.name}
                                    size="sm"
                                    className="border-2 border-background"
                                />
                            ))}
                            {item.reviews.length > 3 && (
                                <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground relative z-10">
                                    +{item.reviews.length - 3}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60">
                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                                🔥
                            </div>
                            <span>{t('menu.product.freshChoice')}</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 max-w-[140px]">
                    <AddToCartButton item={item} />
                </div>
            </div>
        </li>
    )
}

export default MenuItem