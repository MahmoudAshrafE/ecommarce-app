import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // TODO: Check if user is admin

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            totalProducts,
            totalOrders,
            allOrders,
            usersCurrentPeriod,
            usersPreviousPeriod,
            ordersCurrentPeriod,
            ordersPreviousPeriod,
            productsCurrentPeriod,
            productsPreviousPeriod,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.order.findMany({ select: { totalPrice: true } }),
            // Users trends
            prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
            prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
            // Orders trends
            prisma.order.findMany({
                where: { createdAt: { gte: thirtyDaysAgo } },
                select: { totalPrice: true }
            }),
            prisma.order.findMany({
                where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
                select: { totalPrice: true }
            }),
            // Products trends
            prisma.product.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
            prisma.product.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
        ]);

        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        const revenueCurrentPeriod = ordersCurrentPeriod.reduce((sum, order) => sum + order.totalPrice, 0);
        const revenuePreviousPeriod = ordersPreviousPeriod.reduce((sum, order) => sum + order.totalPrice, 0);

        const calculateTrend = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        return NextResponse.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            trends: {
                users: calculateTrend(usersCurrentPeriod, usersPreviousPeriod),
                products: calculateTrend(productsCurrentPeriod, productsPreviousPeriod),
                orders: calculateTrend(ordersCurrentPeriod.length, ordersPreviousPeriod.length),
                revenue: calculateTrend(revenueCurrentPeriod, revenuePreviousPeriod),
            }
        });
    } catch (error) {
        console.error("Stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
