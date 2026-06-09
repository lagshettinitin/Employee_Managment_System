import mongoose from "mongoose";

// Creating a userSchema
const userSchema =  new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    role:{type:String, enum:["employee","manager","admin"],required:true},
    profileImage:{type:String},
    createAt:{type:Date,default: Date.now },
    updateAt:{type:Date,default:Date.now}})

const User = mongoose.model("User",userSchema);
export default User;    
