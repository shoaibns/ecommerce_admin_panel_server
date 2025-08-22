import express from "express";
import dotenv from "dotenv";

dotenv.config()

const app = express()

app.get("/get", (req, res)=> {
    res.send({message : "Ok from server"})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
})