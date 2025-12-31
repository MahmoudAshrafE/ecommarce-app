import BestSellers from "./_components/BestSellers";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Testimonials from "./_components/Testimonials";
import About from "@/components/about";
import HowItWorks from "./_components/HowItWorks";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="overflow-hidden bg-background">
      {/* 1. Hero Section - Catchy & Data Driven */}
      <Hero locale={locale} />


      {/* 3. Features Section - Our Value Props */}
      <div className="section-perf">
        <Features locale={locale} />
      </div>

      {/* 4. Best Sellers - Direct Product Access (with Suspense) */}
      <div className="bg-secondary/10 section-perf">
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <Loader size="xl" variant="burger" />
          </div>
        }>
          <BestSellers locale={locale} />
        </Suspense>
      </div>

      {/* 5. How It Works - Practical steps */}
      <div className="section-perf">
        <HowItWorks locale={locale} />
      </div>

      {/* 6. About Section - Story & Quality */}
      <div className="bg-secondary/20 section-perf">
        <About locale={locale} />
      </div>

      {/* 7. Social Proof - Testimonials (with Suspense) */}
      <div className="section-perf">
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" variant="burger" />
          </div>
        }>
          <Testimonials locale={locale} />
        </Suspense>
      </div>
    </main>
  );
}
