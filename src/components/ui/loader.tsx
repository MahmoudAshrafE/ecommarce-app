"use client";

import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "spinner" | "dots" | "ring" | "modern" | "burger";
}

export const Loader = ({ className, size = "md", variant = "burger" }: LoaderProps) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    if (variant === "dots") {
        return (
            <div className={cn("flex space-x-1", className)}>
                <div className={cn("bg-primary rounded-full animate-bounce [animation-delay:-0.3s]", sizeClasses[size])}></div>
                <div className={cn("bg-primary rounded-full animate-bounce [animation-delay:-0.15s]", sizeClasses[size])}></div>
                <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size])}></div>
            </div>
        );
    }

    if (variant === "ring") {
        return (
            <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
                <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (variant === "modern") {
        return (
            <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
                {/* Outer subtle ring */}
                <div className="absolute inset-0 rounded-full border-[3px] border-primary/10"></div>
                {/* Inner spinning ring */}
                <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin [animation-duration:0.8s]"></div>
                {/* Inner glow (optional, adds modern touch) */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_10px_theme('colors.primary.DEFAULT')] opacity-20 animate-pulse"></div>
            </div>
        );
    }

    if (variant === "burger") {
        const textSizes = {
            sm: "text-lg",
            md: "text-3xl",
            lg: "text-5xl",
            xl: "text-7xl",
        };
        return (
            <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
                {/* Burger Icon with jump animation */}
                <div className={cn("relative z-10 animate-bounce transition-all duration-300", textSizes[size])}>
                    🍔
                </div>
                {/* Radiant glow behind the burger */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse scale-150"></div>
                {/* Rotating ring around the burger */}
                <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite]"></div>
            </div>
        );
    }

    // Classic spinner default
    return (
        <div
            className={cn(
                "rounded-full border-2 border-current border-t-transparent animate-spin text-primary",
                sizeClasses[size],
                className
            )}
        />
    );
};
