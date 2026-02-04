import express from "express"
import { getChatHistory,getChatSession,sendMessage,createChatSession } from "../controllers/ChatController.js"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"

const chatrouter = express.Router()

chatrouter.use(AuthMiddleware)

chatrouter.post("/sessions", createChatSession);
chatrouter.get("/sessions/:sessionId", getChatSession);
chatrouter.post("/sessions/:sessionId/messages", sendMessage);
chatrouter.get("/sessions/:sessionId/history", getChatHistory);

export default chatrouter ; 