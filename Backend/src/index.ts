import express from "express"
import { serve } from "inngest/express";
import { inngest } from "./inngest/index.js"
import { functions as inngestFunctions } from "./inngest/function.js";
import { startServer } from "./utils/startServer.js";

const app = express()

app.use(express.json())

app.use("/api/inngest", serve({ client: inngest, functions:inngestFunctions }));

app.get("/me" , async (req,res)=>{

    res.json({
        message:"Testing"
    })

})

startServer(app)