import axios from "axios";
import { ENV } from "../env";

export interface Activity {
  _id: string;
  userId: string;
  type?: string;
  name?: string;
  description?: string;
  duration?: number;
  difficulty?: string;
  completed: boolean;
  feedback?: string;
  createdAt?: string;
}

interface ToggleActivityResponse {
  success: boolean;
  data: Activity;
}

export const toggleActivityCompletion = async (
  activityId: string,
  completed: boolean
): Promise<Activity> => {
  try {
    const res = await axios.patch<ToggleActivityResponse>(
      `${ENV.BACKEND_ACTIVITY_URL as string}/${activityId}/complete`,
      { completed },
      {
        withCredentials: true,
      }
    );

    return res.data.data;
  } catch (error) {
    console.error("Failed to update activity status", error);
    throw error;
  }
};