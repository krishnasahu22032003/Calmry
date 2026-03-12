import axios from "axios";
import { ENV } from "../env";

export interface Activity {
  _id: string;
  userId: string | null;
  type: string;
  name: string;
  description: string | null;
  timestamp: string;
  duration: number | null;
  completed: boolean;
  score: number | null;
  moodNote: string | null;
  createdAt: string;
  updatedAt: string;
}


interface GetActivitiesResponse {
  success: boolean;
  data: Activity[];
}

export const getUserActivities = async (): Promise<Activity[]> => {
  try {
    const res = await axios.get<GetActivitiesResponse>(
      ENV.BACKEND_ACTIVITY_URL as string ,
      {
        withCredentials: true,
      }
    );

    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch activities", error);
    throw error;
  }
};