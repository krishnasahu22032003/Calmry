import type { Request, Response } from "express";
import Mood from "../models/Mood.js";
import { success } from "zod";



export const logMood =  async (req:Request,res:Response)=>{


    try{
const {score,note,context,activities} = req.body

const userId =  req.user._id

if(!userId){
    return res.status(401).json({
        success:false,
        message:"User is not authenticated"
    })
}
 
const mood = await Mood.create({
    userId,
    score,
    note,
    context,
    activities,
    timestamp:Date.now()
})

if(!mood){
    return res.status(400).json({
        success:false,
        message:"Internal server Error"
    })
}

return res.status(200).json({
    success:true,
    message:`Mood entry created for user ${userId}`,
    data:mood
})
    }catch(err){
        console.log((err as Error).message)
        return res.status(400).json({
            success:false,
            message:"Internal server Error"
        })
    }
}