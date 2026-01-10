-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "redemptionAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "usageWarnings" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "whatsappNotifications" BOOLEAN NOT NULL DEFAULT false;
