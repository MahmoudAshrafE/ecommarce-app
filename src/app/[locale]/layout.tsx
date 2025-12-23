import Header from "@/components/header";
import Footer from "@/components/footer";
import ReduxProvider from "@/providers/ReduxProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Directions, Languages } from "@/constants/enums";
import type { Metadata } from "next";
import { Cairo, Roboto } from "next/font/google";
import { Locale } from "@/i18n.config";
import "./globals.css";
import getTrans from "@/lib/translations";
import { NextIntlClientProvider } from "next-intl";

import { Toaster } from "@/components/ui/toaster";
import Hydration from "@/components/Hydration";

export async function generateStaticParams() {
  return [{ locale: Languages.ARABIC }, { locale: Languages.ENGLISH }];
}

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: true,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const locale = (await params).locale;
  const t = await getTrans(locale);
  return {
    title: t.metadata.title,
    description: t.metadata.description,
  };
}

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const locale = (await params).locale;
  const messages = await getTrans(locale);

  return (
    <html
      lang={locale}
      dir={locale === Languages.ARABIC ? Directions.RTL : Directions.LTR}
    >
      <body
        className={
          locale === Languages.ARABIC ? cairo.className : roboto.className
        }
      >
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ReduxProvider>
              <Hydration />
              <Header />
              {children}
              <Footer />
              <Toaster />
            </ReduxProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}