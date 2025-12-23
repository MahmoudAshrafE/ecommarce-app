'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Pages, Routes } from '@/constants/enums'
import Link from '@/components/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'

const SigninForm = () => {
    const t = useTranslations('auth.login')
    const gt = useTranslations()
    const vt = useTranslations('validation')
    const mt = useTranslations('messages')
    const { locale } = useParams()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            if (result?.error) {
                setError(result.error)
            } else if (result?.ok) {
                router.push(`/${locale}`)
                router.refresh()
            }
        } catch (err) {
            setError(mt('unexpectedError'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-3xl shadow-xl border border-border animate-in fade-in zoom-in duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    {t('title')}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    {t('authPrompt.message')}
                    <Link
                        href={`/${locale}/${Routes.AUTH}/${Pages.Register}`}
                        className="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        {t('authPrompt.signUpLinkText')}
                    </Link>
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-semibold px-1">
                            {t('email.label')}
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t('email.placeholder')}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-semibold px-1">
                            {t('password.label')}
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder={t('password.placeholder')}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-destructive font-medium px-1">{error}</p>
                )}

                <Button
                    type="submit"
                    className="w-full h-12 text-lg font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading}
                >
                    {loading ? gt('loading') : t('submit')}
                </Button>
            </form>
        </div>
    )
}

export default SigninForm
