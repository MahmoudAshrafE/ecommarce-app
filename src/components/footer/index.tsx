
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

import { Locale } from "@/i18n.config";

const Footer = async ({ locale }: { locale: Locale }) => {
  const t = await getTranslations({ locale });
  const isRtl = locale === 'ar';

  return (
    <footer key={locale} className="bg-gradient-to-t from-background to-card border-t border-border/40 pt-24 pb-12 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="container px-6 md:px-12">
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-10 xl:gap-16 mb-20 ${isRtl ? 'text-right' : 'text-left'}`}>

          {/* Brand Section - Spans 4 columns */}
          <div className="xl:col-span-4 space-y-8">
            <Link href={`/${locale}`} className="group block">
              <h2 className="text-4xl font-black italic tracking-tighter text-primary inline-flex gap-2 items-end">
                {t('logo').toUpperCase()}
                <span className="w-2 h-2 rounded-full bg-primary mb-2 animate-pulse" />
              </h2>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-lg font-light">
              {t('footer.description')}
            </p>
            <div className={`flex items-center gap-5`}>
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:-translate-y-1 shadow-sm">
                  <Icon size={20} className="stroke-2" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Spans 2 columns */}
          <div className="xl:col-span-2 space-y-8">
            <h4 className="text-xl font-bold tracking-tight">{t('footer.quickLinks')}</h4>
            <ul className="space-y-4">
              {[
                { href: `/${locale}`, label: t('navbar.home') },
                { href: `/${locale}/menu`, label: t('navbar.menu') },
                { href: `/${locale}/about`, label: t('navbar.about') },
                { href: `/${locale}/contact`, label: t('navbar.contact') }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                    {!isRtl && <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300" />}
                    {link.label}
                    {isRtl && <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Spans 3 columns */}
          <div className="xl:col-span-3 space-y-8">
            <h4 className="text-xl font-bold tracking-tight">{t('footer.contact')}</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1 ${isRtl ? 'scale-x-[-1]' : ''}`}>
                  <Phone size={18} />
                </div>
                <div className="flex-1">
                  <h6 className="font-semibold text-foreground mb-1">{t('footer.phoneLabel')}</h6>
                  <p className="text-muted-foreground dir-ltr hover:text-primary transition-colors cursor-pointer">{t('footer.phoneVal')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1 ${isRtl ? 'scale-x-[-1]' : ''}`}>
                  <Mail size={18} />
                </div>
                <div className="flex-1">
                  <h6 className="font-semibold text-foreground mb-1">{t('footer.emailLabel')}</h6>
                  <p className="text-muted-foreground hover:text-primary transition-colors cursor-pointer break-all">{process.env.EMAIL_USER || 'info@supremburger.com'}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1 ${isRtl ? 'scale-x-[-1]' : ''}`}>
                  <MapPin size={18} />
                </div>
                <div className="flex-1">
                  <h6 className="font-semibold text-foreground mb-1">{t('footer.locationLabel')}</h6>
                  <p className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">{t('footer.addressVal')}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Business Hours - Spans 3 columns */}
          <div className="xl:col-span-3 space-y-8">
            <h4 className="text-xl font-bold tracking-tight">{t('footer.status')}</h4>
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">{t('footer.hours')}</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <p className="text-2xl font-black text-foreground mb-2">{t('footer.openTime')}</p>
              <p className="text-sm text-primary font-medium opacity-80">{t('footer.madeWith')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-10 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6`}>
          <p className="text-muted-foreground text-sm font-medium opacity-70">
            {t('footer.rights')}
          </p>
          <div className={`flex items-center gap-8 text-sm font-semibold text-muted-foreground`}>
            <Link href="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
