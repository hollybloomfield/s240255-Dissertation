import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import festivalsRoutes from "./routes/festivals.route.js";
import messagesRoutes from "./routes/messages.route.js";
import blogRoutes from "./routes/blog.route.js"

import {app, server} from "./lib/socket.js";


dotenv.config();


const PORT = process.env.PORT;

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}))
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}
))

app.use("/api/auth", authRoutes)
app.use("/api/festivals", festivalsRoutes)
app.use("/api/messages", messagesRoutes)
app.use("/api/blog", blogRoutes)

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB()
});