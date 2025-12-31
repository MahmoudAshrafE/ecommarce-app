import { Loader } from "@/components/ui/loader";

export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <Loader size="xl" variant="burger" />
                <p className="animate-pulse text-sm font-medium text-muted-foreground">
                    Loading...
                </p>
            </div>
        </div>
    );
}
