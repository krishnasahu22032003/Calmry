import express from "express"
import { serve } from "inngest/express";
import { inngest } from "./inngest/index.js"
import { functions as inngestFunctions } from "./inngest/function.js";
import { startServer } from "./utils/startServer.js";
import UserRouter from "./routes/UserRoute.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import ActivityRouter from "./routes/ActivityRoute.js";
import MoodRouter from "./routes/MoodRoute.js";
import ChatRouter from "./routes/ChatRoute.js";
import helmet from "helmet";

const app = express()
app.use(cors({origin:'http://localhost:3000',credentials:true}))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use("/api/inngest", serve({ client: inngest, functions: inngestFunctions }));

app.use('/api/user', UserRouter)
app.use('/api/activity', ActivityRouter)
app.use('/api/mood', MoodRouter)
app.use('/api/chat', ChatRouter)

startServer(app)