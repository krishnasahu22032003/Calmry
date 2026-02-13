"use client"
import { signout } from "@/lib/auth/signout"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

export const Dashboard = () => {
const [loading , setLoading] = useState(false)

const router = useRouter()
const handlesignout = async()=>{
    if(loading) return 
    setLoading(true)
    try{
    await signout()
toast.success("Signed Out Successfully")
router.replace("/signin") 
    }catch (err: any) {
            toast.error(err.message || "Signout failed");
        } finally{
            setLoading(false)
        }
}

  return (
    
    <div>
      <DashboardHeader/>
     
    </div>
  )
}

export default Dashboard
