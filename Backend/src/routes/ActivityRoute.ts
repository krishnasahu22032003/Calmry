import express  from "express"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"
import { logActivity } from "../controllers/ActivityController.js"

const ActivityRouter = express.Router()

ActivityRouter.use(AuthMiddleware)


ActivityRouter.post("/useractivity",logActivity)

export default ActivityRouter