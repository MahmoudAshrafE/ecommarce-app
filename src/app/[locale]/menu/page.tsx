import { getProductsByCategory } from "@/server/db/product";
import { getTranslations } from "next-intl/server";
import { Utensils } from "lucide-react";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import MenuInterface from "@/components/menu/MenuInterface";

async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const categorites = await getProductsByCategory();

  const labels = {
    searchPlaceholder: t('menu.searchPlaceholder'),
    filterAll: t('menu.filterAll'),
    noResults: t('noProductsFound'),
    premium: t('menu.category.premium')
  }

  return (
    <main className="bg-[#f8fafc] dark:bg-background/95 min-h-screen pt-20">
      {/* Unified Header */}
      <div className="container mx-auto pt-8 pb-8 px-4">
        <Breadcrumbs />
        <div className="mt-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('menu.hero.explore')} {t('menu.hero.menu')}</h1>
          <p className="text-muted-foreground">{t('menu.hero.description')}</p>
        </div>
      </div>

      {/* Menu Interface */}
      <div className="container py-12">
        <MenuInterface
          categories={categorites}
          locale={locale}
          labels={labels}
        />
      </div>
    </main>
  );
}

export default MenuPage;