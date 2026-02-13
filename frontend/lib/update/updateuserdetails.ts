import axios from "axios"
import { ENV } from "../env"

interface UserDetails {
 
    currentpassword:string,
    newemail?:string,
    newusername?:string,
    newpassword?:string

}

interface UpdateResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    username: string
  }
}
export async function updateUserDetails(data:UserDetails):Promise<UpdateResponse>{

try{

const res = await axios.patch(ENV.BACKEND_UPDATE_URL as string ,data,{withCredentials:true})

return res.data
}catch(err : any){
 const message =
            err?.response?.data?.message ||
            err.message ||
           "Failed to update user details";

        throw new Error(message);
}


}