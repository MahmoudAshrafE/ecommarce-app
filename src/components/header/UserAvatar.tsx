'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Routes } from '@/constants/enums'
import Link from '@/components/link'

const UserAvatar = () => {
    const t = useTranslations('navbar')
    const { data: session } = useSession()
    const { locale } = useParams()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
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

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push(`/${locale}`)
        router.refresh()
        setIsOpen(false)
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="relative avatar-dropdown-container">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-secondary transition-colors"
            >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    {session.user.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        getInitials(session.user.name)
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            <div
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                className={`absolute end-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg transition-all duration-200 z-50 overflow-hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            >
                <div className="p-3 border-b border-border">
                    <p className="font-semibold text-sm">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
                <div className="p-2">
                    <Link
                        href={`/${locale}/${Routes.PROFILE}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary rounded-lg transition-colors"
                    >
                        <User className="w-4 h-4" />
                        {t('profile')}
                    </Link>
                    {session.user.role === 'ADMIN' && (
                        <Link
                            href={`/${locale}/${Routes.ADMIN}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary rounded-lg transition-colors"
                        >
                            <User className="w-4 h-4" />
                            {t('admin')}
                        </Link>
                    )}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary rounded-lg transition-colors text-destructive"
                    >
                        <LogOut className="w-4 h-4" />
                        {t('signOut')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserAvatar
