/*
  Warnings:

  - You are about to drop the column `fileName` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `Post` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "fileName",
DROP COLUMN "filePath",
DROP COLUMN "fileSize",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
