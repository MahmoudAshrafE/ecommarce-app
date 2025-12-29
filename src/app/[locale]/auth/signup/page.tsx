import SignupForm from "../_components/SignupForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Routes } from "@/constants/enums";

const SignupPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params;
    const session = await getServerSession(authOptions);
    if (session) {
        redirect(`/${locale}`);
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
            <SignupForm />
        </main>
    );
};

export default SignupPage;
