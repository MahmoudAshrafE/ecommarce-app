'use client'

import { Pages, Routes } from '@/constants/enums'
import Link from '@/components/link'
import { useTranslations } from 'next-intl'
import { useSelectedLayoutSegment, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    LayoutGrid,
    UtensilsCrossed,
    Users,
    ShoppingBag,
    Star,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    X,
    ShieldCheck
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const AdminSidebar = () => {
    const t = useTranslations('admin.tabs')
    const navT = useTranslations('navbar')
    const segment = useSelectedLayoutSegment()
    const { locale } = useParams()
    const isRtl = locale === 'ar'

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const tabs = [
        {
            name: t('profile'),
            href: `/${Routes.ADMIN}`,
            active: segment === null,
            icon: LayoutDashboard,
        },
        {
            name: t('categories'),
            href: `/${Routes.ADMIN}/${Pages.CATEGORIES}`,
            active: segment === Pages.CATEGORIES,
            icon: LayoutGrid,
        },
        {
            name: t('menuItems'),
            href: `/${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
            active: segment === Pages.MENU_ITEMS,
            icon: UtensilsCrossed,
        },
        {
            name: t('users'),
            href: `/${Routes.ADMIN}/${Pages.USERS}`,
            active: segment === Pages.USERS,
            icon: Users,
        },
        {
            name: t('orders'),
            href: `/${Routes.ADMIN}/${Pages.ORDERS}`,
            active: segment === Pages.ORDERS,
            icon: ShoppingBag,
        },
        {
            name: t('reviews'),
            href: `/${Routes.ADMIN}/${Pages.REVIEWS}`,
            active: segment === Pages.REVIEWS,
            icon: Star,
        },
    ]

    useEffect(() => {
        setIsMobileOpen(false)
    }, [segment])

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-card/60 backdrop-blur-xl border-r border-border/50 shadow-2xl overflow-y-auto no-scrollbar">
            {/* Header / Logo */}
            <div className={cn(
                "p-6 flex items-center justify-between",
                isCollapsed && "justify-center"
            )}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 transform -rotate-6">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight leading-none uppercase">
                                Admin<span className="text-primary italic font-bold">Panel</span>
                            </span>
                        </div>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex hover:bg-primary/10 hover:text-primary transition-all duration-300 h-9 w-9 rounded-xl"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
                    ) : (
                        isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                                tab.active
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                                isCollapsed ? "justify-center" : "justify-start"
                            )}
                        >
                            <Icon className={cn(
                                "h-5 w-5 shrink-0 transition-transform duration-300",
                                tab.active ? "scale-110" : "group-hover:scale-110"
                            )} />

                            {!isCollapsed && (
                                <span className="font-bold tracking-tight text-sm whitespace-nowrap">
                                    {tab.name}
                                </span>
                            )}

                            {isCollapsed && (
                                <div className={cn(
                                    "absolute z-[100] px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-black opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl",
                                    isRtl ? "right-[calc(100%+12px)]" : "left-[calc(100%+12px)]"
                                )}>
                                    {tab.name}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border/50">
                <button
                    onClick={() => signOut()}
                    className={cn(
                        "flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group",
                        isCollapsed ? "justify-center" : "justify-start"
                    )}
                >
                    <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-all" />
                    {!isCollapsed && (
                        <span className="font-bold tracking-tight text-sm">{navT('signOut')}</span>
                    )}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Nav Toggle */}
            <div className={cn(
                "lg:hidden fixed top-20 z-[100] transition-all duration-300",
                isRtl ? "right-4" : "left-4"
            )}>
                <Button
                    size="icon"
                    variant="outline"
                    className="h-12 w-12 rounded-2xl shadow-xl bg-background border-border/50"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    role="none"
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Element */}
            <aside className={cn(
                "fixed top-0 bottom-0 z-[90] transition-all duration-500 ease-in-out border-border/50 bg-card h-screen pt-16 lg:pt-0",
                isRtl ? "right-0 border-l" : "left-0 border-r",
                // Mobile state
                isMobileOpen
                    ? "translate-x-0 w-72 shadow-2xl"
                    : (isRtl ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"),
                // Desktop state
                !isMobileOpen && (isCollapsed ? "lg:w-20" : "lg:w-64")
            )}>
                <SidebarContent />
            </aside>
        </>
    )
}

export default AdminSidebar
