import AdminTabs from './_components/AdminTabs';
import { UserRole } from '@/generated/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Pages, Routes } from '@/constants/enums';
import PageHero from '@/components/PageHero';
import { ShieldCheck } from 'lucide-react';

const AdminLayout = async ({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) => {
    const { locale } = await params;
    const session = await getServerSession(authOptions);
    const t = await getTranslations({ locale, namespace: 'admin' });

    if (!session || session.user.role !== UserRole.ADMIN) {
        redirect(`/${Routes.AUTH}/${Pages.LOGIN}`);
    }

    return (
        <main className='min-h-screen bg-background'>
            <PageHero
                badgeIcon={ShieldCheck}
                badgeText={t('admin')}
                title={t('admin')}
                subtitle={t('subtitle')}
            />
            <div className='container mx-auto py-12'>
                <AdminTabs />
                {children}
            </div>
        </main>
    );
};

export default AdminLayout;
