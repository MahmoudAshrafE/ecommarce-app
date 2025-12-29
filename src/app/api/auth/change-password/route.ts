import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { compare, hash } from "bcrypt"

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
        }

        if (currentPassword === newPassword) {
            return NextResponse.json({ error: "New password must be different from current password" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            }
        })

        if (!user || !user.password) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const isPasswordValid = await compare(currentPassword, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid current password" }, { status: 400 })
        }

        const hashedPassword = await hash(newPassword, 10)

        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                password: hashedPassword
            }
        })

        return NextResponse.json({ message: "Password updated successfully" })
    } catch (error) {
        console.error("CHANGE_PASSWORD_ERROR", error)
        return NextResponse.json({ error: "Internal Error" }, { status: 500 })
    }
}
