import express from "express";
const router = express.Router();
import * as adminController from "../controllers/adminControllers.js";
import * as upload from "../middleware/uploadMiddleware.js";

// router.post("/register",upload.formData, adminController.registerSubAdmin);
router.post("/register", adminController.registerSubAdmin);

export default router