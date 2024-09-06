import express from "express";
import { configDotenv } from 'dotenv';
import fileUpload from "express-fileupload";
import  dbconnect  from "./config/db.js";
import cloudinaryConnect from "./config/cloudinary.js";
import upload from './routes/FileUpload.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import pool from "./config/post-db.js";
import db from './config/post-db.js'

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

// to connect with mongo db
//dbconnect();

// to connect with postgress
console.log("using postgrss");
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Database connected successfully');
        release();
    }
});
/***********************************************************************/
//Using migration script
// async function startServer() {
//     try {
//         // Test the Knex connection
//         const result = await db.raw('SELECT NOW()');
//         console.log('Database connection successful. Current time:', result.rows[0].now);

//         // You can perform other database operations or migrations here

//     } catch (error) {
//         console.error('Database connection error:', error);
//         return; // Stop the server startup if there's an error
//     }

//     // Connect to Cloudinary
//     cloudinaryConnect();

//     // Set up routes
//     app.use('/api/v1', upload);

//     // Start the server
//     const PORT = process.env.PORT || 4000;
//     app.listen(PORT, () => {
//         console.log(`Server is started at ${PORT}`);
//     });
// }
// startServer();
/*************************************************************/
cloudinaryConnect();

app.use('/api/v1',upload);
app.listen(PORT,()=>{
    console.log(`Server is started at ${PORT}`);
})