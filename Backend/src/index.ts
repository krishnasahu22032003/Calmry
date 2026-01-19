import express from "express"
import { serve } from "inngest/express";
import { inngest } from "./inngest/index.js"
import { functions as inngestFunctions } from "./inngest/function.js";
import { startServer } from "./utils/startServer.js";
import UserRouter from "./routes/UserRoute.js";
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/inngest", serve({ client: inngest, functions:inngestFunctions }));

app.use('/api/user', UserRouter)

startServer(app)