import User from "../modules/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async(req, res) =>{
 try{
  const {email,password} =  req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.status(404).json({message:"user not found"});
   }
   
   const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) {
    return res.status(400).json({message:"invalid password"})
  }

  const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"10d"});
   res.status(200).json({success:true,token,user:{id:user._id,name:user.name,email:user.email,role:user.role}});
 }
 catch(error){
   console.log(error);
   res.status(500).json({message:"server error"});
 }
}

const verify = (req,res) =>{
  return res.status(200).json({success:true,user:req.user});
}
export {login ,verify};