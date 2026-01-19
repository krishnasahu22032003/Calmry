import express from "express"
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/function.js"
import { logger } from "./utils/logger.js";
import { startServer } from "./utils/startServer.js";

const app = express()

app.use(express.json())

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/me" , async (req,res)=>{

    res.json({
        message:"Testing"
    })

})





startServer()