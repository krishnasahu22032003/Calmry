"use client"
import { signout } from "@/lib/auth/signout"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Dashboard = () => {
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
     <button disabled={loading} onClick={handlesignout} className=" cursor-pointer border border-amber-50 p-2 rounded-2xl mt-10 right-0">
        {loading ? "Signing out" : "sign out"}
     </button>
    </div>
  )
}

export default Dashboard
