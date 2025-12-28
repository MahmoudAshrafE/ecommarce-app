'use client'

import { Pages, Routes } from '@/constants/enums'
import Link from '@/components/link'
import { useTranslations } from 'next-intl'
import { useSelectedLayoutSegment, useParams } from 'next/navigation'

import { useState } from 'react'
import { ChevronDown, Menu, X, LayoutDashboard, LayoutGrid, UtensilsCrossed, Users, ShoppingBag, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const AdminTabs = () => {
    const t = useTranslations('admin.tabs')
    const { locale } = useParams()
    const isRtl = locale === 'ar'
    const segment = useSelectedLayoutSegment()
    const [isOpen, setIsOpen] = useState(false)

    const tabs = [
        { name: t('profile'), href: `/${Routes.ADMIN}`, active: segment === null, icon: LayoutDashboard },
        { name: t('categories'), href: `/${Routes.ADMIN}/${Pages.CATEGORIES}`, active: segment === Pages.CATEGORIES, icon: LayoutGrid },
        { name: t('menuItems'), href: `/${Routes.ADMIN}/${Pages.MENU_ITEMS}`, active: segment === Pages.MENU_ITEMS, icon: UtensilsCrossed },
        { name: t('users'), href: `/${Routes.ADMIN}/${Pages.USERS}`, active: segment === Pages.USERS, icon: Users },
        { name: t('orders'), href: `/${Routes.ADMIN}/${Pages.ORDERS}`, active: segment === Pages.ORDERS, icon: ShoppingBag },
        { name: t('reviews'), href: `/${Routes.ADMIN}/${Pages.REVIEWS}`, active: segment === Pages.REVIEWS, icon: Star },
    ]

    const activeTab = tabs.find(tab => tab.active)

    return (
        <div className="mb-6 group/tabs">
            {/* Mobile Dropdown/Collapsible */}
            <div className="lg:hidden relative z-30">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-card/80 backdrop-blur-md border border-border/50 rounded-xl shadow-sm active:scale-[0.98] transition-all duration-200"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                            <Menu className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-foreground text-sm">
                            {activeTab?.name || t('profile')}
                        </span>
                    </div>
                    <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-primary"
                    )} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
                        <div className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-card/90 backdrop-blur-2xl border border-border/50 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 ease-out z-30">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <Link
                                        key={tab.href}
                                        href={tab.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold transition-all duration-300 mb-0.5 last:mb-0 group text-sm",
                                            locale === 'ar' && "flex-row-reverse text-right",
                                            tab.active
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : cn("text-muted-foreground hover:bg-secondary/80 hover:text-foreground", locale === 'ar' ? "hover:-translate-x-1" : "hover:translate-x-1")
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4 transition-transform", tab.active ? "scale-105" : "group-hover:scale-110")} />
                                        {tab.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Desktop Tabs */}
            <div className={cn("hidden lg:flex items-center gap-2 bg-secondary/30 backdrop-blur-sm p-2 rounded-[1.5rem] border border-border/40 w-fit mx-auto lg:mx-0 shadow-inner", isRtl && "lg:mr-0 flex-row-reverse")}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "relative flex items-center gap-2.5 px-6 py-3 rounded-xl font-black transition-all duration-500 whitespace-nowrap text-[13px] uppercase tracking-wider group/item",
                                tab.active
                                    ? "bg-card text-primary shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-border/50 translate-y-[-2px]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-card/40 hover:translate-y-[-1px]"
                            )}
                        >
                            <Icon className={cn(
                                "w-4 h-4 transition-all duration-500",
                                tab.active ? "text-primary scale-110 rotate-3" : "group-hover/item:text-primary group-hover/item:scale-110"
                            )} />
                            {tab.name}
                            {/* Animated Underline for better visual feedback */}
                            {tab.active && (
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-bounce" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}


export default AdminTabs
