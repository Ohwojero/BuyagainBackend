/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `referrals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `referrals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "referrals" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "referrals_code_key" ON "referrals"("code");
