-- AlterTable
ALTER TABLE "public"."settings" ADD COLUMN     "adminNotificationEmail" TEXT NOT NULL DEFAULT 'admin@forgesteel.com',
ADD COLUMN     "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "freeShippingThreshold" DECIMAL(10,2) NOT NULL DEFAULT 350,
ADD COLUMN     "processingTime" TEXT NOT NULL DEFAULT '2-3 business days',
ADD COLUMN     "shippingCost" DECIMAL(10,2) NOT NULL DEFAULT 20,
ADD COLUMN     "shippingDescription" TEXT NOT NULL DEFAULT 'Standard shipping within Israel',
ADD COLUMN     "smtpFromEmail" TEXT NOT NULL DEFAULT 'contact@forgesteel.com',
ADD COLUMN     "smtpReplyToEmail" TEXT,
ALTER COLUMN "address" SET DEFAULT 'Online E-commerce Store',
ALTER COLUMN "taxRate" SET DEFAULT 18;
