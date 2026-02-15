import { ENV } from "../env";
import axios from "axios";

interface User {
    id: string,
    username: string,
    email: string
}

export const getUserDetails = async (): Promise<User> => {

    try {
        const res = await axios.get(ENV.BACKEND_ME_URL as string, { withCredentials: true });
        if (!res.data) {
            throw new Error("User data is empty")
        }
        const data = res.data;

        return data;
    } catch (err: any) {
        if (err.response?.status === 401) { throw new Error("Unauthorized. Please login again."); }
        const message =
            err?.response?.data?.message ||
            err.message ||
            "Cant get user details";

        throw new Error(message);
    }

}