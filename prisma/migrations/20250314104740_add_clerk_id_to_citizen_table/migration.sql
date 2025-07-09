/*
  Warnings:

  - Added the required column `clerkId` to the `Citizen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Citizen` ADD COLUMN `clerkId` VARCHAR(191) NOT NULL;
