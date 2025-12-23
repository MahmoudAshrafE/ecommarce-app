'use client'

import { Languages } from '@/constants/enums'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

const LanguageSwitcher = () => {
    const { locale } = useParams()
    const router = useRouter()
    const pathname = usePathname()

    const switchLanguage = (newLocale: string) => {
        const segments = pathname.split('/')
        if (segments.length > 1) {
            segments[1] = newLocale
        } else {
            return router.push(`/${newLocale}`)
        }
        const newPath = segments.join('/')
        router.replace(newPath)
    }

    return (
        <Button
            variant='ghost'
            onClick={() => switchLanguage(locale === Languages.ARABIC ? Languages.ENGLISH : Languages.ARABIC)}
            size='sm'
            className='font-bold h-10 px-4 rounded-full flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95 border border-white/10 backdrop-blur-sm'
        >
            <Globe className="w-4 h-4 opacity-70" />
            <span className="text-xs uppercase tracking-widest">{locale === Languages.ARABIC ? 'En' : 'عربي'}</span>
        </Button>
    )
}

export default LanguageSwitcher
