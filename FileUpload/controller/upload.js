import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import File from "../models/userSchema.js";
import { v2 as cloudinary } from 'cloudinary'
import Link from '../models/linkSchema.js';


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

export const profieinfoUpload = async (req, res) => {
    try {
        const { Firstname, Lastname, email} = req.body;
        console.log(Firstname, Lastname, email);
        const file=req.files.imageFile;
        console.log(file);
        
        const supportedTypes = ["jpg", "jpeg", "png"];
        const filetype = file.name.split('.').pop().toLowerCase();
        console.log("filetype", filetype);

        if (!isFileTypeSupported(filetype, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format is not supported"
            });
        }
        console.log("file is in format");

        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const filePath = join(__dirname, 'files', `${timestamp}.${fileExtension}`);

        const directoryPath = join(__dirname, 'files');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        await file.mv(filePath);

        const response = await uploadFileToCloud(filePath, "devLinks");
        console.log("response", response);

        // Store the file information in the database
        const fileData = await File.create({
            Firstname,
            Lastname,
            email,
            imageUrl: response.secure_url,
        });

        res.status(200).json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image Successfully Uploaded",
        });
    } catch (err) {
        console.log('djkdfjdkfjd');
        res.status(400).json({
            success: false,
            message: err.message
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

export const addlink = async (req, res) => {
    try {
        const { userid,platform, url } = req.body;
        console.log("Request Body:", req.body); 
        
        const link = new Link({

            platform,
            url,
        });

        const savedLink = await link.save();
        console.log("Saved Link:", savedLink); // Log the saved link

        // Check if the user exists before trying to update
        const userExists = await File.findById(userid);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Store this link into the userSchema's links array
        const updatedUser = await File.findByIdAndUpdate(
            userid,
            { $push: { links: savedLink } }, 
            { new: true } // Return the new document after update
        )
            .populate("links")
            .exec();

        console.log("Updated User:", updatedUser);

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
