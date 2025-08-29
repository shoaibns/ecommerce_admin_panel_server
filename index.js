import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import i18nMiddleware from "./middleware/i18n.js"
import cors from "cors";
import adminRoutes  from "./routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { S3 } from "aws-sdk";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

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

app.use(express.json());
app.use(morgan("common"));
app.use(i18nMiddleware);

app.use(cors({
  origin: ["http://localhost:3000", "https://ecommerce-admin-panel-client.vercel.app"],
  credentials: true, // allow cookies
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/admin", adminRoutes);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// test APIs

app.get("/api/get", (req, res)=> {
    res.send({message : "Ok from server"})
})

app.get("/api/get/user_details", (req, res)=> {
    res.send({
        name : "Shoaib Mohammed",
        Email: "shoaib.gmail.com",
        mobile: 7057866962
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
})