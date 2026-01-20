import mongoose from "mongoose";
import { Schema } from "mongoose";


interface ChatMessageType {

    role: "assistant" | "user",
    content: string,
    timestamp: Date,
    metadata?: {
        technique: string,
        goal: string,
        progress: any[]
    }
}

interface ChatSessionType {

    sessionId: string,
    messages: ChatMessageType[],
    createdAt: Date,
    updatedAt: Date
}

const ChatMessageSchema = new mongoose.Schema<ChatMessageType>({

    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    metadata: {
        technique: String,
        goal: String,
        progress: [Schema.Types.Mixed],
    },
})

const ChatSessionSchema = new mongoose.Schema<ChatSessionType>({
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    messages: [ChatMessageSchema],
},
    {
        timestamps: true,
    })

const ChatSession = mongoose.model<ChatSessionType>("ChatSession", ChatSessionSchema)

export default ChatSession; 