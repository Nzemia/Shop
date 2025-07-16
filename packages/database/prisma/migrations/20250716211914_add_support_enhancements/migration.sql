-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "support_messages" ADD COLUMN     "priority" "SupportPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "status" "SupportStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "subject" TEXT NOT NULL DEFAULT 'Support Request',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "support_responses" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "support_responses" ADD CONSTRAINT "support_responses_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "support_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
