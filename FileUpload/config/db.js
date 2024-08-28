import mongoose from "mongoose";
import { configDotenv } from 'dotenv';
configDotenv();
const dbconnect =()=>{
mongoose.connect(process.env.MONGODB_URL)
.then(console .log("DB Connection Successfull"))
.catch((err)=>{
    console.log("DB Connection failed");
    console.error(err);
    process.exit(1);
});
};

export default dbconnect;