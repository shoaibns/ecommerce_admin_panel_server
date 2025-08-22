import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// For __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";
    if (file.fieldname === "profileImg") folder = "profileImgs";
    else if (file.fieldname === "bannerImg") folder = "bannerImgs";
    else if (file.fieldname === "icon") folder = "icons";
    else if (file.fieldname === "filledTemplate") folder = "filledTemplate";
    else if (file.fieldname === "image" || file.fieldname === "images") folder = "images";
    else folder = "others";

    const uploadPath = path.join(__dirname, "../uploads", folder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const baseName = path.parse(file.originalname).name.replace(/\s+/g, "-").toLowerCase();
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now();
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// Export named middlewares
export const uploadSingleImage = upload.single("image");
export const uploadIconImg = upload.single("icon");
export const uploadMultipleImages = upload.array("images", 5);
export const uploadAdExcelFile = upload.single("excelFile");
export const uploadAdFiles = upload.array("files", 10);
export const formData = upload.none();
export const uploadProfileAndBannerImages = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "bannerImg", maxCount: 1 },
]);

// Export a single object for `upload.formData` style usage
export default {
  uploadSingleImage,
  uploadIconImg,
  uploadMultipleImages,
  uploadAdExcelFile,
  uploadAdFiles,
  formData,
  uploadProfileAndBannerImages,
};
