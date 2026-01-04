import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/generated/prisma/client";

interface SizeInput {
    name: string;
    price: string | number;
}

interface ExtraInput {
    name: string;
    price: string | number;
}


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
        const { name, nameAr, description, descriptionAr, image, basePrice, categoryId, onOffer, sizes, extras } = body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                nameAr,
                description,
                descriptionAr,
                image,
                basePrice: parseFloat(basePrice),
                categoryId,
                onOffer,
                sizes: {
                    deleteMany: {},
                    create: sizes?.map((s: SizeInput) => ({
                        name: s.name,
                        price: parseFloat(s.price.toString())
                    })) || []

                },
                extras: {
                    deleteMany: {},
                    create: extras?.map((e: ExtraInput) => ({
                        name: e.name,
                        price: parseFloat(e.price.toString())
                    })) || []

                }
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update product" },
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

        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
