import { ENV } from "../lib/ENV.js";

const JWT_SECRET = ENV.JWT_USER_SECRET || "mydevsecret"

export default JWT_SECRET