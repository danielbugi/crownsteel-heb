/*
  Warnings:

  - You are about to drop the column `nameEn` on the `blog_categories` table. All the data in the column will be lost.
  - You are about to drop the column `titleEn` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `blog_tags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."blog_categories" DROP COLUMN "nameEn";

-- AlterTable
ALTER TABLE "public"."blog_posts" DROP COLUMN "titleEn";

-- AlterTable
ALTER TABLE "public"."blog_tags" DROP COLUMN "nameEn";
