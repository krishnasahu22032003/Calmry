import type { Document } from "mongoose";
import {  Schema } from "mongoose";
import mongoose  from "mongoose";

interface ActivityType extends Document{
type:string
userId : mongoose.Types.ObjectId,
title:string,
description?:string,
duration?:number,
name:string,
timestamp:Date,
difficulty:number,
feedback:string

}

const ActivitySchema =  new mongoose.Schema<ActivityType>({
      userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "meditation",
        "exercise",
        "walking",
        "reading",
        "journaling",
        "therapy",
      ],
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    difficulty:{
      type:Number,default:0
    },
    feedback:{
      type:String
    }
  
},{timestamps:true})

ActivitySchema.index({userId:1,timestamp:-1})

const Activity =  mongoose.model<ActivityType>("Activity",ActivitySchema)

export default Activity