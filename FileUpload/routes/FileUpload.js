import express from 'express'

const router=express.Router();

import {isAuth} from '../middleware/middleware.js'
import{profileinfoUpload,getAllUserData, addlink, deleteLink,getAllLink,login,signup,getAllauthUserData,getAuthUserByID,getUserByID,getUserdetailsByID,getlinksByID} from '../controller/upload.js'


router.post("/profileUpload",profileinfoUpload);
router.get("/alluser",getAllUserData);
router.get("/allauthuser",getAllauthUserData);
router.get("/authuserid/",getAuthUserByID);
router.get("/alllinks",getAllLink);
router.post("/addlink",addlink);
router.delete("/dltlink",deleteLink)
router.post("/login",login);
router.post("/signup",signup);
// router.get("/profilesofAuthuser",getAllPofilesofAuthuser)
router.get("/getemail",getUserByID);
router.get("/getlink",getlinksByID);

router.get("/getAllProfilesOfAuthUser",getUserdetailsByID);


// for authentication
router.get ("/",isAuth,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the Protected route for test"
    });
});


export default router;