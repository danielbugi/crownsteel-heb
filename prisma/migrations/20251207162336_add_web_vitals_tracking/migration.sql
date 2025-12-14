-- CreateTable
CREATE TABLE "public"."web_vitals_metrics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "navigationType" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_vitals_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "web_vitals_metrics_name_idx" ON "public"."web_vitals_metrics"("name");

-- CreateIndex
CREATE INDEX "web_vitals_metrics_timestamp_idx" ON "public"."web_vitals_metrics"("timestamp");

-- CreateIndex
CREATE INDEX "web_vitals_metrics_rating_idx" ON "public"."web_vitals_metrics"("rating");
