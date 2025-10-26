-- DropIndex
DROP INDEX "public"."products_price_idx";

-- CreateTable
CREATE TABLE "public"."performance_metrics" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "performance_metrics_endpoint_idx" ON "public"."performance_metrics"("endpoint");

-- CreateIndex
CREATE INDEX "performance_metrics_timestamp_idx" ON "public"."performance_metrics"("timestamp");

-- CreateIndex
CREATE INDEX "products_featured_inStock_idx" ON "public"."products"("featured", "inStock");
