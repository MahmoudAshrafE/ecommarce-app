import MainHeading from '@/components/main-heading';
import { Routes } from '@/constants/enums';
import { getTranslations } from 'next-intl/server';
import ContactForm from './ContactForm';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

const Contact = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: 'home.contact' });
  const infoT = await getTranslations({ locale, namespace: 'home.contact.info' });

  const contactInfo = [
    {
      icon: Phone,
      title: infoT('phone'),
      content: '+970593434573',
      link: 'tel:+970593434573',
    },
    {
      icon: Mail,
      title: infoT('email'),
      content: process.env.EMAIL_USER || 'info@supremburger.com',
      link: `mailto:${process.env.EMAIL_USER || 'info@supremburger.com'}`,
    },
    {
      icon: MapPin,
      title: infoT('address'),
      content: '123 Al-Salam Street, Khanyounis City, Kh 12345',
      link: '#',
    },
    {
      icon: Clock,
      title: infoT('hours'),
      content: 'Mon-Sun: 11am - 11pm',
      link: null,
    },
  ];

  return (
    <section id={Routes.CONTACT}>
      <div className='container'>
        <div className='text-center mb-16 space-y-4'>
          <MainHeading
            subTitle={t('dont_hesitate')}
            title={t('getInTouch')}
          />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
          {/* Contact Info */}
          <div className='space-y-8'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-card p-6 rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                    {item.link ? (
                      <a href={item.link} className="text-muted-foreground hover:text-primary transition-colors">
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{item.content}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-80 bg-muted rounded-xl overflow-hidden relative shadow-sm border border-border/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13630.24909136176!2d34.3190123450576!3d31.343459738723517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14fd9044e2ecd025%3A0xb4b53b91588bd26f!2z2K7Yp9mGINmK2YjZhtiz!5e0!3m2!1sar!2s!4v1766502042196!5m2!1sar!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:pl-8'>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;