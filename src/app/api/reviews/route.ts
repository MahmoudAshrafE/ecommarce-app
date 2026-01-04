import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            console.error("[REVIEWS_API] Unauthorized: No session found on Vercel");
            return NextResponse.json(
                { error: "You must be signed in to leave a review." },
                { status: 401 }
            )
        }

        const body = await req.json().catch(() => null)
        if (!body) {
            return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
        }

        const { productId, rating, comment } = body

        if (!productId || rating === undefined || !comment) {
            console.error("[REVIEWS_API] Missing fields:", { productId, rating, comment });
            return NextResponse.json(
                { error: "Missing required fields: Product ID, Rating, and Comment are all required." },
                { status: 400 }
            )
        }

        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                productId,
                rating: Number(rating),
                comment,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        })

        console.log(`[REVIEWS_API] Success: Review ${review.id} added for product ${productId}`);

        // Trigger cache revalidation
        try {
            revalidatePath("/", "layout")
        } catch (revalidateError) {
            console.error("[REVIEWS_API] Revalidation error (non-fatal):", revalidateError);
        }

        return NextResponse.json(review)
    } catch (error: any) {
        console.error("[REVIEWS_API_ERROR]", error);
        return NextResponse.json(
            { error: `Server Error: ${error.message}` },
            { status: 500 }
        )
    }
}
