"use client";

import { Loader } from "@/components/ui/loader";
import { useTranslations } from "next-intl";

export default function Loading() {
    const t = useTranslations();

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                <Loader size="xl" variant="burger" />
                <div className="flex flex-col items-center gap-2">
                    <p className="animate-pulse text-lg font-black uppercase tracking-widest text-primary">
                        {t('loading')}
                    </p>
                    <div className="h-1 w-24 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full w-full animate-loading-bar bg-primary"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
