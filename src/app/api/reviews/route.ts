
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
    const logFile = path.join(process.cwd(), 'review-api-log.txt');
    try {
        const session = await getServerSession(authOptions)
        fs.appendFileSync(logFile, `\n[${new Date().toISOString()}] REVIEW_POST: Session user: ${JSON.stringify(session?.user)}\n`);

        if (!session?.user) {
            fs.appendFileSync(logFile, `[${new Date().toISOString()}] REVIEW_POST: Unauthorized\n`);
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        fs.appendFileSync(logFile, `[${new Date().toISOString()}] REVIEW_POST: Body: ${JSON.stringify(body)}\n`);
        const { productId, rating, comment } = body

        if (!productId || rating === undefined || !comment) {
            fs.appendFileSync(logFile, `[${new Date().toISOString()}] REVIEW_POST: Missing fields: ${JSON.stringify({ productId, rating, comment })}\n`);
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                productId,
                rating: Number(rating),
                comment,
            },
            include: {
                user: true
            }
        })
        fs.appendFileSync(logFile, `[${new Date().toISOString()}] REVIEW_POST: Review created successfully: ${review.id}\n`);

        revalidatePath("/", "layout")

        return NextResponse.json(review)
    } catch (error: any) {
        fs.appendFileSync(logFile, `[${new Date().toISOString()}] REVIEW_POST_ERROR: ${error.message}\n${error.stack}\n`);
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
