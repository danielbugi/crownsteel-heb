-- CreateIndex for products table to improve query performance
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex for featured products filtering
CREATE INDEX "products_featured_idx" ON "products"("featured");

-- CreateIndex for stock availability filtering
CREATE INDEX "products_inStock_idx" ON "products"("inStock");

-- CreateIndex for sorting by creation date
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt");

-- CreateIndex for price sorting and filtering
CREATE INDEX "products_price_idx" ON "products"("price");

-- Compound indexes for common query combinations
CREATE INDEX "products_categoryId_featured_idx" ON "products"("categoryId", "featured");
CREATE INDEX "products_categoryId_inStock_idx" ON "products"("categoryId", "inStock");