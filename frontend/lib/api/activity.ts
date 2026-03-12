import axios from "axios";
import { ENV } from "../env";

interface ActivityEntry {
  type: string;
  name: string;
  description?: string;
  duration?: number;
}

interface ActivityResponse {
  success: boolean
  data: {
    _id: string
    type: string
    name: string
    description?: string
    duration?: number
    timestamp: string
  }
}

export async function logActivity(
  data: ActivityEntry
): Promise<ActivityResponse> {
  try {
    const response = await axios.post(
      ENV.BACKEND_ACTIVITY_URL as string,
      data,
      {
        withCredentials: true,
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
