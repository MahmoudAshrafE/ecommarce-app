"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import { useSession } from "next-auth/react";

const ContactForm = () => {
    const t = useTranslations("home.contact.form");
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: (e.target as any).name.value,
                    email: (e.target as any).email.value,
                    message: (e.target as any).message.value,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            toast({
                title: t("success"),
                description: "We'll get back to you as soon as possible.",
            });
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            toast({
                variant: "destructive",
                title: t("error"),
                description: "Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl shadow-lg border border-border/50">
            <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" name="name" placeholder={t("name")} defaultValue={session?.user?.name || ""} required className="bg-background" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" name="email" type="email" placeholder={t("email")} defaultValue={session?.user?.email || ""} required className="bg-background" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">{t("message")}</Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder={t("message")}
                    className="min-h-[150px] bg-background resize-none"
                    required
                />
            </div>
            <Button type="submit" className="w-full text-lg font-medium" loading={loading}>
                {t("send")}
            </Button>
        </form>
    );
};

export default ContactForm;
