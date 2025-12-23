'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { User, Mail, Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import UserOrders from './_components/UserOrders'

const ProfilePage = () => {
    const t = useTranslations()
    const { data: session, status } = useSession()
    const router = useRouter()
    const { locale } = useParams()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-lg">{t('loading')}</div>
            </main>
        )
    }

    if (!session?.user) {
        return null
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
        <main className="min-h-screen bg-secondary/30 py-12">
            <div className="container max-w-4xl">
                <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl shadow-lg">
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
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{session.user.name}</h1>
                                <p className="text-muted-foreground mt-1">{session.user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold">{t('profile.info.title')}</h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                                <User className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('profile.info.fullName')}</p>
                                    <p className="font-semibold">{session.user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                                <Mail className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('profile.info.email')}</p>
                                    <p className="font-semibold">{session.user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                                <Calendar className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('profile.info.memberSince')}</p>
                                    <p className="font-semibold">{new Date().toLocaleDateString(locale as string)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <UserOrders />
                </div>
            </div>
        </main>
    )
}

export default ProfilePage
