import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

interface SizeInput {
    name: string;
    price: string | number;
}

interface ExtraInput {
    name: string;
    price: string | number;
}


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
        const { name, nameAr, description, descriptionAr, image, basePrice, categoryId, onOffer, sizes, extras } = body;

        const product = await prisma.product.create({
            data: {
                name,
                nameAr,
                description,
                descriptionAr,
                image,
                basePrice: parseFloat(basePrice),
                categoryId,
                onOffer,
                order: 0, // Default order
                sizes: {
                    create: sizes?.map((s: SizeInput) => ({
                        name: s.name,
                        price: parseFloat(s.price.toString())
                    })) || []

                },
                extras: {
                    create: extras?.map((e: ExtraInput) => ({
                        name: e.name,
                        price: parseFloat(e.price.toString())
                    })) || []

                }
            }
        });

        // Revalidate cache
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
