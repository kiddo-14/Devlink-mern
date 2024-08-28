import mongoose from "mongoose";

const fileSchema= new mongoose.Schema({
    Firstname:{
        type:String,
        required:true,
    },
    Lastname:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    links:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"links",
    }],
});
const userSchema =mongoose.model("user",fileSchema);
export default userSchema;