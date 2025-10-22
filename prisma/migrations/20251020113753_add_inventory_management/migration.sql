/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."InventoryChangeType" AS ENUM ('SALE', 'RETURN', 'ADJUSTMENT', 'RESTOCK', 'DAMAGE', 'LOSS', 'RESERVATION', 'RELEASE');

-- CreateEnum
CREATE TYPE "public"."AlertType" AS ENUM ('LOW_STOCK', 'OUT_OF_STOCK', 'OVERSTOCK', 'EXPIRING_RESERVATION');

-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "reorderPoint" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "reorderQuantity" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "sku" TEXT;

-- CreateTable
CREATE TABLE "public"."inventory_logs" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "public"."InventoryChangeType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "reference" TEXT,
    "previousQty" INTEGER NOT NULL,
    "newQty" INTEGER NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_alerts" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "public"."AlertType" NOT NULL,
    "threshold" INTEGER,
    "message" TEXT NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedBy" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stock_reservations" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_logs_productId_idx" ON "public"."inventory_logs"("productId");

-- CreateIndex
CREATE INDEX "inventory_logs_createdAt_idx" ON "public"."inventory_logs"("createdAt");

-- CreateIndex
CREATE INDEX "inventory_alerts_productId_idx" ON "public"."inventory_alerts"("productId");

-- CreateIndex
CREATE INDEX "inventory_alerts_acknowledged_idx" ON "public"."inventory_alerts"("acknowledged");

-- CreateIndex
CREATE INDEX "inventory_alerts_createdAt_idx" ON "public"."inventory_alerts"("createdAt");

-- CreateIndex
CREATE INDEX "stock_reservations_productId_idx" ON "public"."stock_reservations"("productId");

-- CreateIndex
CREATE INDEX "stock_reservations_expiresAt_idx" ON "public"."stock_reservations"("expiresAt");

-- CreateIndex
CREATE INDEX "stock_reservations_status_idx" ON "public"."stock_reservations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "public"."products"("sku");

-- AddForeignKey
ALTER TABLE "public"."inventory_logs" ADD CONSTRAINT "inventory_logs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_alerts" ADD CONSTRAINT "inventory_alerts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stock_reservations" ADD CONSTRAINT "stock_reservations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
