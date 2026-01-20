import express from "express"
import { UserSignup, UserSignIn, UserLogOut ,checkUser} from "../controllers/UserController.js"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"

const UserRouter = express.Router()

UserRouter.post("/signup", UserSignup)
UserRouter.post("/signin", UserSignIn)
UserRouter.post("/signout", AuthMiddleware,UserLogOut)
UserRouter.get("/me" , AuthMiddleware,checkUser)
export default UserRouter