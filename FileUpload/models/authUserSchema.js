import mongoose from "mongoose";

const userauth=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    profiles:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
        }
    ]
})

const userauthSchema=mongoose.model("userAuth",userauth);
export default userauthSchema;