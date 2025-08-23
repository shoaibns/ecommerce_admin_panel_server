import prisma from "../config/dbConnect.js";

const findByName = async (name, createdById) => {
  return prisma.userGroup.findFirst({
    where: { name, createdById, isDeleted: false },
  });
};

const findOne = async (userGroupId) => {
  if (!userGroupId) throw new Error("userGroupId is required");

  return prisma.userGroup.findUnique({
    where: { id: userGroupId },
    include: {
      permissions: true,
    },
  });
};

const findOneWithPermissions = async (userGroupId) => {
  return prisma.userGroup.findUnique({
    where: { id: userGroupId },
    include: { permissions: true },
  });
};

const createUserGroup = async (data) => {
  const { name, description, createdById, createdByRole, permissions } = data;

  return prisma.$transaction(async (tx) => {
    // Create group
    const group = await tx.userGroup.create({
      data: {
        name,
        description,
        createdById,
        createdByRole,
      },
    });

    // Insert module permissions
    if (permissions && permissions.length > 0) {
      const formattedPermissions = permissions.map((p) => ({
        moduleName: p.moduleName,
        read: p.read || false,
        write: p.write || false,
        edit: p.edit || false,
        delete: p.delete || false,
        export: p.export || false,
        userGroupId: group.id,
      }));

      await tx.modulePermission.createMany({
        data: formattedPermissions,
      });
    }

    return group;
  });
};

const userGroupList = async ({ search = "", skip, take, createdById, createdByRole }) => {
  try {
    const filter = {
      isDeleted: false,
      isActive: true,
      createdById,
      createdByRole,
      ...(search && {
        title: {                // ✅ changed from "name" to "title"
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    const queryOptions = {
      where: filter,
      orderBy: { createdAt: "desc" },
      include: {
        permissions: true,  
      },
    };

    if (typeof skip === "number") queryOptions.skip = skip;
    if (typeof take === "number") queryOptions.take = take;

    const [userGroup, total] = await Promise.all([
      prisma.userGroup.findMany(queryOptions),
      prisma.userGroup.count({ where: filter }),
    ]);

    return { userGroup, total };
    
  } catch (error) {
    throw new Error("Database query failed");
  }
};

const updateUserGroup = async (userGroupId, { name, description, permissions }) => {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Update the user group fields
    const group = await tx.userGroup.update({
      where: { id: userGroupId },
      data: { name, description },
    });

    if (permissions && Array.isArray(permissions)) {
      // Fetch existing permissions
      const existing = await tx.modulePermission.findMany({
        where: { userGroupId },
      });

      // Prepare maps
      const existingMap = new Map(existing.map(p => [p.moduleName, p]));
      const newMap = new Map(permissions.map(p => [p.moduleName, p]));

      // 2️⃣ Update existing or add new
      for (const [moduleName, newPerm] of newMap) {
        if (existingMap.has(moduleName)) {
          const oldPerm = existingMap.get(moduleName);
          // Update if anything changed
          if (
            oldPerm.read !== newPerm.read ||
            oldPerm.write !== newPerm.write ||
            oldPerm.edit !== newPerm.edit ||
            oldPerm.delete !== newPerm.delete ||
            oldPerm.export !== newPerm.export
          ) {
            await tx.modulePermission.update({
              where: { id: oldPerm.id },
              data: {
                read: newPerm.read || false,
                write: newPerm.write || false,
                edit: newPerm.edit || false,
                delete: newPerm.delete || false,
                export: newPerm.export || false,
              },
            });
          }
        } else {
          // Create new permission
          await tx.modulePermission.create({
            data: {
              moduleName,
              read: newPerm.read || false,
              write: newPerm.write || false,
              edit: newPerm.edit || false,
              delete: newPerm.delete || false,
              export: newPerm.export || false,
              userGroupId,
            },
          });
        }
      }

      // 3️⃣ Delete removed permissions
      for (const oldPerm of existing) {
        if (!newMap.has(oldPerm.moduleName)) {
          await tx.modulePermission.delete({ where: { id: oldPerm.id } });
        }
      }
    }

    return group;
  });
};

const updateStatus = async (userGroupId, newStatus) => {
  return prisma.userGroup.update({
    where: { id: userGroupId },
    data: { isActive: newStatus }
  });
};

const deleteGroup = async (userGroupId) => {
  return prisma.userGroup.update({
    where: { id: userGroupId },
    data: { 
      isDeleted: true,
      deletedAt: new Date()
    },
  });
};

export {
  findByName,
  findOne,
  findOneWithPermissions,
  createUserGroup,
  userGroupList,
  updateUserGroup,
  updateStatus,
  deleteGroup,
};