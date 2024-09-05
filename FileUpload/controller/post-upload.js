import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';
import File from "../models/userSchema.js";
import { v2 as cloudinary } from 'cloudinary'
import Link from '../models/linkSchema.js';
import authUser from'../models/authUserSchema.js';
// import { profile } from 'console';
import pool from '../config/post-db.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendProfilesviaEmail from '../config/sendProfile.js'
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
        console.log("Accessing the profileinfoUpload");

        const { authid, Firstname, Lastname, email } = req.body;
        const file = req.files.imageFile;

        console.log("authuser", authid);
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

        // Upload the file to local storage
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const filePath = path.join(__dirname, 'files', `${timestamp}.${fileExtension}`);

        const directoryPath = path.join(__dirname, 'files');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        await file.mv(filePath);

        // Upload to cloud storage
        const response = await uploadFileToCloud(filePath, "devLinks");
        console.log("Cloud Upload Response:", response);

        // Connect to PostgreSQL
        const client = await pool.connect();
        try {
            // Begin transaction
            await client.query('BEGIN');

            // Insert the new profile into the 'users' table
            const insertProfileQuery = `
                INSERT INTO users (authuserid, Firstname, Lastname, email, imageUrl)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [authid, Firstname, Lastname, email, response.secure_url];
            const result = await client.query(insertProfileQuery, values);
            const savedProfile = result.rows[0];

            console.log("Saved Profile:", savedProfile);

            // Update the authUser's profiles array with the new profile's ID
            const updateAuthUserQuery = `
                UPDATE userauth
                SET profiles = array_append(profiles, $1)
                WHERE authuserid = $2
                RETURNING *;
            `;
            const updateValues = [savedProfile.userid, authid]; // Using userid instead of authuserid
            const updatedUserResult = await client.query(updateAuthUserQuery, updateValues);
            const updatedAuthUser = updatedUserResult.rows[0];

            console.log("Updated AuthUser:", updatedAuthUser);

            // Commit the transaction
            await client.query('COMMIT');

            res.status(200).json({
                success: true,
                data: updatedAuthUser,
                message: "Profile successfully uploaded and linked to AuthUser",
            });
        } catch (err) {
            // Rollback the transaction in case of error
            await client.query('ROLLBACK');
            console.error("Database Error:", err);
            res.status(500).json({
                success: false,
                message: "An error occurred while saving the profile",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in profile upload:", err);
        res.status(400).json({
            success: false,
            message: "Profile could not be uploaded",
        });
    }
};


export const getAllUserData = async (req, res) => {
    try {
        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Fetch all users from the 'user' table
            const result = await client.query('SELECT * FROM users');
            const users = result.rows;

            console.log("All Users:", users); // Log all users for debugging

            res.status(200).json({
                success: true,
                data: users,
                message: "All user data fetched successfully",
            });
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({
                success: false,
                message: "Unable to fetch the data of users",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in getAllUserData API:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const getAllauthUserData = async (req, res) => {
    try {
        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Fetch all users from the 'authuser' table
            const result = await client.query('SELECT * FROM "userauth');
            const users = result.rows;

            console.log("All Users:", users); // Log all users for debugging

            res.status(200).json({
                success: true,
                data: users,
                message: "All user data fetched successfully",
            });
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({
                success: false,
                message: "Unable to fetch the data of users",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in getAllauthUserData API:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const getAllLink = async (req, res) => {
    try {
        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Fetch all links from the 'link' table
            const result = await client.query('SELECT * FROM links');
            const links = result.rows;

            console.log("All Links:", links); // Log all links for debugging

            res.status(200).json({
                success: true,
                data: links,
                message: "All links fetched successfully",
            });
        } catch (err) {
            console.error("Error fetching links:", err);
            res.status(500).json({
                success: false,
                message: "Unable to fetch the data of links",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in getAllLink API:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const addlink = async (req, res) => {
    try {
        const { userid, platform, url } = req.body;

        if (!userid || !platform || !url) {
            return res.status(400).json({
                success: false,
                message: "User ID, platform, and URL are required",
            });
        }

        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Check if the user exists
            const userResult = await client.query('SELECT * FROM users WHERE userid = $1', [userid]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            // Check if the link already exists for this user
            const existingLinkResult = await client.query(
                'SELECT * FROM links WHERE platform = $1 AND url = $2 AND userid = $3',
                [platform, url, userid]
            );
            const existingLink = existingLinkResult.rows[0];

            if (existingLink) {
                return res.status(400).json({
                    success: false,
                    message: "Link already exists",
                });
            }

            // Insert the new link
            const insertLinkResult = await client.query(
                'INSERT INTO links (platform, url, userid) VALUES ($1, $2, $3) RETURNING *',
                [platform, url, userid]
            );
            const newLink = insertLinkResult.rows[0];

            console.log("New Link:", newLink);

            // Update the user's links array
            const updateUserResult = await client.query(
                'UPDATE users SET links = array_append(links, $1) WHERE userid = $2 RETURNING *',
                [newLink.linkid, userid]
            );
            const updatedUser = updateUserResult.rows[0];

            console.log("Updated User:", updatedUser);

            res.status(200).json({
                success: true,
                data: updatedUser,
            });

            await client.query('COMMIT'); // Commit the transaction if all operations are successful

        } catch (err) {
            await client.query('ROLLBACK'); // Rollback the transaction in case of error
            console.error("Error adding link:", err);
            res.status(500).json({
                success: false,
                message: "Link could not be added",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }

    } catch (err) {
        console.error("Error in addlink API:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const deleteLink = async (req, res) => {
    try {
        const { userid, linkid } = req.body;

        console.log("userid:", userid, "linkid:", linkid);

        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Start a transaction
            await client.query('BEGIN');

            // Delete the link from the 'link' table
            const deleteLinkResult = await client.query('DELETE FROM links WHERE linkid = $1 RETURNING *', [linkid]);

            if (deleteLinkResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: "Link not found or you don't have permission to delete this link",
                });
            }

            console.log("Deleted Link:", deleteLinkResult.rows[0]);

            // Update the user's links array in the 'user' table
            const updateUserResult = await client.query(
                'UPDATE users SET links = array_remove(links, $1) WHERE userid = $2 RETURNING *',
                [linkid, userid]
            );

            if (updateUserResult.rowCount === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    success: false,
                    message: "User not found or update failed",
                });
            }

            console.log("Updated User:", updateUserResult.rows[0]);

            // Commit the transaction
            await client.query('COMMIT');

            res.status(200).json({
                success: true,
                data: updateUserResult.rows[0],
            });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error("Error in deleteLink:", err);
            res.status(500).json({
                success: false,
                message: "An error occurred while deleting the link",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in deleteLink:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log("req.body", req.body);

        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Check if the user already exists
            const checkUserQuery = 'SELECT * FROM userauth WHERE email = $1';
            console.log( checkUserQuery);
            console.log(email);
            const checkUserResult = await client.query(checkUserQuery, [email]);
            console.log("chekjhtg", checkUserResult);
            if (checkUserResult.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }

            // Hash the password
            let hashPassword;
            try {
                hashPassword = await bcrypt.hash(password, 10);
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Not able to hash the password"
                });
            }

            // Insert new user into the 'authuser' table
            const insertUserQuery = `
                INSERT INTO userauth (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [name, email, hashPassword];
            const insertResult = await client.query(insertUserQuery, values);
            const newUser = insertResult.rows[0];

            console.log(newUser);

            // Generate JWT token
            const payload = {
                email: newUser.email,
                id: newUser.id,
                role: newUser.role,
            };
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

            // Respond with success and token
            return res.status(200).json({
                success: true,
                token,
                message: "Successfully created and logged in",
            });
        } catch (err) {
            console.error("Database Error:", err);
            res.status(500).json({
                success: false,
                message: "An error occurred while creating the user",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in signup API:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter both email and password",
            });
        }

        const client = await pool.connect();
        try {
            // Check if the user exists
            const result = await client.query('SELECT * FROM userauth WHERE email = $1', [email]);
            const existUser = result.rows[0];
            if (!existUser) {
                return res.status(401).json({
                    success: false,
                    message: "Not registered! Please sign up first",
                });
            }

            // Verify the password
            const isMatch = await bcrypt.compare(password, existUser.password);
            if (!isMatch) {
                return res.status(403).json({
                    success: false,
                    message: "Incorrect password",
                });
            }

            // Create JWT token
            const payload = {
                email: existUser.email,
                id: existUser.authuserid, // Use the correct ID field from your table
                // role: existUser.role, // If you have a role field, include it
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            // Set up cookie options
            const cookieOptions = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production', // Use this in production for HTTPS
            };

            // Send response with token in cookie
            return res.cookie("token", token, cookieOptions).status(200).json({
                success: true,
                token,
                existUser: {
                    email: existUser.email,
                    id: existUser.authuserid, // Use the correct ID field from your table
                },
                message: "User logged in successfully",
            });
        } catch (err) {
            console.error("Error in authentication process:", err);
            return res.status(500).json({
                success: false,
                message: "Login failure",
            });
        } finally {
            client.release(); // Release client back to the pool
        }
    } catch (err) {
        console.error("Error in login API:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const getAuthUserByID = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate ID format if needed (e.g., check if it's a valid UUID or integer)
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Fetch user by ID
            const result = await client.query('SELECT * FROM userauth WHERE authuserid = $1', [id]);
            const user = result.rows[0];

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            res.status(200).json({
                success: true,
                data: user,
                message: "User data related to that user ID fetched successfully",
            });
        } catch (err) {
            console.error("Error fetching user data:", err);
            res.status(500).json({
                success: false,
                message: "Unable to fetch the data of user",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in getAuthUserByID API:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const getUserByID = async (req, res) => {
    try {
        const { id } = req.query;
        console.log("iddd",id);

        // Validate ID format if needed
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Fetch user data by ID
            const result = await client.query('SELECT * FROM users WHERE userid = $1', [id]);
            const user = result.rows[0];

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: user.email, // Return the user's email as per your original code
                message: "User data related to that user ID fetched successfully",
            });
        } catch (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).json({
                success: false,
                message: "Unable to fetch the data of user",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in getUserByID API:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const getUserdetailsByID = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate ID format if needed
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Fetch user details by ID
            const result = await client.query('SELECT * FROM users WHERE userid = $1', [id]);
            const user = result.rows[0];

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            console.log("user", user); // Log user details for debugging

            return res.status(200).json({
                success: true,
                data: user,
                message: "User data related to that user ID fetched successfully",
            });
        } catch (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).json({
                success: false,
                message: "Unable to fetch the data of user",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in getUserdetailsByID API:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const getlinksByID = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate ID format if needed
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Link ID is required",
            });
        }

        // Connect to the PostgreSQL database
        const client = await pool.connect();
        try {
            // Fetch link details by ID
            const result = await client.query('SELECT * FROM links WHERE linkid = $1', [id]);
            const link = result.rows[0];

            if (!link) {
                return res.status(404).json({
                    success: false,
                    message: "Link not found",
                });
            }

            console.log("link", link); // Log link details for debugging

            return res.status(200).json({
                success: true,
                data: link,
                message: "Link data related to that link ID fetched successfully",
            });
        } catch (err) {
            console.error("Error fetching link data:", err);
            return res.status(500).json({
                success: false,
                message: "Unable to fetch the data of link",
            });
        } finally {
            client.release(); // Release the client back to the pool
        }
    } catch (err) {
        console.error("Error in getlinksByID API:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
export const shareProfileViaMail =async (req,res)=>{
    try{
            const {email,profileData} =req.body;
            console .log("Share profile API called and in this req",email,profileData)
            if (!email || !profileData) {
                return res.status(400).json({ error: 'Missing email or profileData' });
            }
            try {
                await sendProfilesviaEmail(email, profileData);
                res.status(200).send('Profiles shared successfully!');
              } catch (error) {
                res.status(500).send('Failed to share profiles.');
              }  
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"failed to send profile via mail"
        })
    }
}

