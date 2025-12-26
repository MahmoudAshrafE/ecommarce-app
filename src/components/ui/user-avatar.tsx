import { cn } from "@/lib/utils"
import Image from "next/image"

interface UserAvatarProps {
    image?: string | null
    name?: string | null
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const UserAvatar = ({ image, name, className, size = 'md' }: UserAvatarProps) => {
    const initials = name
        ? name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'U'

    const sizeClasses = {
        sm: 'w-8 h-8 text-[10px]',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-28 h-28 text-4xl',
    }

    return (
        <div
            className={cn(
                "rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0 transition-transform",
                sizeClasses[size],
                className
            )}
        >
            {image ? (
                <Image
                    src={image}
                    alt={name || 'User'}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="uppercase">{initials}</span>
            )}
        </div>
    )
}

export default UserAvatar
