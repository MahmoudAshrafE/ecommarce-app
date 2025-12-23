import SigninForm from "../_components/SigninForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Routes } from "@/constants/enums";

const SigninPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect(`/${Routes.ROOT}`);
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
            <SigninForm />
        </main>
    );
};

export default SigninPage;
