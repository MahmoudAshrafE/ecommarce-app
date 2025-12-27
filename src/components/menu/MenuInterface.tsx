'use client'

import { useState, useMemo } from 'react'
import { ProductWithRelations } from '@/types/product'
import { Search, X, ChefHat, Filter, SlidersHorizontal, UtensilsCrossed } from 'lucide-react'
import MenuItem from './MenuItem'
import { Button } from '../ui/button'

type CategoryWithProducts = {
    id: string
    name: string
    nameAr: string | null
    products: ProductWithRelations[]
}

interface MenuInterfaceProps {
    categories: CategoryWithProducts[]
    locale: string
    labels: {
        searchPlaceholder: string
        filterAll: string
        noResults: string
        premium: string
    }
}

const MenuInterface = ({ categories, locale, labels }: MenuInterfaceProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<string>('all')

    // Filter Logic
    const filteredCategories = useMemo(() => {
        const query = searchQuery.toLowerCase().trim()

        return categories.map(category => {
            // If category is selected or 'all' is selected
            const isCategoryActive = activeCategory === 'all' || activeCategory === category.id

            if (!isCategoryActive) return null

            // Filter products
            const products = category.products.filter(p => matchProduct(p, query))

            if (products.length === 0) return null

            return { ...category, products }
        }).filter(Boolean) as CategoryWithProducts[]
    }, [categories, searchQuery, activeCategory])

    function matchProduct(product: ProductWithRelations, query: string) {
        if (!query) return true
        return (
            product.name.toLowerCase().includes(query) ||
            (product.nameAr && product.nameAr.toLowerCase().includes(query)) ||
            product.description.toLowerCase().includes(query) ||
            (product.descriptionAr && product.descriptionAr.toLowerCase().includes(query))
        )
    }

    const clearSearch = () => {
        setSearchQuery('')
        setActiveCategory('all')
    }

    const hasResults = filteredCategories.length > 0

    return (
        <div className="flex flex-col gap-8">
            {/* Search & Filter Bar */}
            <div className="mb-8">
                <div className="bg-background border border-border/50 shadow-sm p-4 rounded-3xl space-y-4">

                    {/* Search Input */}
                    <div className="relative group">
                        <div className={`absolute inset-y-0 ${locale === 'ar' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                            <Search className={`h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors ${locale === 'ar' ? '-scale-x-100' : ''}`} />
                        </div>
                        <input
                            type="text"
                            className={`block w-full ${locale === 'ar' ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-4 bg-secondary/50 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 transition-all shadow-inner`}
                            placeholder={labels.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={`absolute inset-y-0 ${locale === 'ar' ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center text-muted-foreground hover:text-destructive transition-colors`}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none mask-fade-right">
                        <div className="flex items-center gap-2 pr-4">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filter</span>
                        </div>
                        <Button
                            variant={activeCategory === 'all' ? 'default' : 'secondary'}
                            onClick={() => setActiveCategory('all')}
                            className={`rounded-xl font-bold transition-all ${activeCategory === 'all' ? 'shadow-lg shadow-primary/25 scale-105' : 'hover:bg-primary/10 hover:text-primary'}`}
                        >
                            {labels.filterAll}
                        </Button>
                        {categories.map(cat => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? 'default' : 'secondary'}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`rounded-xl font-bold whitespace-nowrap transition-all ${activeCategory === cat.id ? 'shadow-lg shadow-primary/25 scale-105' : 'hover:bg-primary/10 hover:text-primary'}`}
                            >
                                {locale === 'ar' ? cat.nameAr || cat.name : cat.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-16 min-h-[50vh]">
                {hasResults ? (
                    filteredCategories.map((category) => (
                        <section key={category.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4 border-b border-border/40 pb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-1 bg-primary rounded-full" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/80">Category</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">
                                        {locale === 'ar' ? category.nameAr || category.name : category.name}
                                    </h2>
                                </div>
                            </div>

                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {category.products.map(product => (
                                    <MenuItem key={product.id} item={product} locale={locale} />
                                ))}
                            </ul>
                        </section>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-32 h-32 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
                            <UtensilsCrossed className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-black">{labels.noResults}</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                            Try adjusting your search or filters to find what you're craving.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-8"
                            onClick={clearSearch}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MenuInterface
