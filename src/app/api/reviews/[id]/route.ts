
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@/generated/prisma/client'
import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params

    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const review = await prisma.review.findUnique({
            where: { id: params.id }
        })

        if (!review) {
            return new NextResponse('Review not found', { status: 404 })
        }

        if (session.user.role !== UserRole.ADMIN && session.user.id !== review.userId) {
            return new NextResponse('Forbidden', { status: 403 })
        }

        await prisma.review.delete({
            where: {
                id: params.id
            }
        })

        revalidatePath('/', 'layout')

        return NextResponse.json({ message: 'Review deleted successfully' })
    } catch (error) {
        console.error('[REVIEW_DELETE]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
