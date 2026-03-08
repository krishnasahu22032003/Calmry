import express  from "express"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"
import { getUserActivities, logActivity } from "../controllers/ActivityController.js"

const ActivityRouter = express.Router()

ActivityRouter.use(AuthMiddleware)


ActivityRouter.get("/useractivity", getUserActivities);
ActivityRouter.post("/useractivity",logActivity)

export default ActivityRouter
