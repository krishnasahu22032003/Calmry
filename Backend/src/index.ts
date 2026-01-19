import express from "express"
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/function.js"

const app = express()

app.use(express.json())

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/me" , async (req,res)=>{

    res.json({
        message:"Testing"
    })

})





app.listen(3000, () => {
  console.log("App is running on port 3000");
});