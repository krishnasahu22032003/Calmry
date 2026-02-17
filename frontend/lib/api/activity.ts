import axios from "axios";
import { ENV } from "../env";

interface ActivityEntry {
  type: string;
  name: string;
  description?: string;
  duration?: number;
}

export async function logActivity(
  data: ActivityEntry
): Promise<{ success: boolean; data: any }> {
  try {
    const response = await axios.post(
      ENV.BACKEND_ACTIVITY_URL as string,
      data, // axios automatically JSON stringifies
      {
        withCredentials: true, // send httpOnly cookie
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to log activity"
    );
  }
}
