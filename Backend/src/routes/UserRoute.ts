import express from "express"
import { UserSignup,UserSignIn } from "../controllers/UserController.js"

const UserRouter = express.Router()


UserRouter.post("/signup",UserSignup)
UserRouter.post("/signin",UserSignIn)

export default UserRouter