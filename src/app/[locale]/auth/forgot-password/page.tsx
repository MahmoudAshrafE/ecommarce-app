'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import Link from '@/components/link'
import { Routes, Pages } from '@/constants/enums'

const ForgotPasswordPage = () => {
    const { status } = useSession()
    const t = useTranslations('auth.forgotPassword')
    const gt = useTranslations()
    const { locale } = useParams()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace(`/${locale}`)
        }
    }, [status, router, locale])

    if (status === 'loading' || status === 'authenticated') {
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, locale })
            })

            if (res.ok) {
                setEmailSent(true)
                toast({
                    title: gt('messages.success'),
                    description: t('successMessage'),
                })
            } else {
                toast({
                    variant: 'destructive',
                    title: gt('messages.error'),
                    description: t('errorMessage') || 'Something went wrong',
                })
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: gt('messages.error'),
                description: gt('messages.unexpectedError'),
            })
        } finally {
            setLoading(false)
        }
    }

    if (emailSent) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-3xl shadow-xl border border-border text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground text-primary">
                        {t('checkEmail')}
                    </h2>
                    <p className="text-muted-foreground mt-4">
                        {t('sentMessage')} <b>{email}</b>
                    </p>
                    <div className="mt-8">
                        <Link
                            href={`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`}
                            className="font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            {t('backToLogin')}
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-3xl shadow-xl border border-border animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        {t('title')}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t('description')}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-semibold px-1">
                                {t('emailLabel')}
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-lg font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        disabled={loading}
                    >
                        {loading ? gt('loading') : t('submit')}
                    </Button>

                    <div className="text-center mt-4">
                        <Link
                            href={`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`}
                            className="font-medium text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            {t('backToLogin')}
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default ForgotPasswordPage
