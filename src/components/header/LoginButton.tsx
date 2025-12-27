'use client'

import { useSession } from 'next-auth/react'
import { LogIn } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Pages, Routes } from '@/constants/enums'
import Link from '@/components/link'
import { Button } from '../ui/button'

interface LoginButtonProps {
    isScrolled: boolean;
    isHome: boolean;
}

const LoginButton = ({ isScrolled, isHome }: LoginButtonProps) => {
    const t = useTranslations('navbar')
    const { data: session } = useSession()
    const { locale } = useParams()

    if (session) {
        return null
    }

    const buttonVariant = !isScrolled && isHome ? "secondary" : "default";

    return (
        <>
            <Button
                asChild
                variant={buttonVariant}
                size="sm"
                className="hidden lg:flex items-center gap-2 rounded-full font-bold px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
            >
                <Link href={`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`}>
                    <LogIn className="w-4 h-4" />
                    <span>{t('login')}</span>
                </Link>
            </Button>
            <Button
                asChild
                variant={!isScrolled && isHome ? "secondary" : "secondary"}
                size="icon"
                className={`flex lg:hidden rounded-full w-10 h-10 shadow-lg !text-black ${!isScrolled && isHome ? "bg-white/20 hover:bg-white/30" : "bg-secondary"}`}
            >
                <Link href={`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`}>
                    <LogIn className="w-5 h-5" />
                </Link>
            </Button>
        </>
    )
}

export default LoginButton
