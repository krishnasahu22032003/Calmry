import express from "express"
import { serve } from "inngest/express";
import { inngest } from "./inngest/index.js"
import { functions as inngestFunctions } from "./inngest/function.js";
import { startServer } from "./utils/startServer.js";
import UserRouter from "./routes/UserRoute.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet";
import ActivityRouter from "./routes/ActivityRoute.js";


const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use("/api/inngest", serve({ client: inngest, functions:inngestFunctions }));

app.use('/api/user', UserRouter)
app.use('/api/activity', ActivityRouter)

startServer(app)