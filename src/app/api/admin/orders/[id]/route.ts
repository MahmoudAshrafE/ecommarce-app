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
        const { status, paid } = body;

        const order = await prisma.order.update({
            where: { id },
            data: {
                status: status,
                paid: paid
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order update error:", error);
        return NextResponse.json(
            { error: "Failed to update order" },
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

        // Delete order products first (optional if using cascade, but let's be explicit if not sure)
        // Actually Prisma schema says onDelete: Cascade for Category and Product, but OrderProduct -> Order?
        // Let's check schema: OrderProduct has fields: orderId, relates to Order.
        // It doesn't specify onDelete: Cascade.

        await prisma.orderProduct.deleteMany({
            where: { orderId: id }
        });

        await prisma.order.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Order delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete order" },
            { status: 500 }
        );
    }
}
