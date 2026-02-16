import axios, { AxiosError } from "axios";
import { ENV } from "../env";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    technique: string;
    goal: string;
    progress: any[];
    analysis?: {
      emotionalState: string;
      themes: string[];
      riskLevel: number;
      recommendedApproach: string;
      progressIndicators: string[];
    };
  };
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse {
  message: string;
  response?: string;
  analysis?: {
    emotionalState: string;
    themes: string[];
    riskLevel: number;
    recommendedApproach: string;
    progressIndicators: string[];
  };
  metadata?: {
    technique: string;
    goal: string;
    progress: any[];
  };
}

const api = axios.create({
  baseURL: ENV.BACKEND_CHAT_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleAxiosError = (
  error: unknown,
  defaultMessage: string
): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    throw new Error(
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      defaultMessage
    );
  }

  throw new Error(defaultMessage);
};

export const createChatSession = async (): Promise<string> => {
  try {
    const response = await api.post("/");
    const data = response.data;

    if (!data?.sessionId) {
      throw new Error("Invalid session response");
    }

    return data.sessionId;
  } catch (error) {
    throw handleAxiosError(error, "Failed to create chat session");
  }
};

export const sendChatMessage = async (
  sessionId: string,
  message: string
): Promise<ApiResponse> => {
  try {
    const response = await api.post(
      `/${sessionId}/messages`,
      { message }
    );

    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to send message");
  }
};

export const getChatHistory = async (
  sessionId: string
): Promise<ChatMessage[]> => {
  try {
    const response = await api.get(`/${sessionId}/history`);
    const data = response.data;

    if (!Array.isArray(data)) {
      throw new Error("Invalid chat history format");
    }

    return data.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      metadata: msg.metadata,
    }));
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch chat history");
  }
};

export const getAllChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const response = await api.get("/");
    const data = response.data;

    if (!Array.isArray(data)) {
      throw new Error("Invalid sessions format");
    }

    return data.map((session: any) => ({
      sessionId: session.sessionId,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: (session.messages || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        metadata: msg.metadata,
      })),
    }));
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch chat sessions");
  }
};