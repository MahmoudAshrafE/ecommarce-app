'use client'

import React from 'react'
import { ChevronRight, ChevronLeft, Home } from 'lucide-react'
import Link from '@/components/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface BreadcrumbsProps {
    labels?: { [key: string]: string }
}

const Breadcrumbs = ({ labels = {} }: BreadcrumbsProps) => {
    const pathname = usePathname()
    const adminT = useTranslations('admin.tabs')
    const navT = useTranslations('navbar')

    const pathSegments = pathname.split('/').filter((segment) => segment !== '')
    const currentLocale = pathSegments[0] || 'en'

    // Remove locale segment
    const cleanedSegments = pathSegments.slice(1)

    const getTranslatedLabel = (segment: string) => {
        if (labels[segment]) return labels[segment]
        if (segment === 'admin') return navT('admin')

        const navKeys: { [key: string]: string } = {
            'menu': 'menu',
            'about': 'about',
            'contact': 'contact',
            'cart': 'cart'
        }

        if (navKeys[segment]) {
            try {
                return navT(navKeys[segment])
            } catch (e) {
                return segment
            }
        }

        const adminKeyMap: { [key: string]: string } = {
            'categories': 'categories',
            'menu-items': 'menuItems',
            'users': 'users',
            'orders': 'orders',
            'reviews': 'reviews',
            'profile': 'profile'
        }

        const adminKey = adminKeyMap[segment]
        if (adminKey) {
            try {
                return adminT(adminKey)
            } catch (e) {
                return segment
            }
        }

        // If it looks like a cuid/uuid (long string with no hyphens or mixed case), it might be a product name.
        // For now, simple format as fallback
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    }

    return (
        <nav className="flex items-center w-full mb-4 md:mb-8 animate-in fade-in slide-in-from-top-2 duration-700 overflow-x-auto">
            <div className="flex items-center gap-0.5 md:gap-1 p-1 md:p-1.5 bg-card/40 backdrop-blur-md border border-border/40 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <Link
                    href={`/${currentLocale}`}
                    className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-lg md:rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 group flex-shrink-0"
                >
                    <Home className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                    <span className="uppercase tracking-widest text-[10px] md:text-[9px] font-black">{navT('home')}</span>
                </Link>

                {cleanedSegments.map((segment, index) => {
                    const href = `/${currentLocale}/${cleanedSegments.slice(0, index + 1).join('/')}`
                    const isLast = index === cleanedSegments.length - 1
                    const label = getTranslatedLabel(segment)

                    const isRtl = currentLocale === 'ar'
                    const Separator = isRtl ? ChevronLeft : ChevronRight

                    return (
                        <React.Fragment key={href}>
                            <div className="px-0.5 md:px-1 flex-shrink-0">
                                <Separator className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground/30" />
                            </div>
                            <Link
                                href={href}
                                className={cn(
                                    "px-2 md:px-3 py-1.5 rounded-lg md:rounded-xl transition-all duration-300 uppercase tracking-widest text-[10px] md:text-[9px] font-black whitespace-nowrap flex-shrink-0",
                                    isLast
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                )}
                            >
                                {label}
                            </Link>
                        </React.Fragment>
                    )
                })}
            </div>
        </nav>
    )
}

export default Breadcrumbs
