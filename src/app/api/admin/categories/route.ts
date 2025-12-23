import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                order: 'asc',
            },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Categories fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
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
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
            }
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Category creation error:", error);
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
