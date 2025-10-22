-- AlterTable
ALTER TABLE "public"."cart_items" ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "public"."inventory_alerts" ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "public"."inventory_logs" ADD COLUMN     "variantId" TEXT;

-- AlterTable
ALTER TABLE "public"."order_items" ADD COLUMN     "variantId" TEXT,
ADD COLUMN     "variantSnapshot" JSONB;

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "hasVariants" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "variantLabel" TEXT,
ADD COLUMN     "variantLabelHe" TEXT,
ADD COLUMN     "variantType" TEXT;

-- CreateTable
CREATE TABLE "public"."product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "nameHe" TEXT,
    "sku" TEXT NOT NULL,
    "price" DECIMAL(10,2),
    "priceAdjustment" DECIMAL(10,2),
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "lowStockThreshold" INTEGER,
    "image" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "public"."product_variants"("sku");

-- CreateIndex
CREATE INDEX "product_variants_productId_idx" ON "public"."product_variants"("productId");

-- CreateIndex
CREATE INDEX "product_variants_sku_idx" ON "public"."product_variants"("sku");

-- AddForeignKey
ALTER TABLE "public"."product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_logs" ADD CONSTRAINT "inventory_logs_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_alerts" ADD CONSTRAINT "inventory_alerts_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
