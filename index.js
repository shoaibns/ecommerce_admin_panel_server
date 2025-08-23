import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import i18nMiddleware from "./middleware/i18n.js"
import adminRoutes  from "./routes/adminRoutes.js";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import { fileURLToPath } from "url";

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

app.use(express.json());
app.use(morgan("common"));
app.use(i18nMiddleware);

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