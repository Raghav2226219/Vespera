/*
  Warnings:

  - You are about to drop the column `phoneOtp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "phoneOtp",
DROP COLUMN "phoneVerified";
