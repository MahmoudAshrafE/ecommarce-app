import MenuItem from "./MenuItem"
import { ProductWithRelations } from "@/types/product"
import { getTranslations } from "next-intl/server"

const Menu = async ({ items, locale }: { items: ProductWithRelations[], locale: string }) => {
    const t = await getTranslations({ locale })

    return items.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {items.map(item => (
                <MenuItem key={item.id} item={item} locale={locale} />
            ))}
        </ul>
    ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-border">
            <div className="text-6xl">🍕</div>
            <p className="text-xl font-black text-muted-foreground italic">{t('noProductsFound')}</p>
        </div>
    )
}

export default Menu