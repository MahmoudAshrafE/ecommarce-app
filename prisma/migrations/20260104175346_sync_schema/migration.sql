-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PREPARING', 'ON_WAY', 'DELIVERED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Extra" DROP CONSTRAINT "Extra_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Size" DROP CONSTRAINT "Size_productId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "nameAr" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "OrderProduct" ADD COLUMN     "sizeId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "descriptionAr" TEXT,
ADD COLUMN     "nameAr" TEXT,
ADD COLUMN     "onOffer" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExtraToOrderProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExtraToOrderProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "_ExtraToOrderProduct_B_index" ON "_ExtraToOrderProduct"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Extra" ADD CONSTRAINT "Extra_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToOrderProduct" ADD CONSTRAINT "_ExtraToOrderProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Extra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToOrderProduct" ADD CONSTRAINT "_ExtraToOrderProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
