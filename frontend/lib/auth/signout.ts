import axios from "axios"
import { ENV } from "../env"

export const signout = async () => {

    try {
        const res = await axios.post(ENV.BACKEND_SIGNOUT_URL as string, {}, { withCredentials: true })
        return res.data
    } catch (err: any) {
        const message =
            err?.response?.data?.message ||
            err.message ||
            "Signout failed";

        throw new Error(message);
    }


}