/*
  Warnings:

  - You are about to drop the column `status` on the `report_progress` table. All the data in the column will be lost.
  - Added the required column `phase` to the `report_progress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
BEGIN;

ALTER TABLE "report_progress" RENAME COLUMN "status" TO "phase";

ALTER TABLE "report_progress"
  ADD COLUMN "report_status" "ReportStatus" NOT NULL DEFAULT 'PENDING';

COMMIT;