'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User, Mail, Calendar, ShoppingBag, Settings, LogOut, Lock, Camera, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import UserOrders from './_components/UserOrders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SignOutModal from '@/components/auth/SignOutModal'
import { useToast } from '@/components/ui/use-toast'
import UserAvatar from '@/components/ui/user-avatar'
import Breadcrumbs from '@/components/Breadcrumbs'
import PageHero from '@/components/PageHero'
import { cn } from '@/lib/utils'

type Tab = 'info' | 'orders' | 'settings';

const ProfilePage = () => {
    const t = useTranslations()
    const { data: session, status } = useSession()
    const router = useRouter()
    const { locale } = useParams()
    const [activeTab, setActiveTab] = useState<Tab>('info')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [userImage, setUserImage] = useState(session?.user?.image || null)
    const { toast } = useToast()
    const { update: updateSession } = useSession()

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast({
                title: t('messages.error'),
                description: t('profile.allFieldsRequired'),
                variant: "destructive"
            })
            return
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: t('messages.error'),
                description: t('profile.passwordMismatch'),
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                toast({
                    title: t('messages.success'),
                    description: t('profile.passwordUpdated'),
                })
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            } else {
                const error = await res.text()
                toast({
                    title: t('messages.error'),
                    description: error || t('messages.unexpectedError'),
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: t('messages.error'),
                description: t('messages.unexpectedError'),
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!uploadRes.ok) throw new Error('Upload failed')
            const { url } = await uploadRes.json()

            const profileRes = await fetch('/api/profile', {
                method: 'PUT',
                body: JSON.stringify({ image: url }),
                headers: { 'Content-Type': 'application/json' },
            })

            if (profileRes.ok) {
                setUserImage(url)
                await updateSession({ image: url })
                toast({
                    title: t('messages.success'),
                    description: t('messages.updateProfileSucess'),
                })
            } else {
                throw new Error('Profile update failed')
            }
        } catch (error) {
            toast({
                title: t('messages.error'),
                description: t('messages.unexpectedError'),
                variant: "destructive"
            })
        } finally {
            setUploading(false)
        }
    }

    useEffect(() => {
        if (session?.user?.image) {
            setUserImage(session.user.image)
        }
    }, [session?.user?.image])

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </main>
        )
    }

    if (!session?.user) {
        return null
    }

    const isRtl = locale === 'ar';

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tight">{t('profile.info.title')}</h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="bg-card p-6 rounded-3xl border border-border/50 space-y-2 hover:shadow-lg transition-all duration-300 group">
                                <label className="text-muted-foreground text-sm font-bold uppercase tracking-wider">{t('profile.info.fullName')}</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <User size={20} />
                                    </div>
                                    <p className="text-xl font-bold">{session.user.name}</p>
                                </div>
                            </div>

                            <div className="bg-card p-6 rounded-3xl border border-border/50 space-y-2 hover:shadow-lg transition-all duration-300 group">
                                <label className="text-muted-foreground text-sm font-bold uppercase tracking-wider">{t('profile.info.email')}</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Mail size={20} />
                                    </div>
                                    <p className="text-xl font-bold">{session.user.email}</p>
                                </div>
                            </div>

                            <div className="bg-card p-6 rounded-3xl border border-border/50 space-y-2 hover:shadow-lg transition-all duration-300 group col-span-full">
                                <label className="text-muted-foreground text-sm font-bold uppercase tracking-wider">{t('profile.info.memberSince')}</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Calendar size={20} />
                                    </div>
                                    <p className="text-xl font-bold">{new Date().toLocaleDateString(locale as string, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tight">{t('profile.recentOrders')}</h2>
                        </div>
                        <UserOrders />
                    </div>
                )
            case 'settings':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tight">{t('profile.security')}</h2>
                        </div>
                        <div className="bg-card p-8 rounded-3xl border border-border/50 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                < Lock className="w-5 h-5 text-primary" />
                                {t('profile.changePassword')}
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label>{t('profile.currentPassword')}</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="rounded-xl border-border/50 bg-secondary/20"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('profile.newPassword')}</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="rounded-xl border-border/50 bg-secondary/20"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('profile.confirmNewPassword')}</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="rounded-xl border-border/50 bg-secondary/20"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="w-full rounded-xl font-bold h-10"
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                >
                                    {loading ? t('profile.updating') : t('profile.updatePassword')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <main className="min-h-screen bg-[#f8fafc] dark:bg-background/95 pt-20">
            <div className="container mx-auto px-4 mt-8">
                <Breadcrumbs />
            </div>

            <div className="container mx-auto py-20 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6 sticky top-28 space-y-8">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="relative group cursor-pointer">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100 duration-500" />
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 p-1 relative z-10 transition-transform duration-500 group-hover:scale-105">
                                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden relative">
                                            {uploading ? (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                </div>
                                            ) : null}

                                            <UserAvatar
                                                image={userImage}
                                                name={session.user.name}
                                                size="xl"
                                                className="bg-transparent"
                                            />

                                            <label
                                                htmlFor="avatar-upload"
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer z-10"
                                            >
                                                <Camera className="w-6 h-6 text-white mb-1" />
                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">{t('profile.changeImage')}</span>
                                                <input
                                                    id="avatar-upload"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn(isRtl ? "text-center" : "text-center")}>
                                    <h1 className="text-xl font-bold text-foreground">{session.user.name}</h1>
                                    <p className="text-sm text-muted-foreground opacity-80">{session.user.email}</p>
                                </div>
                            </div>

                            <hr className="border-border/50" />

                            <nav className="space-y-2">
                                {[
                                    { id: 'info', label: t('profile.info.title'), icon: User },
                                    { id: 'orders', label: t('profile.recentOrders'), icon: ShoppingBag },
                                    { id: 'settings', label: t('profile.settings'), icon: Settings },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as Tab)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold",
                                            activeTab === item.id
                                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                                                : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>

                            <div className="pt-4">
                                <SignOutModal>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-xl gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        {t('navbar.signOut')}
                                    </Button>
                                </SignOutModal>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 animate-in slide-in-from-bottom-8 duration-700">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProfilePage
