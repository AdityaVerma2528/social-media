/*
  Warnings:

  - Added the required column `followingAvatar` to the `Follows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingEmail` to the `Follows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Follows" ADD COLUMN     "followingAvatar" TEXT NOT NULL,
ADD COLUMN     "followingEmail" TEXT NOT NULL;
