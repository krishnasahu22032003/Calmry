import express from "express"
import { UserSignup, UserSignIn, UserLogOut ,checkUser , UpdateUserDetails} from "../controllers/UserController.js"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"

const UserRouter = express.Router()

UserRouter.post("/signup", UserSignup)
UserRouter.post("/signin", UserSignIn)
UserRouter.post("/signout", AuthMiddleware,UserLogOut)
UserRouter.get("/me" , AuthMiddleware,checkUser)
UserRouter.patch("/update",AuthMiddleware,UpdateUserDetails)
export default UserRouter