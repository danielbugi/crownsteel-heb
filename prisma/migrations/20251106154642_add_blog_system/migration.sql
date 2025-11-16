-- CreateEnum
CREATE TYPE "public"."BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."blog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT[],
    "featuredImage" TEXT,
    "images" TEXT[],
    "status" "public"."BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "categoryId" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "readTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_post_tags" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "public"."blog_categories"("slug");

-- CreateIndex
CREATE INDEX "blog_categories_slug_idx" ON "public"."blog_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_slug_idx" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_idx" ON "public"."blog_posts"("status");

-- CreateIndex
CREATE INDEX "blog_posts_publishedAt_idx" ON "public"."blog_posts"("publishedAt");

-- CreateIndex
CREATE INDEX "blog_posts_categoryId_idx" ON "public"."blog_posts"("categoryId");

-- CreateIndex
CREATE INDEX "blog_posts_authorId_idx" ON "public"."blog_posts"("authorId");

-- CreateIndex
CREATE INDEX "blog_posts_featured_idx" ON "public"."blog_posts"("featured");

-- CreateIndex
CREATE INDEX "blog_posts_status_publishedAt_idx" ON "public"."blog_posts"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_name_key" ON "public"."blog_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_key" ON "public"."blog_tags"("slug");

-- CreateIndex
CREATE INDEX "blog_tags_slug_idx" ON "public"."blog_tags"("slug");

-- CreateIndex
CREATE INDEX "blog_post_tags_postId_idx" ON "public"."blog_post_tags"("postId");

-- CreateIndex
CREATE INDEX "blog_post_tags_tagId_idx" ON "public"."blog_post_tags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_tags_postId_tagId_key" ON "public"."blog_post_tags"("postId", "tagId");

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."blog_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_tags" ADD CONSTRAINT "blog_post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_tags" ADD CONSTRAINT "blog_post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."blog_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
