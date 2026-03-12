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

interface GetActivitiesResponse {
  success: boolean;
  data: Activity[];
}

export const getUserActivities = async (): Promise<Activity[]> => {
  try {
    const res = await axios.get<GetActivitiesResponse>(
      ENV.BACKEND_ACTIVITY_URL as string ,
      {
        withCredentials: true, // required for cookie auth
      }
    );

    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch activities", error);
    throw error;
  }
};