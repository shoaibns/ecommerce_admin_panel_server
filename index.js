import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import i18nMiddleware from "./middleware/i18n.js"
import adminRoutes  from "./routes/adminRoutes.js";

const app = express()

dotenv.config()

app.use(express.json());
app.use(morgan("common"));
app.use(i18nMiddleware);

app.use("/api/admin", adminRoutes);

// test APIs

app.get("/get", (req, res)=> {
    res.send({message : "Ok from server"})
})

app.get("/get/user_details", (req, res)=> {
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