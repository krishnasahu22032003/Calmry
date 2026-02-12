import axios from "axios"
import { ENV } from "../env"

interface SigninData {

    email: string,
    password: string

}

export const Signin = async (data: SigninData) => {

    try {

        const res = await axios.post(ENV.BACKEND_SIGNIN_URL as string, data, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials:true
        },);
        return res.data;
    } catch (err: any) {
        const message =
            err?.response?.data?.message ||
            err.message ||
            "Signup failed";

        throw new Error(message);
    }








}