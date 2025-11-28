-- CreateEnum
CREATE TYPE "public"."TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "priority" "public"."TaskPriority" NOT NULL DEFAULT 'MEDIUM';

-- CreateTable
CREATE TABLE "public"."TaskMention" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskMention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskMention_taskId_idx" ON "public"."TaskMention"("taskId");

-- CreateIndex
CREATE INDEX "TaskMention_userId_idx" ON "public"."TaskMention"("userId");

-- AddForeignKey
ALTER TABLE "public"."TaskMention" ADD CONSTRAINT "TaskMention_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskMention" ADD CONSTRAINT "TaskMention_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
