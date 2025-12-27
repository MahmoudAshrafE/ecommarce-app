import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/generated/prisma/client";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { name, nameAr } = body;

        const category = await prisma.category.update({
            where: { id },
            data: { name, nameAr }
        });

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Manually handle cascade delete for products in this category
        // In case the DB schema migration hasn't been run yet
        const products = await prisma.product.findMany({
            where: { categoryId: id },
            select: { id: true }
        });

        if (products.length > 0) {
            const productIds = products.map(p => p.id);

            // Delete sizes and extras for these products
            await prisma.size.deleteMany({
                where: { productId: { in: productIds } }
            });
            await prisma.extra.deleteMany({
                where: { productId: { in: productIds } }
            });

            // Delete common product relations that might block deletion
            // Reviews have onDelete: Cascade in schema so they are handled

            // Delete the products
            await prisma.product.deleteMany({
                where: { id: { in: productIds } }
            });
        }

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Category deleted" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}
