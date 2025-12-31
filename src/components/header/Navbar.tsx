'use client'
import { useSession } from 'next-auth/react'
import { Pages, Routes, UserRole } from '@/constants/enums'
import Link from '../link'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Menu, XIcon, Home, ShoppingBag, Info, Phone, LogIn, ShoppingCart, Instagram, Facebook, Twitter, ChevronDown, LayoutDashboard } from 'lucide-react'
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
        ...(session?.user?.role === UserRole.ADMIN ? [{
            id: 'admin',
            title: t('admin'),
            href: `${locale}/${Routes.ADMIN}`,
            icon: LayoutDashboard
        }] : []),
        { id: 'login', title: t('login'), href: `${locale}/${Routes.AUTH}/${Pages.LOGIN}`, auth: false, icon: LogIn },
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [open]);

    if (!mounted) return null;

    const isActive = (href: string) => {
        const fullPath = `/${href}`;
        if (href === locale) {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }
        return pathname.startsWith(fullPath);
    };

    const textColor = "text-foreground/80 hover:text-primary";

    if (isMobileOnly) {
        return (
            <>
                <Button
                    variant='ghost'
                    size='icon'
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-[100] rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-xl ${!isScrolled && isHome
                        ? "text-foreground bg-background/20 hover:bg-background/40 border border-white/10 backdrop-blur-md"
                        : "text-foreground bg-background/80 backdrop-blur-xl hover:bg-background border border-border/50"
                        }`}
                    onClick={() => setOpen(true)}
                >
                    <ChevronDown className='w-6 h-6' />
                </Button>

                {open && createPortal(
                    <div className="fixed inset-0 z-[999] xl:hidden">
                        {/* Backdrop with blur */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                            onClick={() => setOpen(false)}
                        />

                        {/* Drawer Content */}
                        <div className="absolute top-0 left-0 right-0 max-h-[85vh] bg-background/95 backdrop-blur-xl rounded-b-[2rem] border-b border-white/10 p-5 flex flex-col shadow-2xl animate-in slide-in-from-top duration-200 ease-out overflow-y-auto ring-1 ring-white/5">

                            {/* Drawer Handle/Indicator */}
                            <div className="mx-auto w-12 h-1 bg-muted-foreground/20 rounded-full mb-4" />

                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 px-1">
                                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                    {t('menu')}
                                </span>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-full h-10 w-10 bg-secondary/50 hover:bg-destructive/10 hover:text-destructive transition-colors'
                                    onClick={() => setOpen(false)}
                                >
                                    <XIcon className='w-5 h-5' />
                                </Button>
                            </div>

                            {/* Links List */}
                            <nav className="flex flex-col gap-1.5 pb-6">
                                {Links.filter(link => link.auth === false ? !session : true).map((link, index) => {
                                    const active = isActive(link.href);
                                    const isLogin = link.id === 'login';

                                    return (
                                        <Link
                                            key={link.id}
                                            href={`/${link.href}`}
                                            onClick={() => setOpen(false)}
                                            className={`group flex items-center justify-between p-3 rounded-xl ${isLogin
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 mt-2"
                                                : active
                                                    ? "bg-secondary text-primary scheme-light"
                                                    : "text-foreground/80 hover:text-foreground"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${isLogin
                                                    ? "bg-white/20"
                                                    : active
                                                        ? "bg-background shadow-sm"
                                                        : "bg-secondary"
                                                    }`}>
                                                    {link.icon && <link.icon className={`w-5 h-5 ${isLogin ? "text-white" : active ? "text-primary" : "text-muted-foreground"}`} />}
                                                </div>
                                                <span className="text-base font-bold tracking-wide">{link.title}</span>
                                            </div>

                                            {/* Interactive Arrow */}
                                            <div className={`${isLogin || active ? "opacity-100" : "opacity-0"}`}>
                                                {isLogin ? <LogIn className="w-5 h-5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Drawer Footer */}
                            <div className="mt-auto pt-4 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                    {/* Specialized Cart Button in Footer */}
                                    <Link
                                        href={`/${locale}/${Routes.CART}`}
                                        onClick={() => setOpen(false)}
                                        className="flex-1 me-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl flex items-center justify-center gap-2.5 transition-colors group"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span className="font-bold text-sm">{t('cart')}</span>
                                    </Link>

                                    {/* Socials */}
                                    <div className="flex gap-2">
                                        {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                            <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                                                <Icon className="w-4 h-4" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium tracking-widest uppercase opacity-60">
                                    Gourmet Experience
                                </p>
                            </div>
                        </div>


                    </div>,
                    document.body
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
                                className={`relative px-2 lg:px-4 py-1 text-xs lg:text-sm font-bold whitespace-nowrap transition-all duration-300 ${textColor} ${active ? "text-primary!" : ""
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
