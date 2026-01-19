import { type Request, type Response } from "express"
import z from "zod";
import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcrypt"

export const UserSignup = async (req:Request ,res:Response) =>{

  const requiredbody = z.object({
    username: z.string().min(3).max(50).transform((v) => v.trim()),
    email: z.string().email().min(5).max(50).transform((v) => v.trim()),
    password: z.string()
      .min(8).max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must include uppercase, lowercase, number, and special character"
      )
      .transform((v) => v.trim()),
  });

const parseddata =  requiredbody.safeParse(req.body)

if(!parseddata.success){

  return  res.status(400).json({
        success:false,
        errors: parseddata.error.flatten(),
        message:"Validation Failed"
    })
}
const {username,email,password} = parseddata.data ;



try{

if(await UserModel.findOne({email})){
     return res.status(409).json({
      success: false,
      message: "User already exists"
    })
}
const hashedpassword = await bcrypt.hash(password,10)

const newUser  = await UserModel.create({
    username,
    email,
    password:hashedpassword
})
if(!newUser){
   return res.status(400).json({
        success:false,
        message:"Error while entering user in the database"
    })
}
return res.status(201).json({
    success:true,
    message:"User Successfully signedUp" , User:{
        id:newUser._id,
        email:newUser.email,
        username:newUser.username
    }
})
}catch(err){
console.log((err as Error).message ,"Internal Server Error")
return res.status(500).json({
    success:false,
    message:"Server Error"
})
}

}