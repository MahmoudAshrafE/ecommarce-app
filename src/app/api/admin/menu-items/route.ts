import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/generated/prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

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
        const { name, nameAr, description, descriptionAr, image, basePrice, categoryId, sizes, extras } = body;

        const product = await prisma.product.create({
            data: {
                name,
                nameAr,
                description,
                descriptionAr,
                image,
                basePrice: parseFloat(basePrice),
                categoryId,
                order: 0, // Default order
                sizes: {
                    create: sizes?.map((s: any) => ({
                        name: s.name,
                        price: parseFloat(s.price)
                    })) || []
                },
                extras: {
                    create: extras?.map((e: any) => ({
                        name: e.name,
                        price: parseFloat(e.price)
                    })) || []
                }
            }
        });

        // Revalidate cache
        revalidateTag('products');
        revalidatePath('/', 'layout');

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Product creation error:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
