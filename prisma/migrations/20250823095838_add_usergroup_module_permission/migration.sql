-- CreateTable
CREATE TABLE "public"."UserGroup" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdById" UUID NOT NULL,
    "createdByRole" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedUserCount" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModulePermission" (
    "id" UUID NOT NULL,
    "moduleName" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "write" BOOLEAN NOT NULL DEFAULT false,
    "edit" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "export" BOOLEAN NOT NULL DEFAULT false,
    "userGroupId" UUID NOT NULL,

    CONSTRAINT "ModulePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserGroup_isDeleted_idx" ON "public"."UserGroup"("isDeleted");

-- CreateIndex
CREATE INDEX "UserGroup_isActive_idx" ON "public"."UserGroup"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UserGroup_name_createdById_key" ON "public"."UserGroup"("name", "createdById");

-- CreateIndex
CREATE UNIQUE INDEX "ModulePermission_userGroupId_moduleName_key" ON "public"."ModulePermission"("userGroupId", "moduleName");

-- AddForeignKey
ALTER TABLE "public"."ModulePermission" ADD CONSTRAINT "ModulePermission_userGroupId_fkey" FOREIGN KEY ("userGroupId") REFERENCES "public"."UserGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
