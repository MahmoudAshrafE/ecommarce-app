import About from '@/components/about'
import { getTranslations } from 'next-intl/server'
import { Info } from 'lucide-react'
import PageHero from '@/components/PageHero'

const AboutPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <main className="min-h-screen bg-background">
      {/* About Hero Header */}
      <PageHero
        badgeIcon={Info}
        badgeText={t('navbar.about')}
        title={t('home.about.ourStory')}
        subtitle={t('home.about.chefQuote')}
      />

      <div className="py-10">
        <About locale={locale} />
      </div>
    </main>
  )
}

export default AboutPage