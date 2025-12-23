import { cache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

export const getBestSellers = cache(async (limit: number | undefined) => {
    const bestSallers = await prisma.product.findMany({
        where: {
            // orders:{
            //     some:{}
            // }
        },
        orderBy: {
            orders: {
                _count: 'desc'
            },
        },
        include: {
            sizes: true,
            extras: true,
            reviews: {
                include: {
                    user: true
                },
                take: 4,
                orderBy: {
                    createdAt: 'desc'
                }
            }
        },
        take: limit,
    });
    return bestSallers;
}, ['best-sellers'], { revalidate: 3600 })


export const getProductsByCategory = cache(async () => {
    const products = await prisma.category.findMany({
        include: {
            products: {
                include: {
                    sizes: true,
                    extras: true,
                    reviews: {
                        include: {
                            user: true
                        },
                        take: 4,
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            }
        }
    });
    return products;
}, ['products-by-category'], { revalidate: 3600 })

export const getProductById = cache(async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            sizes: true,
            extras: true,
            reviews: {
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
    return product;
}, ['product-by-id'], { revalidate: 3600, tags: ['products'] });

