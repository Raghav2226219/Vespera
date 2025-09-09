-- CreateEnum
CREATE TYPE "public"."InviteAction" AS ENUM ('SENT', 'ACCEPTED', 'CANCELLED', 'SUSPICIOUS', 'PENDING');

-- CreateTable
CREATE TABLE "public"."InviteLog" (
    "id" SERIAL NOT NULL,
    "boardId" INTEGER NOT NULL,
    "inviteId" INTEGER NOT NULL,
    "inviterId" INTEGER NOT NULL,
    "acceptedById" INTEGER,
    "inviteeEmail" TEXT NOT NULL,
    "action" "public"."InviteAction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InviteLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InviteLog_boardId_idx" ON "public"."InviteLog"("boardId");

-- CreateIndex
CREATE INDEX "InviteLog_inviterId_idx" ON "public"."InviteLog"("inviterId");

-- CreateIndex
CREATE INDEX "InviteLog_acceptedById_idx" ON "public"."InviteLog"("acceptedById");

-- AddForeignKey
ALTER TABLE "public"."InviteLog" ADD CONSTRAINT "InviteLog_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InviteLog" ADD CONSTRAINT "InviteLog_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "public"."Invite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InviteLog" ADD CONSTRAINT "InviteLog_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InviteLog" ADD CONSTRAINT "InviteLog_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
