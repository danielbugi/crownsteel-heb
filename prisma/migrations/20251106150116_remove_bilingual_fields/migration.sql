/*
  Warnings:

  - You are about to drop the column `nameEn` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `nameHe` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionHe` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `nameHe` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionEn` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionHe` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `nameHe` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `variantLabelHe` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "nameEn",
DROP COLUMN "nameHe";

-- AlterTable
ALTER TABLE "public"."coupons" DROP COLUMN "descriptionHe";

-- AlterTable
ALTER TABLE "public"."product_variants" DROP COLUMN "nameEn",
DROP COLUMN "nameHe";

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "descriptionEn",
DROP COLUMN "descriptionHe",
DROP COLUMN "nameEn",
DROP COLUMN "nameHe",
DROP COLUMN "variantLabelHe";
