import type { NextFunction, Request, Response } from "express";
import JWT_SECRET from "../config/Config.js";
import  jwt, { decode }  from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";


interface JwtPayload {
    userId : string
}


export const AuthMiddleware  =async (req:Request,res:Response,next:NextFunction) =>{

const token =  req.cookies.auth_token

if(!token){
   return  res.status(400).json({
        success:false,
        message:"Token not present "
    })
}

try{

    const decoded = jwt.verify(token , JWT_SECRET) as JwtPayload

    if(!decoded || !decoded.userId){
        return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }
    const user = await UserModel.findById(decoded.userId).select("-password")
    if(!user){
          return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
        req.user = user;


    next();
}catch (e) {
    console.error("Error in auth middleware:", (e as Error).message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

}