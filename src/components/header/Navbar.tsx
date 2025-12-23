'use client'
import { useSession } from 'next-auth/react'
import { Pages, Routes } from '@/constants/enums'
import Link from '../link'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import { Menu, XIcon, Home, ShoppingBag, Info, Phone, LogIn, ShoppingCart, Instagram, Facebook, Twitter } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface NavbarProps {
  isScrolled: boolean;
  isHome: boolean;
  isMobileOnly?: boolean;
}

const Navbar = ({ isScrolled, isHome, isMobileOnly = false }: NavbarProps) => {
  const t = useTranslations('navbar')
  const [open, setOpen] = useState(false)
  const { locale } = useParams();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { data: session } = useSession();

  const Links = [
    { id: 'home', title: t('home'), href: `${locale}`, icon: Home },
    { id: 'menu', title: t('menu'), href: `${locale}/${Routes.MENU}`, icon: ShoppingBag },
    { id: 'about', title: t('about'), href: `${locale}/${Routes.ABOUT}`, icon: Info },
    { id: 'contact', title: t('contact'), href: `${locale}/${Routes.CONTACT}`, icon: Phone },
    { id: 'login', title: t('login'), href: `${locale}/${Routes.AUTH}/${Pages.LOGIN}`, auth: false, icon: LogIn },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (href: string) => {
    const fullPath = `/${href}`;
    if (href === locale) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(fullPath);
  };

  const textColor = !isScrolled && isHome ? "text-white/80 hover:text-white" : "text-foreground/70 hover:text-primary";

  if (isMobileOnly) {
    return (
      <>
        <Button
          variant='ghost'
          size='icon'
          className={`rounded-2xl w-12 h-12 transition-all duration-300 ${!isScrolled && isHome ? "text-white bg-white/10 hover:bg-white/20" : "text-foreground bg-secondary/50 hover:bg-secondary"}`}
          onClick={() => setOpen(true)}
        >
          <Menu className='w-6 h-6' />
        </Button>

        {open && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div
              className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-md animate-in fade-in duration-500"
              onClick={() => setOpen(false)}
            />
            <div className={`absolute top-0 bottom-0 ${locale === 'ar' ? 'left-0 border-r' : 'right-0 border-l'} w-[320px] bg-background border-border/10 p-4 md:p-8 flex flex-col shadow-2xl animate-in ${locale === 'ar' ? 'slide-in-from-left' : 'slide-in-from-right'} duration-500 ease-out`}>
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-10 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-xl">🍔</span>
                  </div>
                  <span className="font-black text-xl tracking-tighter uppercase italic">{t('menu')}</span>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full h-12 w-12 hover:bg-destructive/10 hover:text-destructive transition-colors'
                  onClick={() => setOpen(false)}
                >
                  <XIcon className='w-6 h-6' />
                </Button>
              </div>

              {/* Links Content */}
              <ul className="flex flex-col gap-3">
                {Links.filter(link => link.auth === false ? !session : true).map((link, index) => {
                  const active = isActive(link.href);
                  const isLogin = link.id === 'login';

                  return (
                    <li
                      key={link.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Link
                        href={`/${link.href}`}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-black transition-all group ${isLogin
                          ? "bg-primary text-white shadow-xl shadow-primary/20 mt-6 active:scale-95"
                          : active
                            ? 'bg-primary/10 text-primary border border-primary/10'
                            : 'hover:bg-secondary/50 text-foreground/70 active:scale-95'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? 'bg-primary/20' : 'bg-secondary group-hover:bg-primary/10'}`}>
                          {link.icon && <link.icon className={`w-4 h-4 ${active ? 'text-primary' : 'group-hover:text-primary'} transition-colors`} />}
                        </div>
                        <span className="flex-1">{link.title}</span>
                      </Link>
                    </li>
                  );
                })}

                {/* Specialized Mobile Cart Link */}
                <li
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${Links.length * 100}ms` }}
                >
                  <Link
                    href={`/${locale}/${Routes.CART}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-5 py-5 rounded-[1.5rem] font-black transition-all border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 active:scale-95 mt-4 group`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <span>{t('cart')}</span>
                    </div>
                    <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg tracking-widest uppercase">
                      {t('checkout')}
                    </div>
                  </Link>
                </li>
              </ul>

              {/* Drawer Footer */}
              <div className="mt-auto pt-10 pb-6 border-t border-border/50">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 text-center">{t('followJourney')}</p>
                <div className="flex items-center justify-center gap-6">
                  <Link href="#" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"><Instagram className="w-5 h-5" /></Link>
                  <Link href="#" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"><Facebook className="w-5 h-5" /></Link>
                  <Link href="#" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"><Twitter className="w-5 h-5" /></Link>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-8 font-medium">{t('tagline')}</p>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <nav className='relative'>
      <ul className='flex items-center gap-2'>
        {Links.filter(link => link.auth === false ? !session : true).filter(l => l.id !== 'login').map((link) => {
          const active = isActive(link.href);

          return (
            <li key={link.id}>
              <Link
                href={`/${link.href}`}
                className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 ${textColor} ${active ? "text-primary!" : ""
                  } group`}
              >
                {link.title}
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-primary transition-all duration-300 rounded-full ${active ? "opacity-100" : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"}`} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  )
}

export default Navbar
