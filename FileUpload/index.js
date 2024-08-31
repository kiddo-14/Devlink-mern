import express from "express";
import { configDotenv } from 'dotenv';
import fileUpload from "express-fileupload";
import  dbconnect  from "./config/db.js";
import cloudinaryConnect from "./config/cloudinary.js";
import upload from './routes/FileUpload.js';
import cors from 'cors';
import cookieParser from "cookie-parser";

configDotenv();
//APP create
const app=express();
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
}));
//find port
const PORT=process.env.PORT||4000;

//activate the middleware
app.use(cookieParser());
app.use(express.json() )
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

dbconnect();
cloudinaryConnect();

app.use('/api/v1',upload);
app.listen(PORT,()=>{
    console.log(`Server is started at ${PORT}`);
})