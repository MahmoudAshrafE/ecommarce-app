import { LucideIcon } from "lucide-react"

interface PageHeroProps {
    title: React.ReactNode;
    subtitle?: string;
    badgeIcon: LucideIcon;
    badgeText: string;
}

const PageHero = ({ title, subtitle, badgeIcon: Icon, badgeText }: PageHeroProps) => {
    return (
        <section className="relative pt-32 pb-20 bg-[#0a0a0b] text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-orange-500 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-6 font-bold text-sm tracking-widest uppercase text-primary">
                    <Icon className="w-4 h-4" />
                    {badgeText}
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 uppercase italic">
                    {title}
                </h1>
                {subtitle && (
                    <p className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    )
}

export default PageHero
