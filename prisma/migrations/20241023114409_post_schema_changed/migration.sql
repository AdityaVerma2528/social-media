/*
  Warnings:

  - You are about to drop the column `imageurl` on the `Post` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageurl",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "fileSize" TEXT NOT NULL;
