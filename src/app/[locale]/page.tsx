import BestSellers from "./_components/BestSellers";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Testimonials from "./_components/Testimonials";
import About from "@/components/about";
import HowItWorks from "./_components/HowItWorks";
import Stats from "./_components/Stats";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="overflow-hidden bg-background">
      {/* 1. Hero Section - Catchy & Data Driven */}
      <Hero locale={locale} />

      {/* 2. Stats Section - Trust & Impact */}
      <div className="bg-gradient-to-b from-background to-secondary/20">
        <Stats locale={locale} />
      </div>

      {/* 3. Features Section - Our Value Props */}
      <Features locale={locale} />

      {/* 4. Best Sellers - Direct Product Access */}
      <div className="bg-secondary/10">
        <BestSellers locale={locale} />
      </div>

      {/* 5. How It Works - Practical steps */}
      <HowItWorks locale={locale} />

      {/* 6. About Section - Story & Quality */}
      <div className="bg-secondary/20">
        <About locale={locale} />
      </div>

      {/* 7. Social Proof - Testimonials */}
      <Testimonials locale={locale} />
    </main>
  );
}
