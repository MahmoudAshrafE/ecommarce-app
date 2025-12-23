'use client'

import { Routes } from "@/constants/enums"
import Link from "../link"
import Navbar from "./Navbar"
import CartButton from "./CartButton"
import UserAvatar from "./UserAvatar"
import LoginButton from "./LoginButton"
import LanguageSwitcher from "./LanguageSwitcher"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const Header = () => {
  const t = useTranslations()
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Check if we are on the homepage to apply transparent style
  const isHome = pathname === '/' || pathname === '/en' || pathname === '/ar'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled
        ? "py-3 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
        : isHome
          ? "py-6 bg-transparent"
          : "py-6 bg-background border-b border-border/10"
        }`}
    >
      <div className="container flex items-center justify-between gap-8">
        <div className="flex items-center gap-10">
          <Link
            href={Routes.ROOT}
            className="group flex items-center gap-2"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
              <span className="text-2xl md:text-3xl">🍔</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-xl md:text-2xl tracking-tighter transition-colors ${!isScrolled && isHome ? "text-white" : "text-foreground"}`}>
                {t('logo')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary -mt-1 opacity-80">Gourmet</span>
            </div>
          </Link>

          <div className="hidden lg:block">
            <Navbar isScrolled={isScrolled} isHome={isHome} />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className={`${!isScrolled && isHome ? "text-white" : "text-foreground"}`}>
            <LanguageSwitcher />
          </div>

          <div className="h-6 w-px bg-border/50 hidden md:block" />

          <div className="relative hidden md:block">
            <CartButton />
          </div>

          <div className="h-6 w-px bg-border/50 hidden md:block" />

          <LoginButton isScrolled={isScrolled} isHome={isHome} />
          <UserAvatar />

          {/* Mobile Menu Toggle - handled inside Navbar now, but we need to pass props */}
          <div className="lg:hidden">
            <Navbar isScrolled={isScrolled} isHome={isHome} isMobileOnly />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header