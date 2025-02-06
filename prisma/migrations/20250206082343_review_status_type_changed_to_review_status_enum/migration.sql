/*
  Warnings:

  - Changed the type of `status` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('ACCEPT', 'PENDING', 'DECLINE');

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "status",
ADD COLUMN     "status" "ReviewStatus" NOT NULL;
