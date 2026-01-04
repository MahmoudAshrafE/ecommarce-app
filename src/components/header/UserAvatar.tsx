'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, LogOut, ShoppingBag, Settings } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Routes } from '@/constants/enums'
import Link from '@/components/link'
import SignOutModal from '@/components/auth/SignOutModal'
import BaseAvatar from '../ui/user-avatar'

const UserAvatar = () => {
    const t = useTranslations('navbar')
    const { data: session } = useSession()
    const { locale } = useParams()
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest('.avatar-dropdown-container')) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('click', handleClickOutside)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isOpen])

    if (!mounted || !session?.user) {
        return null
    }

    return (
        <div className="relative avatar-dropdown-container">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 p-1.5 rounded-full border-2 transition-all duration-300 ${isOpen ? "border-primary shadow-lg shadow-primary/20 scale-105" : "border-transparent hover:bg-secondary/50 dark:hover:bg-WHITE/5"}`}
            >
                <BaseAvatar
                    image={session.user.image}
                    name={session.user.name}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                className={`absolute end-0 mt-3 w-56 bg-linear-to-br from-card to-background border border-border/50 rounded-2xl shadow-2xl transition-all duration-300 z-9999 overflow-hidden backdrop-blur-3xl 
                origin-top-right ${isOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95'}
                `}
            >
                <div className="p-4 border-b border-border/50 bg-secondary/10">
                    <p className="font-black text-sm text-foreground">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate font-medium">{session.user.email}</p>
                </div>
                <div className="p-2 space-y-1">
                    <Link
                        href={`/${locale}/${Routes.PROFILE}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 group"
                    >
                        <User className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        {t('profile')}
                    </Link>
                    <Link
                        href={`/${locale}/${Routes.PROFILE}?tab=orders`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 group"
                    >
                        <ShoppingBag className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        {t('orders') || "Orders"}
                    </Link>
                    <Link
                        href={`/${locale}/${Routes.PROFILE}?tab=settings`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 group"
                    >
                        <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        {t('settings') || "Settings"}
                    </Link>

                    {session.user.role === 'ADMIN' && (
                        <>
                            <div className="h-px bg-border/50 my-1 mx-2" />
                            <Link
                                href={`/${locale}/${Routes.ADMIN}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-black hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 group"
                            >
                                <User className="w-4 h-4 group-hover:text-primary transition-colors" />
                                {t('admin')}
                            </Link>
                        </>
                    )}

                    <div className="h-px bg-border/50 my-1 mx-2" />

                    <SignOutModal>
                        <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold bg-destructive/5 hover:bg-destructive hover:text-white rounded-xl transition-all duration-200 text-destructive group"
                        >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            {t('signOut')}
                        </button>
                    </SignOutModal>
                </div>
            </div>
        </div>
    )
}

export default UserAvatar
