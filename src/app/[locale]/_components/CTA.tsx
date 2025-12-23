
import Link from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { Routes } from '@/constants/enums'
import { ArrowRight, CheckCircle2, Sparkles, Timer } from 'lucide-react'
import { getTranslations, getLocale } from 'next-intl/server'
import Image from 'next/image'

const CTA = async ({ locale }: { locale: string }) => {
    const t = await getTranslations({ locale })

    return (
        <section className="py-20">
            <div className="container">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#050a18] text-white shadow-2xl">
                    {/* Background Gradients & Patterns */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-60 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-40 pointer-events-none" />

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center relative z-10">
                        {/* Content Side */}
                        <div className="p-8 md:p-16 lg:py-20 lg:pl-20">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-primary-foreground text-sm font-semibold mb-8 border border-white/10 hover:bg-white/15 transition-colors cursor-default">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span>{t('home.cta.limitedOffer')}</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
                                {t('home.cta.title')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                                    {t('home.cta.subtitle')}
                                </span>
                            </h2>

                            <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-xl">
                                {t('home.cta.description')}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                                <Link
                                    href={`/${locale}/${Routes.MENU}`}
                                    className={`${buttonVariants({
                                        size: 'lg',
                                    })} w-full sm:w-auto rounded-full text-lg h-14 px-8 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all`}
                                >
                                    {t('home.cta.orderNow')}
                                    <ArrowRight className="w-5 h-5 ml-2 rtl:rotate-180" />
                                </Link>
                                <Link
                                    href={`/${locale}/${Routes.CONTACT}`}
                                    className="w-full sm:w-auto h-14 px-8 rounded-full border border-gray-700 bg-transparent flex items-center justify-center font-bold hover:bg-white/5 hover:border-gray-500 transition-all text-white"
                                >
                                    {t('home.cta.contactUs')}
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Timer className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-bold">{t('home.cta.delivery.title')}</div>
                                        <div className="text-gray-400">{t('home.cta.delivery.subtitle')}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-bold">{t('home.cta.fresh.title')}</div>
                                        <div className="text-gray-400">{t('home.cta.fresh.subtitle')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center lg:justify-end">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050a18] to-transparent lg:hidden z-10" />
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#050a18]/20 to-[#050a18] hidden lg:block z-10" />

                            <div className="relative w-[120%] h-[120%] lg:w-full lg:h-full lg:translate-x-20">
                                <Image
                                    src="/assets/images/cta-burger.png"
                                    alt="Delicious Gourmet Burger"
                                    fill
                                    className="object-contain lg:object-cover object-center scale-110 hover:scale-105 transition-transform duration-700"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA
