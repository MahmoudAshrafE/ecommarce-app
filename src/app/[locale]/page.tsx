
import BestSallers from "./_components/BestSallers";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Testimonials from "./_components/Testimonials";
import About from "@/components/about";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="overflow-hidden">
      <Hero locale={locale} />
      <div className="bg-secondary/5 py-10 md:py-16">
        <About locale={locale} />
      </div>
      <BestSallers locale={locale} />

      <Features locale={locale} />
      <Testimonials locale={locale} />
    </main>
  );
}
