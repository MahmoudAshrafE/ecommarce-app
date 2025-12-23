import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CartItem } from "@/redux/features/cart/cartSlice";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            phone,
            streetAddress,
            postalCode,
            city,
            country,
            cartItems,
            subTotal,
            deliveryFee,
            totalPrice
        } = body;

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const order = await prisma.order.create({
            data: {
                userEmail: session.user.email!,
                userId: session.user.id, // Ensure we link to the user
                phone,
                streetAddress,
                postalCode,
                city,
                country,
                subTotal,
                deliveryFee,
                totalPrice,
                products: {
                    create: cartItems.map((item: CartItem) => ({
                        productId: item.id,
                        quantity: item.quantity || 1,
                        sizeId: item.size?.id,
                        extras: {
                            connect: item.extras?.map(extra => ({ id: extra.id })) || []
                        }
                    }))
                }
            }
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                products: {
                    include: {
                        product: true,
                        size: true,
                        extras: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
