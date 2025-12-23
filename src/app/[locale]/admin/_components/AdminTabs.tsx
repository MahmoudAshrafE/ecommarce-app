'use client'

import { Pages, Routes } from '@/constants/enums'
import Link from '@/components/link'
import { useTranslations } from 'next-intl'
import { useSelectedLayoutSegment } from 'next/navigation'

const AdminTabs = () => {
    const t = useTranslations('admin.tabs')
    const segment = useSelectedLayoutSegment()

    const tabs = [
        { name: t('profile'), href: `/${Routes.ADMIN}`, active: segment === null },
        { name: t('categories'), href: `/${Routes.ADMIN}/${Pages.CATEGORIES}`, active: segment === Pages.CATEGORIES },
        { name: t('menuItems'), href: `/${Routes.ADMIN}/${Pages.MENU_ITEMS}`, active: segment === Pages.MENU_ITEMS },
        { name: t('users'), href: `/${Routes.ADMIN}/${Pages.USERS}`, active: segment === Pages.USERS },
        { name: t('orders'), href: `/${Routes.ADMIN}/${Pages.ORDERS}`, active: segment === Pages.ORDERS },
        { name: t('reviews'), href: `/${Routes.ADMIN}/${Pages.REVIEWS}`, active: segment === Pages.REVIEWS },
    ]

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            {tabs.map((tab) => (
                <Link
                    key={tab.href}
                    href={tab.href}
                    className={`
                        px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap
                        ${tab.active
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }
                    `}
                >
                    {tab.name}
                </Link>
            ))}
        </div>
    )
}

export default AdminTabs
