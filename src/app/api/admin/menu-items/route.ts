import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                category: true,
                sizes: true,
                extras: true,
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Products fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, image, basePrice, categoryId, sizes, extras } = body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                image,
                basePrice: parseFloat(basePrice),
                categoryId,
                order: 0, // Default order
                sizes: {
                    create: sizes,
                },
                extras: {
                    create: extras,
                }
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Product creation error:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
