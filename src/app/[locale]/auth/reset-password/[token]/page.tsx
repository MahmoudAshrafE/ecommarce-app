'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import Link from '@/components/link'
import { Routes, Pages } from '@/constants/enums'

const ResetPasswordPage = () => {
    const t = useTranslations('auth.resetPassword')
    const gt = useTranslations()
    const { locale, token } = useParams()
    const router = useRouter()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: gt('messages.error'),
                description: t('passwordsDoNotMatch'),
            })
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })

            if (res.ok) {
                toast({
                    title: gt('messages.success'),
                    description: t('successMessage'),
                })
                router.push(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`)
            } else {
                const error = await res.text()
                toast({
                    variant: 'destructive',
                    title: gt('messages.error'),
                    description: error || 'Something went wrong',
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
                            <Label htmlFor="password" className="text-sm font-semibold px-1">
                                {t('newPassword')}
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-semibold px-1">
                                {t('confirmNewPassword')}
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                </form>
            </div>
        </main>
    )
}

export default ResetPasswordPage
