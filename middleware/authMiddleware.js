import jwt from "jsonwebtoken";
import prisma from "../config/dbConnect.js";
// import prisma from "../prisma/client.js";
import { sendError } from "../utils/responseWrapper.js";

const modelMap = {
  subadmin: prisma.admin,
  super_admin: prisma.admin,
  owner: prisma.owner,
  subOwner: prisma.owner,
  provider: prisma.serviceProvider,
  subProvider: prisma.serviceProvider,
  customer: prisma.customer,
  // Add other roles here if needed
};

const requireUser = async (req, res, next) => {
  const t = req.t
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ success: false, message: t("access_token_required")});
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );

    const { id, role } = decoded;

    const Model = modelMap[role];

    if (!Model) return sendError(res, t("invalid_user_role"));

    const user = await Model.findUnique({
      where: { id },
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        mobileNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return sendError(res, t("user_not_found"));

    req.user = user;
    req.role = role;

    next();
    
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      
      return res.status(401).json({ success: false, message: t("access_token_expired") });
    }        
    return res.status(401).json({ success: false, message: t("invalid_token") });
  }
};

export { requireUser };