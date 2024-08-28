import express from 'express'

const router=express.Router();

import{profieinfoUpload,getAllUserData, addlink, deleteLink,getAllLink} from '../controller/upload.js'


router.post("/profileUpload",profieinfoUpload);
router.get("/alluser",getAllUserData);
router.get("/alllinks",getAllLink);
router.post("/addlink",addlink);
router.delete("/dltlink",deleteLink)

export default router;