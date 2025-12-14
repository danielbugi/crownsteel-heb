-- CreateIndex
CREATE INDEX "orders_userId_status_createdAt_idx" ON "public"."orders"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "reviews_status_createdAt_idx" ON "public"."reviews"("status", "createdAt");
