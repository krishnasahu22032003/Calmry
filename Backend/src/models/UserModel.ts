import mongoose from "mongoose";
import { Schema , model} from "mongoose";
export interface UserType {

username:string,
email:string,
password:string

}

const UserSchema = new mongoose.Schema<UserType>({

username:{type:String,required:true},
email:{type:String,required:true,unique:true},
password:{type:String,required:true,unique:true}

},{timestamps:true})

export const UserModel = model<UserType>("User",UserSchema)