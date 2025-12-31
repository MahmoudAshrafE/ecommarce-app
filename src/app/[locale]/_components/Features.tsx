import { Zap, Heart, Clock, Award } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

const Features = async ({ locale }: { locale: string }) => {
    const t = await getTranslations({ locale, namespace: 'home.features' })

    const features = [
        {
            icon: Zap,
            title: t('items.fastDelivery.title'),
            description: t('items.fastDelivery.description'),
            color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            glow: 'group-hover:shadow-amber-500/20'
        },
        {
            icon: Heart,
            title: t('items.freshIngredients.title'),
            description: t('items.freshIngredients.description'),
            color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
            glow: 'group-hover:shadow-rose-500/20'
        },
        {
            icon: Clock,
            title: t('items.service.title'),
            description: t('items.service.description'),
            color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
            glow: 'group-hover:shadow-sky-500/20'
        },
        {
            icon: Award,
            title: t('items.award.title'),
            description: t('items.award.description'),
            color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
            glow: 'group-hover:shadow-violet-500/20'
        }
    ]

    return (
        <section className="section-gap relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />

            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        {t('title')} <span className="text-primary">{t('us')}</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group bg-background/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl ${feature.glow} hover:-translate-y-2`}
                        >
                            <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
