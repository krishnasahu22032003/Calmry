import mongoose, {Document, model, Schema } from "mongoose"

export interface SessionType extends Document {

userId : mongoose.Types.ObjectId ; 
token : string,
expiresAt:Date,
deviceInfo?:string,
lastActive:Date
 
 }

 const SessionSchema = new mongoose.Schema<SessionType>({

    userId:{type:Schema.Types.ObjectId , required:true, ref:"User"},
    token:{type:String,required:true,unique:true},
    expiresAt:{type:Date , required:true},
    deviceInfo:{type:String},
    lastActive:{type:Date,required:true, default:Date.now}

 },{timestamps:true})
SessionSchema.index({expiresAt:1},{expireAfterSeconds:0})
 export const SessionModel = model<SessionType>("Session",SessionSchema)