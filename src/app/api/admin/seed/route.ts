import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole, ProductSizes, ProductExtra } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log('Starting seed...');

        // 1. Clear existing data
        await prisma.orderProduct.deleteMany({});
        await prisma.review.deleteMany({});
        await prisma.size.deleteMany({});
        await prisma.extra.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});

        // 2. Define 7 Categories
        const categoriesData = [
            { name: 'Beef Burgers', nameAr: 'برجر لحم' },
            { name: 'Chicken Burgers', nameAr: 'برجر دجاج' },
            { name: 'Signature Burgers', nameAr: 'برجر مميز' },
            { name: 'Spicy Collection', nameAr: 'تشكيلة حارة' },
            { name: 'Cold Drinks', nameAr: 'مشروبات باردة' },
            { name: 'Fresh Juices', nameAr: 'عصائر طازجة' },
            { name: 'Milkshakes', nameAr: 'ميلك شيك' },
        ];

        const createdCategories = [];
        for (const cat of categoriesData) {
            const created = await prisma.category.create({ data: cat });
            createdCategories.push(created);
        }

        // Helper to get random item from array
        const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];


        // 3. Generate 50 Products
        const burgerImages = [
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop'
        ];

        const drinkImages = [
            'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=1000&auto=format&fit=crop'
        ];

        const products = [];
        const burgerAdjectives = ['Classic', 'Double', 'Spicy', 'Smokey', 'Cheesy', 'Ultimate', 'Crispy', 'Mega', 'Royal', 'BBQ'];
        const burgerNouns = ['Delight', 'Supreme', 'Stack', 'Feast', 'Tower', 'Blast', 'Crunch', 'King', 'Master', 'Smasher'];
        const drinkAdjectives = ['Ice', 'Sparkling', 'Sweet', 'Tropical', 'Creamy', 'Berry', 'Citrus', 'Cool', 'Fizzy', 'Smooth'];
        const drinkNouns = ['Refresh', 'Splash', 'Burst', 'Twist', 'Shake', 'Cooler', 'Punch', 'Breeze', 'Fusion', 'Mix'];

        for (let i = 0; i < 50; i++) {
            const isBurger = i < 35; // 35 Burgers, 15 Drinks
            let category;

            if (isBurger) {
                // cycle through first 4 categories
                category = createdCategories[i % 4];
            } else {
                // cycle through last 3 categories
                category = createdCategories[4 + (i % 3)];
            }

            const name = isBurger
                ? `${getRandom(burgerAdjectives)} ${getRandom(burgerNouns)} ${i + 1}`
                : `${getRandom(drinkAdjectives)} ${getRandom(drinkNouns)} ${i + 1}`;

            const nameAr = isBurger
                ? `${getRandom(burgerAdjectives) === 'Spicy' ? 'حار' : 'مميز'} برجر ${i + 1}`
                : `مشروب ${i + 1}`;

            const product = {
                name,
                nameAr,
                description: isBurger
                    ? `Delicious flame-grilled burger with fresh ingredients. Item #${i + 1}`
                    : `Refreshing drink to quench your thirst. Item #${i + 1}`,
                descriptionAr: isBurger
                    ? `برجر مشوي لذيذ مع مكونات طازجة. عنصر #${i + 1}`
                    : `مشروب منعش يروي عطشك. عنصر #${i + 1}`,
                basePrice: isBurger ? 8.99 + (i % 10) : 2.99 + (i % 5),
                image: isBurger ? getRandom(burgerImages) : getRandom(drinkImages),
                categoryId: category.id,
                order: i + 1,
                sizes: {
                    create: [
                        { name: ProductSizes.SMALL, price: isBurger ? 8.99 + (i % 10) : 2.99 + (i % 5) },
                        { name: ProductSizes.MEDIUM, price: isBurger ? 10.99 + (i % 10) : 3.99 + (i % 5) },
                        { name: ProductSizes.LARGE, price: isBurger ? 12.99 + (i % 10) : 4.99 + (i % 5) },
                    ]
                },
                extras: isBurger ? {
                    create: [
                        { name: ProductExtra.CHEESE, price: 1.50 },
                        { name: ProductExtra.ONION, price: 0.50 },
                        { name: ProductExtra.TOMATO, price: 0.50 },
                        { name: ProductExtra.POTATO, price: 2.00 },
                    ]
                } : undefined
            };

            products.push(product);
        }

        for (const prod of products) {
            await prisma.product.create({ data: prod });
        }

        console.log(`Successfully seeded ${createdCategories.length} categories and ${products.length} products.`);

        return NextResponse.json({
            success: true,
            message: `Seed completed: ${createdCategories.length} categories, ${products.length} products`
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: "Failed to seed data" },
            { status: 500 }
        );
    }
}
