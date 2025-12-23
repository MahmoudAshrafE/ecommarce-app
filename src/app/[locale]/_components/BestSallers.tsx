import Menu from "@/components/menu"
import { getBestSellers } from "@/server/db/product"
import { getTranslations, getLocale } from "next-intl/server"

const BestSallers = async ({ locale }: { locale: string }) => {
    const bestSallers = await getBestSellers(3)
    const t = await getTranslations({ locale, namespace: 'home.bestSeller' })
    const isRtl = locale === 'ar'

    return (
        <section className="section-gap bg-background">
            <div className="container">
                <div className={`flex flex-col md:flex-row justify-between items-end mb-12 gap-6 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-3 block">
                            {t('checkOut')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            {t('OurBestSellers')}
                        </h2>
                    </div>
                    <div className="hidden md:block">
                        <p className={`text-muted-foreground text-lg max-w-xs italic ${isRtl ? 'text-left border-l-4 pr-0 pl-6' : 'text-right border-r-4 pr-6'} border-primary`}>
                            {t('freshlyPrepared')}
                        </p>
                    </div>
                </div>
                <Menu items={bestSallers} locale={locale} />
            </div>
        </section>
    )
}

export default BestSallers