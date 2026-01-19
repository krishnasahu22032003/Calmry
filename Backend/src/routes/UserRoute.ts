import express from "express"
import { UserSignup } from "../controllers/UserController.js"

const UserRouter = express.Router()


UserRouter.post("/signup",UserSignup)

export default UserRouter