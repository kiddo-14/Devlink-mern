import { v2 as cloudinary } from 'cloudinary';
import { configDotenv } from 'dotenv';
configDotenv(); 
const  cloudinaryConnect =async()=>{
  try{
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET,
        })
  }
  catch(err){
   console.error(err);
   console.log(err);
  }
};

export default cloudinaryConnect;