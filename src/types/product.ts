import { Prisma } from "@/generated/prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    sizes: true,
    extras: true,
    reviews: {
      include: {
        user: true
      }
    }
  }
}>

export enum ProductSizes {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

