import AdminTabs from './_components/AdminTabs';
import { UserRole } from '@/generated/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Pages, Routes } from '@/constants/enums';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageHero from '@/components/PageHero';

const AdminLayout = async ({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) => {
    const { locale } = await params;
    const session = await getServerSession(authOptions);
    const t = await getTranslations({ locale, namespace: 'admin' });

    const userRole = (session?.user?.role as string)?.toUpperCase();
    const isAdmin = userRole === 'ADMIN';

    if (!session || !isAdmin) {
        console.log(`[AdminLayout] Access Denied: Session? ${!!session}, Role: ${userRole}`);
        redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
    }

    return (
        <main className='min-h-screen bg-[#f8fafc] dark:bg-background/95 pt-16'>
            <div className="container mx-auto pt-8 pb-8 px-4">
                <Breadcrumbs />
                <div className={cn("mt-4 mb-8", locale === 'ar' && "text-right")}>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('admin')}</h1>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
                </div>
                <div className="mb-8">
                    <AdminTabs />
                </div>
            </div>

            <div className='container mx-auto pb-20 px-4'>
                {/* Main Content Area with Entrance Animation */}
                <div className="px-4">
                    <div className="bg-card/70 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 border border-border/50 shadow-xl shadow-black/[0.02] min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                        <div className="relative z-10">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminLayout;
