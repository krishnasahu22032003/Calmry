import mongoose, { Document, model } from "mongoose"
import { Schema } from "mongoose"

interface ChatMessage extends Document{

role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    analysis?: any;
    currentGoal?: string | null;
    progress?: {
      emotionalState?: string;
      riskLevel?: number;
    };
  };
}

interface ChatSession extends Document{

 _id: mongoose.Types.ObjectId,
  sessionId: string;
  userId: mongoose.Types.ObjectId,
  startTime: Date;
  status: "active" | "completed" | "archived";
  messages: ChatMessage[];

}

const MessageSchema = new mongoose.Schema<ChatMessage>({
      role: { type: String, required: true, enum: ["user", "assistant"] },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  metadata: {
    analysis: Schema.Types.Mixed,
    currentGoal: String,
    progress: {
      emotionalState: String,
      riskLevel: Number,
    },
  },
})

const SessionSchema = new mongoose.Schema<ChatSession>({

sessionId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["active", "completed", "archived"],
  },
  messages: [MessageSchema],

})

const session = model<ChatSession>("ChatSession",SessionSchema)

export default session