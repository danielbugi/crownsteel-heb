-- CreateIndex
CREATE INDEX "products_featured_inStock_categoryId_idx" ON "public"."products"("featured", "inStock", "categoryId");
