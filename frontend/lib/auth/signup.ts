import { ENV } from "../env";
import axios from "axios";

interface Data {
  username: string;
  email: string;
  password: string;
}

export async function signupUser(data: Data) {
  try {
    const res = await axios.post(
      ENV.BACKEND_SIGNUP_URL as string,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Signup failed";

    throw new Error(message);
  }
}
