import express from "express"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"
import { getUserMoods, logMood } from "../controllers/MoodController.js"

const MoodRouter = express.Router()

MoodRouter.use(AuthMiddleware)

MoodRouter.post("/usermood",logMood)
MoodRouter.get("/usermood", getUserMoods);

export default MoodRouter ;