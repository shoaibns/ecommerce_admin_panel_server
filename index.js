import express from "express";
import dotenv from "dotenv";

dotenv.config()

const app = express()

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