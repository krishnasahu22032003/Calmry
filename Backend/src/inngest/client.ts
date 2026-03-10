import { Inngest } from "inngest";
import { ENV } from "../lib/ENV.js";

export const inngest = new Inngest({
  id: "Calmry",
  eventKey: ENV.INNGEST_EVENT_KEY as string,
});