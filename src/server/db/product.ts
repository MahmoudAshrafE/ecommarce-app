import { cache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { unstable_cache as nextCache } from 'next/cache';
import { cache as reactCache } from 'react';

export const getBestSellers = (limit: number | undefined, excludeCategories?: string[]) => nextCache(
    reactCache(async () => {
        const where = excludeCategories ? {
            category: {
                name: {
                    notIn: excludeCategories
                }
            }
        } : {};

        const bestSallers = await prisma.product.findMany({
            where,
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
    }),
    ['best-sellers', limit?.toString() || 'all', excludeCategories?.join(',') || 'none'],
    { revalidate: 3600, tags: ['products'] }
)();


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
}, ['products-by-category'], { revalidate: 3600, tags: ['categories', 'products'] })

export const getProductById = (id: string) => nextCache(
    reactCache(async () => {
        console.log(`getProductById: Fetching product ${id} from DB`);
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
        console.log(`getProductById: Found ${product?.reviews.length || 0} reviews`);
        return product;
    }),
    ['product-by-id', id],
    { revalidate: 3600, tags: ['products'] }
)();
