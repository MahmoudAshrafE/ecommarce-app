import About from '@/components/about'
import { getTranslations } from 'next-intl/server'
import { Info } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Breadcrumbs from '@/components/Breadcrumbs'

const AboutPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-background/95 pt-20">
      {/* Unified Header */}
      <div className="container mx-auto pt-8 pb-8 px-4">
        <Breadcrumbs />
      </div>

      <div className="container mx-auto px-4">
        <About locale={locale} />
      </div>
    </main>
  )
}

export default AboutPage