-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('free', 'standard', 'pro');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('ready', 'paid', 'failed', 'canceled');

-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'free',
ADD COLUMN     "planUpdatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentKey" TEXT,
    "plan" "Plan" NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'ready',
    "method" TEXT,
    "receiptUrl" TEXT,
    "failReason" TEXT,
    "requestedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentKey_key" ON "Payment"("paymentKey");

-- CreateIndex
CREATE INDEX "Payment_buildingId_status_idx" ON "Payment"("buildingId", "status");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;
