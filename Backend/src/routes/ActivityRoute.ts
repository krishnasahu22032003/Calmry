import express  from "express"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"
import { getUserActivities, logActivity, toggleActivityCompletion } from "../controllers/ActivityController.js"

const ActivityRouter = express.Router()

ActivityRouter.use(AuthMiddleware)


ActivityRouter.get("/useractivity", getUserActivities);
ActivityRouter.post("/useractivity",logActivity)
ActivityRouter.patch("/useractivity/:id/complete", toggleActivityCompletion)

export default ActivityRouter
