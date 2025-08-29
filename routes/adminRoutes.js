import express from "express";
const router = express.Router();
import * as adminController from "../controllers/adminControllers.js";
import * as upload from "../middleware/uploadMiddleware.js";
import { requireUser } from "../middleware/authMiddleware.js";

// router.post("/register",upload.formData, adminController.registerSubAdmin);
router.post("/register", adminController.registerSubAdmin);
router.post("/login", upload.formData, adminController.login);
// router.post("/logout", upload.formData, requireUser, adminController.logout);
router.post("/logout", upload.formData, adminController.logout);
router.get("/profile", requireUser, adminController.getAdminProfile);
router.post("/update-profile", requireUser, upload.uploadProfileAndBannerImages, adminController.updateAdminProfile);

// User group
router.post("/create-user-group", requireUser, adminController.createUserGroup);
router.get("/get-user-group-list",upload.formData, requireUser, adminController.getUserGroupList);
router.get("/get-user-group",upload.formData, requireUser, adminController.viewUserGroup);
router.post("/edit-user-group", requireUser, adminController.editUserGroup);
router.post("/toggle-user-group-status", requireUser, adminController.toggleUserGroupStatus);
router.post("/delete-user-group", requireUser, adminController.deleteUserGroup);

export default router