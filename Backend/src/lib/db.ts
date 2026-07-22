import mongoose from "mongoose";
import { ENV } from "./ENV.js";


export const connectDB =async () => {
    
await mongoose.connect(ENV.MONGO_URL as string)
.then(()=>{
    console.log("connected to database")
})
.catch((err)=>{
    console.error(err, "Error while connecting to the database")
    process.exit(1)
})
}