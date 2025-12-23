import Menu from "@/components/menu";
import { getProductsByCategory } from "@/server/db/product";
import { getTranslations, getLocale } from "next-intl/server";
import { Utensils } from "lucide-react";
import PageHero from "@/components/PageHero";

async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isRtl = locale === 'ar';
  const categorites = await getProductsByCategory();

  return (
    <main className="bg-background min-h-screen">
      {/* Menu Hero Header */}
      <PageHero
        badgeIcon={Utensils}
        badgeText={t('navbar.menu')}
        title={<>{t('menu.hero.explore')} <span className="text-primary italic">{t('menu.hero.delicious')}</span> {t('menu.hero.menu')}</>}
        subtitle={t('menu.hero.description')}
      />

      {/* Menu Categories */}
      <div className="py-20 flex flex-col gap-20">
        {categorites.length > 0 ? (
          categorites.map((category) => (
            category.products.length > 0 && (
              <section key={category.id} className="container">
                <div className={`flex flex-col md:flex-row items-end justify-between mb-12 gap-6 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="w-12 h-1 bg-primary mb-4 rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                      {category.name}
                    </h2>
                  </div>
                  <div className="hidden md:block">
                    <p className={`text-muted-foreground text-sm font-bold uppercase tracking-widest border-l-4 border-primary pl-4 py-2 ${isRtl ? 'border-r-4 border-l-0 pr-4 pl-0 text-right' : ''}`}>
                      {t('menu.category.premium')}
                    </p>
                  </div>
                </div>

                <Menu items={category.products} locale={locale} />
              </section>
            )
          ))
        ) : (
          <div className="container py-32 text-center">
            <div className="w-24 h-24 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">
              🤷‍♂️
            </div>
            <h2 className="text-2xl font-black mb-4">{t('noProductsFound')}</h2>
            <p className="text-muted-foreground">{t('menu.emptyState.description')}</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default MenuPage;