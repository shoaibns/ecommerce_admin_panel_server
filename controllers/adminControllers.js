import { sendError, sendSuccess } from "../utils/responseWrapper.js"
import { encrypt, decrypt, hashEmail } from "../utils/encryption.js"
import * as adminServices from "../services/adminServices.js"
import * as userGroupServices from "../services/userGroupServices.js"
import { comparePasswords, generateToken, hashPassword } from "../utils/auth.js"
import path from "path";
import fs from "fs";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { sendEmail } from "../utils/sendEmail.js"

const registerSubAdmin = async (req, res) => {
  const t = req.t;
  try {
    if (!req.body || Object.keys(req.body).length === 0)
      return sendError(res, t("body_required"));

    const { fname, lname, email, password, mobileNumber, assignedGroupId } =
      req.body;

      console.log("______", { fname, lname, email, password, mobileNumber, assignedGroupId });

    if (!fname || !lname || !email || !password || !mobileNumber)
      return sendError(res, t("all_fields_required"));

    const emailHash = hashEmail(email);

    const existingAdmin = await adminServices.findByEmail(emailHash);

    if (existingAdmin) return sendError(res, t("email_in_use"));

    const hashedPassword = await hashPassword(password, 10);
    const encryptedEmail = encrypt(email.trim());
    const encryptedMobile = encrypt(mobileNumber.trim());

    const newUser = await adminServices.create({
      fname,
      lname,
      email: encryptedEmail,
      emailHash,
      password: hashedPassword,
      mobileNumber: encryptedMobile,
      assignedGroupId,
      role: "subadmin",
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(
      __dirname,
      "../views/subAdminCredentials.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      fname,
      email,
      password,
    });

    await sendEmail(email, t("email_subject_credentials"), "", html);

    return sendSuccess(res, 201, t("account_created_success"), newUser);

  } catch (error) {
    console.error("Register error:", error);
    return sendError(res, t("something_went_wrong"), error.message);
  }
};

const login = async (req, res) => {
    const t = req.t
    try {

        const {email , password} = req.body

        if(!email || !password) return sendError(res, "All fileds are required")

        const emailHash = hashEmail(email);

        const admin = await adminServices.findByEmail(emailHash)

        if(!admin) return sendError(res, "Admin not found")

        if(admin.deletedAt || admin.isBlocked) return sendError(res, "Admin profile is deleted or blocked")

        const matchedPassword = await comparePasswords(password, admin.password);

        if (!matchedPassword) return sendError(res, t("incorrect_password"));

        const accessToken = generateToken({ id: admin.id, role: admin.role });

        const adminResponse = adminServices.adminResponse(admin)

        return sendSuccess(res, 200, "Login Successfull", {
            accessToken,
            adminResponse
        })
        
    } catch (error) {
        console.log(error);
        
        return sendError(res, "Login faild", error.message)
    }
}

const getAdminProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role

        const admin = await adminServices.findOne(userId)

        if(!admin) return sendError(res, "Admin profile not found")

        const adminResponse = adminServices.adminResponse(admin)

        return sendSuccess(res, 200, "Admin profile fetched successfully", adminResponse)

    } catch (error) {
        return sendError(res, "Faild to get admin profile", error.message)
    }
}

// User Group

const createUserGroup = async(req, res)=> {
    try {
        const userId = req.user.id;
        const userRole = req.user.role

        const admin = await adminServices.findOne(userId)

        if(admin.role !== "super_admin") return sendError(res, "Only super admin can create user group")

        const { name, description, permissions } = req.body;
            if (!name || !permissions || !Array.isArray(permissions)) {
      return sendError(res, "Group name and permissions are required");
    }

    const existing = await userGroupServices.findByName(name, userId);
        
    if (existing) {
      return sendError(res, "User group with this name already exists");
    }

        // ✅ Create user group with permissions in transaction
    const newGroup = await userGroupServices.createUserGroup({
      name,
      description,
      createdById: userId,
      createdByRole: userRole,
      permissions,
    });

    return sendSuccess(res,200, "User group created successfully", newGroup);

    } catch (error) {
        return sendError(res, "Faild to create user group", error.message)
    }
}

const getUserGroupList = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const admin = await adminServices.findOne(userId);

    if (admin.role !== "super_admin")
      return sendError(res, "Only super admin can fetch user group list");

    const { page, limit, search = "" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const isPaginated = !isNaN(pageNum) && !isNaN(limitNum);
    const skip = isPaginated ? (pageNum - 1) * limitNum : undefined;

    const { userGroup, total } = await userGroupServices.userGroupList({
      search,
      skip,
      take: isPaginated ? limitNum : undefined,
      createdBy: userId,
      createdByRole: admin.role,
    });

    const responseData = userGroup;

    if (isPaginated) {
      responseData.meta = {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      };
    }

    return sendSuccess(res, 200, "User group list fetched successfully", responseData)

  } catch (error) {
    console.log(error);
    
    return sendError(res, "Faild to get user group list", error.message);
  }
};

const viewUserGroup = async (req, res) => {
    try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const {userGroupId} = req.query

    const admin = await adminServices.findOne(userId);    

    if (admin.role !== "super_admin")
      return sendError(res, "Only super admin can view user group");

    const userGroup = await userGroupServices.findOne(userGroupId)

    if(!userGroup) return sendError(res, "User group not found")

    return sendSuccess(res, 200, "User group fetched successfully", userGroup)

    } catch (error) {
        console.log(error);
        return sendError(res, "Faild to view user group", error.message)
    }
}

const editUserGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { userGroupId } = req.query;

    const admin = await adminServices.findOne(userId);
    if (admin.role !== "super_admin")
      return sendError(res, "Only super admin can edit user group");

    const userGroup = await userGroupServices.findOne(userGroupId);
    if (!userGroup) return sendError(res, "User group not found");

    const { name, description, permissions } = req.body;

    // Call service function
    await userGroupServices.updateUserGroup(userGroupId, { name, description, permissions });

    // Fetch updated group with permissions
    const updatedGroup = await userGroupServices.findOneWithPermissions(userGroupId);

    return sendSuccess(res, 200, "User group updated successfully", updatedGroup);
  } catch (error) {
    console.error("Edit User Group Error:", error);
    return sendError(res, "Failed to edit user group", error.message);
  }
};

const toggleUserGroupStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { userGroupId } = req.query;

    const admin = await adminServices.findOne(userId);    

    if (admin.role !== "super_admin")
      return sendError(res, "Only super admin can change user group status");

    const userGroup = await userGroupServices.findOne(userGroupId);

    if (!userGroup) return sendError(res, "User group not found");

    // Toggle status
    const updatedGroup = await userGroupServices.updateStatus(userGroupId, !userGroup.isActive);

    return sendSuccess(res, 200, "User group status changed", updatedGroup);

  } catch (error) {
    return sendError(res, "Failed to change status", error.message);
  }
};

const deleteUserGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { userGroupId } = req.query;

    const admin = await adminServices.findOne(userId);    

    if (admin.role !== "super_admin")
      return sendError(res, "Only super admin can delete user group");

    const userGroup = await userGroupServices.findOne(userGroupId);

    if (!userGroup) return sendError(res, "User group not found");

    // Soft delete
    const deletedGroup = await userGroupServices.deleteGroup(userGroupId);

    return sendSuccess(res, 200, "User group deleted successfully", deletedGroup);

  } catch (error) {
    console.log(error);
    
    return sendError(res, "Failed to delete user group", error.message);
  }
};

export {
    registerSubAdmin,
    login,
    getAdminProfile,
    createUserGroup,
    getUserGroupList,
    viewUserGroup,
    editUserGroup,
    toggleUserGroupStatus,
    deleteUserGroup,
}