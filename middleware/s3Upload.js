// middleware/s3Upload.js
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();

// AWS S3 config
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// Function to map fieldnames to S3 folders
function getS3Folder(fieldname) {
  switch (fieldname) {
    case "profileImg":
    case "profilePicture":
      return "profileImgs";
    case "bannerImg":
      return "bannerImgs";
    case "icon":
      return "icons";
    case "filledTemplate":
      return "filledTemplate";
    case "image":
    case "images":
      return "images";
    case "excelFile":
      return "excelFiles";
    case "files":
      return "files";
    default:
      return "others";
  }
}

// Configure multer-S3 storage
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    // acl: "public-read", // or "private"
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const folder = getS3Folder(file.fieldname);
      const baseName = path
        .parse(file.originalname)
        .name.replace(/\s+/g, "-")
        .toLowerCase();
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now();
      const fileName = `${baseName}-${uniqueSuffix}${ext}`;
      cb(null, `${folder}/${fileName}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Export upload middlewares
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

export default {
  uploadSingleImage,
  uploadIconImg,
  uploadMultipleImages,
  uploadAdExcelFile,
  uploadAdFiles,
  formData,
  uploadProfileAndBannerImages,
};

export { s3 };
