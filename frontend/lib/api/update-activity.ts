import axios from "axios";
import { ENV } from "@/lib/env";
import { Activity } from "./get-activity";

export const toggleActivityCompletion = async (
  id: string,
  completed: boolean
): Promise<Activity> => {
  const res = await axios.patch(
    `${ENV.BACKEND_ACTIVITY_URL}/${id}/complete`,
    { completed },
    { withCredentials: true }
  );

  return res.data.data;
};