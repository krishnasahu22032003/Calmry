import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { inngest } from "../inngest/index.js"
import { UserModel } from "../models/UserModel.js";
import { Types } from "mongoose";
import OpenAI from "openai";
import { ENV } from "../lib/ENV.js";
import ChatSession from "../models/ChatSession.js";
import type { ChatSessionInterface } from "../models/ChatSession.js";
import type { InngestEvent } from "../types/inngest.js";

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

        const event: InngestEvent = {
            name: "therapy/session.message",
            data: {
                message,
                history: session.messages,
                memory: {
                    userProfile: {
                        emotionalState: [],
                        riskLevel: 0,
                        preferences: {},
                    },
                    sessionContext: {
                        conversationThemes: [],
                        currentTechnique: null,
                    },
                },
                goals: [],
                systemPrompt: `You are an AI therapist assistant. Your role is to:
        1. Provide empathetic and supportive responses
        2. Use evidence-based therapeutic techniques
        3. Maintain professional boundaries
        4. Monitor for risk factors
        5. Guide users toward their therapeutic goals`,
            },
        };

        console.log("Sending message to Inngest", { event })

        await inngest.send(event)

        const analysisPrompt = `Analyze this therapy message and provide insights. Return ONLY a valid JSON object with no markdown formatting or additional text.
    Message: ${message}
    Context: ${JSON.stringify({
            memory: event.data.memory,
            goals: event.data.goals,
        })}
    
    Required JSON structure:
    {
      "emotionalState": "string",
      "themes": ["string"],
      "riskLevel": number,
      "recommendedApproach": "string",
      "progressIndicators": ["string"]
    }`;

        const response = await client.responses.create({ model: "gpt-4.1-nano", input: analysisPrompt })

        const analysisText = (await response).output_text.trim()
        const cleanAnalysisText = analysisText
            .replace(/```json\n|\n```/g, "")
            .trim();

        const analysis = JSON.parse(cleanAnalysisText)
        console.log("Message analysis:", analysis)


        const responsePrompt = `${event.data.systemPrompt}
    
    Based on the following context, generate a therapeutic response:
    Message: ${message}
    Analysis: ${JSON.stringify(analysis)}
    Memory: ${JSON.stringify(event.data.memory)}
    Goals: ${JSON.stringify(event.data.goals)}
    
    Provide a response that:
    1. Addresses the immediate emotional needs
    2. Uses appropriate therapeutic techniques
    3. Shows empathy and understanding
    4. Maintains professional boundaries
    5. Considers safety and well-being`;


        const responseResult = await client.responses.create({ model: "gpt-4.1-nano", input: responsePrompt })
        const result = responseResult.output_text.trim()
        console.info("Generated response:", result);

        session.messages.push({
            role: "user",
            content: message,
            timestamp: new Date(),
        });

        session.messages.push({
            role: "assistant",
            content: result,
            timestamp: new Date(),
            metadata: {
                analysis,
                progress: {
                    emotionalState: analysis.emotionalState,
                    riskLevel: analysis.riskLevel,
                },
            },
        });

        await session.save()
        console.info("Session updated successfully:", { sessionId })

        res.json({
            response,
            message: response,
            analysis,
            metadata: {
                progress: {
                    emotionalState: analysis.emotionalState,
                    riskLevel: analysis.riskLevel,
                },
            },
        });
    } catch (err) {
        console.error("Error in sendMessage:", err);
        res.status(500).json({
            message: "Error processing message",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
}

export const getSessionHistory =async (req:Request,res:Response)=>{
    try{

        const {sessionId} = req.params
        const userId = new Types.ObjectId(req.user.id);

            const session = (await ChatSession.findById(
            sessionId
           ).exec()) as ChatSessionInterface;
   if (!session) {
      return res.status(404).json({success:false, message: "Session not found" });
    }
 if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
        res.json({
      messages: session.messages,
      startTime: session.startTime,
      status: session.status,
    });
    }catch(err){
         console.error("Error fetching session history:", err);
    res.status(500).json({ message: "Error fetching session history" });
  }
    }

export const getChatSession  = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    if (typeof sessionId !== "string") {
  return res.status(400).json({ message: "Invalid sessionId" });
}
    console.info(`Getting chat session: ${sessionId}`);
    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      console.warn(`Chat session not found: ${sessionId}`);
      return res.status(404).json({ error: "Chat session not found" });
    }
    console.info(`Found chat session: ${sessionId}`);
    res.json(chatSession);
  } catch (error) {
    console.error("Failed to get chat session:", error);
    res.status(500).json({ error: "Failed to get chat session" });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    if(typeof sessionId !== "string"){
return res.status(400).json({ message: "Invalid sessionId" });
    }
    const userId = new Types.ObjectId(req.user.id);

    // Find session by sessionId instead of _id
    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(session.messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Error fetching chat history" });
  }
};




