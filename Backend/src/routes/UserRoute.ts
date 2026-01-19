import express from "express"
import { UserSignup, UserSignIn, UserLogOut } from "../controllers/UserController.js"

const UserRouter = express.Router()


UserRouter.post("/signup", UserSignup)
UserRouter.post("/signin", UserSignIn)
UserRouter.post("/signout", UserLogOut)

export default UserRouter