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
    if (file.fieldname === "profilePicture") folder = "profileImgs";
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


// ============================================================= S3 Bucket Upload ==================================================

require("dotenv").config();

const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketRegion = process.env.AWS_REGION;
const bucketName = process.env.AWS_S3_BUCKET_NAME;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});


// // Function to get folder name based on fieldname
// function getS3Folder(fieldname) {
//   switch (fieldname) {
//     case "profileImg":
//     case "profilePicture":
//       return "profileImgs";
//     case "bannerImg":
//       return "bannerImgs";
//     case "icon":
//       return "icons";
//     case "filledTemplate":
//       return "filledTemplate";
//     case "image":
//     case "images":
//       return "images";
//     case "excelFile":
//       return "excelFiles";
//     case "files":
//       return "files";
//     default:
//       return "others";
//   }
// }

// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.AWS_S3_BUCKET_NAME,
//     acl: "public-read", // or 'private'
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       const folder = getS3Folder(file.fieldname);
//       const baseName = path
//         .parse(file.originalname)
//         .name.replace(/\s+/g, "-")
//         .toLowerCase();
//       const ext = path.extname(file.originalname);
//       const uniqueSuffix = Date.now();
//       const fileName = `${baseName}-${uniqueSuffix}${ext}`;
//       cb(null, `${folder}/${fileName}`); // S3 Key with virtual folder
//     },
//   }),
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
// });

// module.exports = {
//   uploadSingleImage: upload.single("image"),
//   uploadIconImg: upload.single("icon"),
//   uploadMultipleImages: upload.array("images", 5),
//   uploadAdExcelFile: upload.single("excelFile"),
//   uploadAdFiles: upload.array("files", 10),
//   formData: upload.none(),
//   uploadProfileAndBannerImages: upload.fields([
//     { name: "profilePicture", maxCount: 1 },
//     { name: "bannerImg", maxCount: 1 },
//   ]),
// };