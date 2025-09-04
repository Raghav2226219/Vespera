/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,title]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Board_ownerId_title_key" ON "public"."Board"("ownerId", "title");
