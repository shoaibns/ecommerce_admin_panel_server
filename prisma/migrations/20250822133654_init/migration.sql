-- CreateEnum
CREATE TYPE "public"."CreatedByRole" AS ENUM ('superAdmin');

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailHash" TEXT,
    "mobileNumber" TEXT NOT NULL,
    "profilePicture" TEXT,
    "city" TEXT,
    "country" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "assignedGroupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "updatedBytype" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserGroup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByRole" "public"."CreatedByRole" NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "privileges" TEXT[],

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Privilege" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdByRole" "public"."CreatedByRole" NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Privilege_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_emailHash_key" ON "public"."Admin"("emailHash");

-- CreateIndex
CREATE INDEX "Admin_deletedAt_idx" ON "public"."Admin"("deletedAt");

-- CreateIndex
CREATE INDEX "UserGroup_isDeleted_idx" ON "public"."UserGroup"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "UserGroup_title_createdBy_key" ON "public"."UserGroup"("title", "createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Privilege_name_createdBy_createdByRole_key" ON "public"."Privilege"("name", "createdBy", "createdByRole");

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_assignedGroupId_fkey" FOREIGN KEY ("assignedGroupId") REFERENCES "public"."UserGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
