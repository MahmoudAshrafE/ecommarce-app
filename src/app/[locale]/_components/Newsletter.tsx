'use client'

import { Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const Newsletter = ({ locale }: { locale: string }) => {
    const t = useTranslations('home.newsletter')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setTimeout(() => {
            setStatus('success')
            setEmail('')
        }, 1500)
    }

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container">
                <div className="relative group bg-primary rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
                                {t('title')} <span className="text-black">{t('newsletter')}</span>
                            </h2>
                            <p className="text-white/80 text-lg font-medium">
                                {t('subtitle')}
                            </p>
                        </div>

                        <div>
                            {status === 'success' ? (
                                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-[2rem] p-8 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                        <Send className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-white text-xl font-black italic uppercase">
                                        {t('success')}
                                    </h3>
                                    <p className="text-white/80 font-medium">
                                        {t('successSubtitle')}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="email"
                                        required
                                        placeholder={t('placeholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-16 px-8 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 flex-grow text-lg font-medium transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="h-16 px-10 rounded-full bg-white text-primary font-black uppercase italic tracking-widest text-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {status === 'loading' ? t('joining') : t('subscribe')}
                                    </button>
                                </form>
                            )}
                            <p className="mt-6 text-white/50 text-xs font-bold uppercase tracking-widest text-center lg:text-left">
                                {t('noSpam')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Newsletter
