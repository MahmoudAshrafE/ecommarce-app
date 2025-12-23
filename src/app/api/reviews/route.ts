
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { productId, rating, comment } = body

        if (!productId || !rating || !comment) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                productId,
                rating: parseInt(rating),
                comment,
            }
        })

        revalidateTag("products")
        revalidatePath("/", "page")

        return NextResponse.json(review)
    } catch (error) {
        console.error("REVIEW_POST_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
