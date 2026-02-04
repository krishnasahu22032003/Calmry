import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { inngest } from "../inngest/index.js"
import { UserModel } from "../models/UserModel.js";
import { Types } from "mongoose";
import OpenAI from "openai";
import { ENV } from "../lib/ENV.js";
import ChatSession from "../models/ChatSession.js";

const client = new OpenAI({
    apiKey: ENV.OPEN_API_KEY
})


export const createChatSession = async (req: Request, res: Response) => {

    try {

        if (!req.user || !req.user.id) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized - User not authenticated" });
        }

        const userId = new Types.ObjectId(req.user.id)
        const user = await UserModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        const sessionId = uuidv4()


        const session = await ChatSession.create({
            sessionId,
            userId,
            startTime: new Date(),
            status: "active",
            messages: [],
        });
        return res.status(201).json({
            success: true,
            message: "Chat session created successfully",
            sessionId: session.sessionId,
        });
    } catch (err) {
        console.error((err as Error).message, "Error creating chat session:")
        res.status(500).json({
            message: "Error creating chat session",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }

}

export const sendMessage = async (req: Request, res: Response) => {

    try {

        const { sessionId } = req.params;
        const { message } = req.body;
        const userId = new Types.ObjectId(req.user.id);

        console.info("Processing Message:", { sessionId, message })

        if (typeof sessionId !== "string") {
            throw new Error("Invalid or missing sessionId");
        }

        const session = await ChatSession.findOne({ sessionId })
        if (!session) {
            console.log("Session not found:", { sessionId });
            return res.status(404).json({ success: false, message: "Session not found" });
        }

          if (session.userId.toString() !== userId.toString()) {
      console.log("Unauthorized access attempt:", { sessionId, userId });
      return res.status(403).json({ message: "Unauthorized" });
    }

const event: InngestEvent  = 


    }catch(err){



    }




}





