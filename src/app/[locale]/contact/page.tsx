import Contact from '@/components/contact'
import { getTranslations } from 'next-intl/server'
import { PhoneCall } from 'lucide-react'
import PageHero from '@/components/PageHero'

const ContactPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <main className="min-h-screen bg-background">
      {/* Contact Hero Header */}
      <PageHero
        badgeIcon={PhoneCall}
        badgeText={t('navbar.contact')}
        title={t('home.contact.contactUs')}
        subtitle={t('home.contact.dont_hesitate')}
      />

      <div className="py-10">
        <Contact locale={locale} />
      </div>
    </main>
  )
}

export default ContactPage