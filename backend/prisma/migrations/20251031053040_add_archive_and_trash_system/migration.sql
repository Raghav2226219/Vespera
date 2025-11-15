/*
  Warnings:

  - You are about to drop the column `isArchived` on the `Board` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."BoardStatus" AS ENUM ('active', 'archived', 'trashed');

-- AlterTable
ALTER TABLE "public"."Board" DROP COLUMN "isArchived",
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "archivedById" INTEGER,
ADD COLUMN     "status" "public"."BoardStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "trashedAt" TIMESTAMP(3),
ADD COLUMN     "trashedById" INTEGER;

-- CreateTable
CREATE TABLE "public"."BoardAudit" (
    "id" SERIAL NOT NULL,
    "boardId" INTEGER NOT NULL,
    "actorId" INTEGER,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoardAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoardAudit_boardId_idx" ON "public"."BoardAudit"("boardId");

-- CreateIndex
CREATE INDEX "BoardAudit_actorId_idx" ON "public"."BoardAudit"("actorId");

-- CreateIndex
CREATE INDEX "Board_status_idx" ON "public"."Board"("status");

-- CreateIndex
CREATE INDEX "Board_trashedAt_idx" ON "public"."Board"("trashedAt");

-- AddForeignKey
ALTER TABLE "public"."Board" ADD CONSTRAINT "Board_archivedById_fkey" FOREIGN KEY ("archivedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Board" ADD CONSTRAINT "Board_trashedById_fkey" FOREIGN KEY ("trashedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardAudit" ADD CONSTRAINT "BoardAudit_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardAudit" ADD CONSTRAINT "BoardAudit_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
