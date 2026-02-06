import express from "express"
import { getChatHistory,getChatSession,sendMessage,createChatSession } from "../controllers/ChatController.js"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"

const ChatRouter = express.Router()

ChatRouter.use(AuthMiddleware)

ChatRouter.post("/sessions", createChatSession);
ChatRouter.get("/sessions/:sessionId", getChatSession);
ChatRouter.post("/sessions/:sessionId/messages", sendMessage);
ChatRouter.get("/sessions/:sessionId/history", getChatHistory);

export default ChatRouter ; 