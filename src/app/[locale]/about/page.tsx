import About from '@/components/about'
import { getTranslations } from 'next-intl/server'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Suspense } from 'react'
import { Loader } from '@/components/ui/loader'

const AboutPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-background/95 pt-16">
      {/* Unified Header */}
      <div className="container mx-auto pt-8 pb-8 px-4">
        <Breadcrumbs />
      </div>

      <div className="container mx-auto px-4">
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" variant="burger" />
          </div>
        }>
          <About locale={locale} />
        </Suspense>
      </div>
    </main>
  )
}

export default AboutPage