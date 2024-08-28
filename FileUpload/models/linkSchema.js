import mongoose from "mongoose"

const linkSchema =new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
  
    platform:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },
})
const Link  =mongoose.model("links",linkSchema);
export default Link;