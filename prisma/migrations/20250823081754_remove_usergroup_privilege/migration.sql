/*
  Warnings:

  - You are about to drop the `Privilege` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_assignedGroupId_fkey";

-- DropTable
DROP TABLE "public"."Privilege";

-- DropTable
DROP TABLE "public"."UserGroup";

-- DropEnum
DROP TYPE "public"."CreatedByRole";
