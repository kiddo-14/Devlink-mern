import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import File from "../models/userSchema.js";
import { v2 as cloudinary } from 'cloudinary'
import Link from '../models/linkSchema.js';
import authUser from'../models/authUserSchema.js';
// import { profile } from 'console';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function isFileTypeSupported(type, supportedTypes) {
    const val = supportedTypes.includes(type);
    console.log(val);
    return val;
}


async function uploadFileToCloud(filePath, folder) {
    console.log("entering in this uploadFileCloud function");
    const option = { folder };
    option.resource_type = "auto";
    return await cloudinary.uploader.upload(filePath, option);
}
export const profileinfoUpload = async (req, res) => {
    try {
        console.log("Accessing the profileinfoupload")
        const { authid,Firstname, Lastname, email,imageFile } = req.body;
        // const authuserid =req.user.id;
        console.log("authuser",authid);
        // console.log("Request Body:", req.body);

        // File upload handling 
        const file = req.files.imageFile;
        console.log("File:", file);

        const supportedTypes = ["jpg", "jpeg", "png"];
        const filetype = file.name.split('.').pop().toLowerCase();

        if (!supportedTypes.includes(filetype)) {
            return res.status(400).json({
                success: false,
                message: "File format is not supported",
            });
        }
        console.log("File is in correct format");

        // Upload the file to cloud storage
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const filePath = join(__dirname, 'files', `${timestamp}.${fileExtension}`);

        const directoryPath = join(__dirname, 'files');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        await file.mv(filePath);

        const response = await uploadFileToCloud(filePath, "devLinks");
        console.log("Cloud Upload Response:", response);

        // Create the profile in the database
        const newProfile = new File({
            authid,
            Firstname,
            Lastname,
            email,
            imageUrl: response.secure_url,
        });

        const savedProfile = await newProfile.save();
        console.log("Saved Profile:", savedProfile);

        // Update the authUser's profiles array with the new profile's ID
        const updatedAuthUser = await authUser.findByIdAndUpdate(
            authid,
            { $push: { profiles: savedProfile._id } }, // Push the new profile's ID to the profiles array
            { new: true } // Return the updated document
        ).populate("profiles");

        console.log("Updated AuthUser:", updatedAuthUser);

        res.status(200).json({
            success: true,
            data: updatedAuthUser,
            message: "Profile successfully uploaded and linked to AuthUser",
        });
    } catch (err) {
        console.error("Error in profile upload:", err);

        res.status(400).json({
            success: false,
            message: "Profile could not be uploaded",
        });
    }
};
export const getAllUserData=async(req,res)=>{
    try{
        const user =await File.find({});
        res.status(200).json({
            success:true,
            data:user,
            message:"All user data fetched"
          })
    }
    catch(err){
        console.error(err);
        console.log(err);
        res.status(400).json({
            success:false,
            message:"Not able to fetch the data of user"
        });
    }
}
export const getAllauthUserData=async(req,res)=>{
    try{
        const user =await authUser.find({});
        res.status(200).json({
            success:true,
            data:user,
            message:"All user data fetched"
          })
    }
    catch(err){
        console.error(err);
        console.log(err);
        res.status(400).json({
            success:false,
            message:"Not able to fetch the data of user"
        });
    }
}
export const getAllLink=async(req,res)=>{
    try{
        const user =await Link.find({});
        res.status(200).json({
            success:true,
            data:user,
            message:"All link fetched"
          })
    }
    catch(err){
        console.error(err);
        console.log(err);
        res.status(400).json({
            success:false,
            message:"Not able to fetch the data of user"
        });
    }
}

// export const addlink = async (req, res) => {
//     console.log(req.body);
//     try {
//         // console.log("bdhsfvebf");
//         const { userid,platform, url } = req.body;
//         console.log(req.body)
//         const link = new Link({
//             platform,
//             url,
//         });
//         const savedLink = await link.save();
//         // console.log("Saved Link:", savedLink); // Log the saved link

//         // Check if the user exists before trying to update
//         const userExists = await File.findById(userid);
//         if (!userExists) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         // Store this link into the userSchema's links array
//         const updatedUser = await File.findByIdAndUpdate(
//             userid,
//             { $push: { links: savedLink } }, 
//             { new: true } // Return the new document after update
//         )
//             .populate("links")
//             .exec();

//         // console.log("Updated User:", updatedUser);

//         res.status(200).json({
//             success: true,
//             data: updatedUser,
//         });
      
//     } catch (err) {
//         console.error(err);

//         res.status(400).json({
//             success: false,
//             message: "Link could not be added",
//         });
//     }
// };

export const addlink = async (req, res) => {
    try {
        const { userid, platform, url } = req.body;

        // Check if the link already exists for this user
        const userExists = await File.findById(userid).populate("links");
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const duplicateLink = userExists.links.find(link => link.platform === platform && link.url === url);
        if (duplicateLink) {
            return res.status(400).json({
                success: false,
                message: "Link already exists",
            });
        }

        // Save the new link
        const link = new Link({ platform, url });
        const savedLink = await link.save();

        // Add the link to the user's links array
        const updatedUser = await File.findByIdAndUpdate(
            userid,
            { $push: { links: savedLink } }, 
            { new: true }
        )
            .populate("links")
            .exec();

        res.status(200).json({
            success: true,
            data: updatedUser,
        });
      
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: "Link could not be added",
        });
    }
};

export const deleteLink = async (req, res) => {
    try {
        const {userid, linkid} = req.body;

        console.log(userid,linkid);
    

        // Find and delete the link
        const deletedLink = await Link.findOneAndDelete({
            _id: linkid,
            
        });
        if (!deletedLink) {
            return res.status(404).json({
                success: false,
                message: "Link not found or you don't have permission to delete this link",
            });
        }

        console.log("Deleted Link:", deletedLink);

        // Update the user's links array by pulling the deleted link's ObjectId
        const updatedUser = await File.findByIdAndUpdate(
            userid,
            { $pull: { links: deletedLink._id } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found or update failed",
            });
        }

        console.log("Updated User:", updatedUser);

        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    } catch (err) {
        console.error("Error in deleteLink:", err);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the link",
        });
    }
};

export const signup =async(req,res)=>{
    try{
      const {name,email,password}=req.body;

      console.log("req.body",req.body);

       const existingUser =await authUser.findOne({email});
       if(existingUser){
             return res.status(400).json({
                success:false,
                message:"User alerady exist",
             });
       } 
       let hashPassword;
       try{
        hashPassword=await bcrypt.hash(password,10);
       }
       catch(err){
        console.error(err);
        console.log(err);
        
        return res.status(500).json({
          success :false,
          message:"Not able to hash the password" 
        });
       }
   
       const user =await authUser.create({
        name,email,password:hashPassword
       });
           console.log(user);
       return res.status(200).json({
          success:true,
          message:"Successfully able to store the user"
       })
    }
    catch(err){

         console.error(err);
         console.log(err);
            return res.status(400).json(
               {
                 success:false,
                 message:"NOt able to create a new user"
               }
            )
    }
}

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
         if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"please enter the value of fields "
            });
         }
         const existUser = await authUser.findOne({email});
         console.log("existUser",existUser);
         if(!existUser){
            return res.status(401).json({
                success:false,
                message:"Not register!! please sign in first"
            });
         }
          const payload={
            email:existUser.email,
             id:existUser._id,
             role:existUser.role,
          }
          console.log("password",password);
          console.log("hashpassword",existUser.password);
         //verify password and genrating JWT token
         if(await bcrypt.compare(password,existUser.password)){
             // password is same try to login
            //  create JWT token
            let token=jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                }
            );
            //need of this when we try to push token in user than it is not going to push so first we create an object of user than we are able to push in it
            existUser.toObject();

            // existUser.token=token;
            // if we send the user object so we have to make sure that there is no chance to leak the password so we make password value undefinedd to particular object not in database
            console.log("setting password value undefined");
            existUser.password=undefined;
            console.log("paasing token in header");
            // res.setHeader("Authorization", `Bearer ${token}`);
            const option= {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
                httpOnly:false,
                // secure: false,
                // path:'/'
            }

            console.log("setting up cookiee");        
           return res.cookie("token",token,option).status(200).json({
                success:true,
                 token,
                 existUser,
                 message:"user logged in successfully"
            }) 

            
         }
         else{
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
         }

    }
    catch(err){
      console.error(err);
      console.log(err);
      return res.status(500).json({
        success:false,
        message:"Login failure "

      })

}
}

export const getAuthUserByID=async(req,res)=>{
    try{
        const { id } = req.query;
        const user =await authUser.findById(id);
        res.status(200).json({
            success:true,
            data:user,
            message:"user-data related to that userid fetched"
          })
    }
    catch(err){
        console.error(err);
        console.log(err);
        res.status(400).json({
            success:false,
            message:"Not able to fetch the data of user"
        });
    }
}

// export const getAllPofilesofAuthuser=async(req,res)=>{
//     try{

//         const {id}=req.body;
//         const user = await authUser.findById(id, 'profiles');
        
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
        
//         res.json(user.profiles);
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }

// }

export const getUserByID=async(req,res)=>{
    try{
        const { id } = req.query;
        const user =await File.findById(id);
        return res.status(200).json({
            success:true,
            data:user.email,
            message:"user-data related to that userid fetched"
          })
    }
    catch(err){
        console.error(err);
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"Not able to fetch the data of user"
        });
    }
}
export const getUserdetailsByID=async(req,res)=>{
    try{
        const { id } = req.query;
        const user =await File.findById(id);
        console.log("user",user);
        return res.status(200).json({
            success:true,
            data:user,
            message:"user-data related to that userid fetched"
          })
    }
    catch(err){
        console.error(err);
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"Not able to fetch the data of user"
        });
    }
}
export const getlinksByID=async(req,res)=>{
    try{
        const { id } = req.query;
        const link =await Link.findById(id);
        console.log("link",link);
        return res.status(200).json({
            success:true,
            data:link,
            message:"link-data related to that userid fetched"
          })
    }
    catch(err){
        console.error(err);
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"Not able to fetch the data of user"
        });
    }
}




