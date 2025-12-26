import { Search, ShoppingBag, Truck, Utensils } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

const HowItWorks = async ({ locale }: { locale: string }) => {
    const t = await getTranslations({ locale, namespace: 'home.howItWorks' })

    const steps = [
        {
            icon: Search,
            title: t('steps.choose.title'),
            description: t('steps.choose.description'),
            color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        },
        {
            icon: ShoppingBag,
            title: t('steps.place.title'),
            description: t('steps.place.description'),
            color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        },
        {
            icon: Truck,
            title: t('steps.delivery.title'),
            description: t('steps.delivery.description'),
            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        },
        {
            icon: Utensils,
            title: t('steps.enjoy.title'),
            description: t('steps.enjoy.description'),
            color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        }
    ]

    return (
        <section className="section-gap py-24 bg-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -ml-48 -mb-48" />

            <div className="container relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
                        {t('title')} <span className="text-primary">{t('works')}</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-primary/20 -translate-y-12" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative group text-center">
                            <div className={`w-24 h-24 rounded-full ${step.color} mx-auto flex items-center justify-center mb-8 relative z-10 border-4 border-background transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl`}>
                                <step.icon className="w-10 h-10" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center shadow-lg">
                                    0{index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-black mb-4 tracking-tight uppercase italic">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
