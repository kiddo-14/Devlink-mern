import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export const isAuth = (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        // const authHeader = req.headers.authorization;
        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Bearer token is missing "
        //     });
        // }
               
        // // Get the token part of the Authorization header
        // const token = authHeader.split(' ')[1];
        const token = req.cookies.token;

        console.log("token", token);
           
        // Verify the token
        try {
            console.log("Decoding the token in payload");
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log("payload", payload);
            req.user = payload;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid'
            });
        }

        // Proceed to the next middleware or route handler
        next();

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the token"
        });
    }
};


