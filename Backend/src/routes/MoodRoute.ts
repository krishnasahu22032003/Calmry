import express from "express"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"
import { logMood } from "../controllers/MoodController.js"

const MoodRouter = express.Router()

MoodRouter.use(AuthMiddleware)

MoodRouter.post("/usermood",logMood)

export default MoodRouter ;