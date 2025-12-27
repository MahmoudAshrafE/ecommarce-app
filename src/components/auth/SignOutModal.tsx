'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SignOutButtonProps {
    children?: React.ReactNode;
    className?: string;
}

const SignOutModal = ({ children, className }: SignOutButtonProps) => {
    const t = useTranslations()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { locale } = useParams()

    const handleSignOut = async () => {
        setLoading(true)
        try {
            await signOut({ redirect: false })
            router.push(`/${locale}`)
            router.refresh()
            setOpen(false)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button variant="ghost" className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <LogOut size={16} />
                        {t('navbar.signOut')}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
            >
                <DialogHeader className="space-y-4 items-center text-center pb-2">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-2 animate-in zoom-in duration-300">
                        <LogOut className="w-10 h-10 text-destructive" />
                    </div>
                    <DialogTitle className="text-2xl font-black tracking-tight">{t('navbar.signOut')}</DialogTitle>
                    <DialogDescription className="text-lg font-medium text-muted-foreground/80">
                        {t('profile.signOutConfirm')}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col gap-3 sm:flex-row sm:gap-0 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="rounded-xl h-12 font-bold border-border/50 flex-1 hover:bg-secondary"
                        disabled={loading}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSignOut}
                        className="rounded-xl h-12 font-bold shadow-lg shadow-destructive/20 flex-1"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogOut className="mr-2 w-4 h-4" />
                                {t('navbar.signOut')}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SignOutModal
