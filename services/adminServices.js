import prisma from "../config/dbConnect.js";

const adminResponse = (admin) => {
  return {
    id: admin.id,
    fname: admin.fname,
    lname: admin.lname,
    email: admin.email,
    mobileNumber: admin.mobileNumber,
    showEmail: admin.showEmail,
    showMobile: admin.showMobile,
    city: admin.city,
    country: admin.country,
    role: admin.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
    profilePicture: admin.profilePicture,
    bannerImgUrl: admin.bannerImgUrl,
    assignedGroupId: admin.assignedGroupId,
    createdById: admin.createdById,
  };
};

const findOne = async (userId) => {
  const admin = await prisma.admin.findUnique({
    where: { id: userId }
  });
  return admin;
};

const findByEmail = async (emailHash) => {
  const admin = await prisma.admin.findUnique({
    where: { emailHash }
  });
  return admin;
};

const create = async (userData) => {
  // create subadmin
  return await prisma.admin.create({
    data: userData,
    select: {
      id: true,
      fname: true,
      lname: true,
      email: true,
      mobileNumber: true,
      role: true,
    },
  });
};

const update = async (adminId, updatedData) => {
  return await prisma.admin.update({
    where: { id: adminId },
    data: updatedData,
  });
};

// const updatedAdmin = 

export {
    adminResponse,
    findOne,
    findByEmail,
    create,
    update,
}