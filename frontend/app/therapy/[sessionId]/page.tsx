"use client";

import { ChatMessage, ChatSession, createChatSession, getAllChatSessions, getChatHistory, sendChatMessage } from "@/lib/api/chat";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SuggestedQuestion {
  id: string;
  text: string;
  category?: "stress" | "sleep" | "reflection" | "growth";
}

interface StressPrompt {
  trigger: string;
  activity: {
    type: "breathing" | "garden" | "forest" | "waves";
    title: string;
    description: string;
  };
}

interface ApiResponse {
  message: string;
  metadata: {
    technique: string;
    goal: string;
    emotionalState?: string;
    progress: {
      emotionalState?: string;
      riskLevel?: number;
      improvements?: string[];
    }[];
  };
}

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: "stress-release",
    text: "I've been feeling mentally overwhelmed today. Can you help me reset?",
    category: "stress",
  },
  {
    id: "sleep-anxiety",
    text: "My mind keeps racing at night and I struggle to fall asleep.",
    category: "sleep",
  },
  {
    id: "emotional-checkin",
    text: "I want to do a quick emotional check-in. How am I really doing?",
    category: "reflection",
  },
  {
    id: "focus-balance",
    text: "I'm having trouble staying focused and balanced lately.",
    category: "growth",
  },
  {
    id: "stress-pattern",
    text: "Why do I feel anxious even when nothing seems wrong?",
    category: "reflection",
  },
  {
    id: "mental-reset",
    text: "Can you guide me through a quick mental reset exercise?",
    category: "stress",
  },
];

const calmryGlowPulse = {
  initial: {
    opacity: 0.4,
    scale: 1,
  },
  animate: {
    opacity: [0.4, 0.9, 0.4],
    scale: [1, 1.06, 1],
    transition: {
      duration: 3.2,
      repeat: Infinity,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function TherapyPage () {

  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stressPrompt, setStressPrompt] = useState<StressPrompt | null>(null);
  const [showActivity, setShowActivity] = useState(false);
  const [isChatPaused, setIsChatPaused] = useState(false);
  const [showNFTCelebration, setShowNFTCelebration] = useState(false);
  const [isCompletingSession, setIsCompletingSession] = useState(false);
  const params = useParams<{ sessionId?: string }>();

const [sessionId, setSessionId] = useState<string | null>(
  params?.sessionId ?? null
);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

 const handleNewSession = async () => {
  try {
    setIsLoading(true);

    const newSessionId = await createChatSession();

    setSessionId(newSessionId);
    setMessages([]);

    // reload sessions from backend
    const updatedSessions = await getAllChatSessions();
    setSessions(updatedSessions);

    window.history.pushState({}, "", `/therapy/${newSessionId}`);

  } catch (error) {
    console.error("Failed to create new session:", error);
  } finally {
    setIsLoading(false);
  }
};

// Initialize chat session and load history

useEffect(() => {
  const initChat = async () => {
    try {
      setIsLoading(true);

      // Create new session if needed
      if (!sessionId || sessionId === "new") {

        const newSessionId = await createChatSession();

        setSessionId(newSessionId);

        window.history.pushState({}, "", `/therapy/${newSessionId}`);

        return; // stop here, next render will load history
      }

      // Load existing chat history
      const history = await getChatHistory(sessionId);

      if (Array.isArray(history)) {
        setMessages(history);
      } else {
        console.error("Invalid chat history format:", history);
        setMessages([]);
      }

    } catch (error) {

      console.error("Failed to initialize chat:", error);

      setMessages([
        {
          role: "assistant",
          content:
            "I'm having trouble loading this conversation. Please refresh the page.",
          timestamp: new Date(),
        },
      ]);

    } finally {
      setIsLoading(false);
    }
  };

  initChat();

}, [sessionId]);

// Load all chat sessions

useEffect(() => {
  const loadSessions = async () => {
    try {
      const allSessions = await getAllChatSessions();
      setSessions(allSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  loadSessions();
}, []);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

useEffect(() => {
  if (isTyping) {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }
}, [isTyping]);

const STRESS_KEYWORDS = [
  "stress",
  "anxiety",
  "worried",
  "panic",
  "overwhelmed",
  "nervous",
  "tense",
  "pressure",
  "cant cope",
  "can't cope",
  "exhausted",
];

const STRESS_ACTIVITIES: StressPrompt["activity"][] = [
  {
    type: "breathing",
    title: "Guided Breathing",
    description:
      "Slow your breathing with a calming visual rhythm designed to reduce anxiety.",
  },
  {
    type: "garden",
    title: "Zen Garden",
    description:
      "Create a peaceful digital garden and let your thoughts settle naturally.",
  },
  {
    type: "forest",
    title: "Mindful Forest Walk",
    description:
      "Take a slow, grounding walk through a calming virtual forest.",
  },
  {
    type: "waves",
    title: "Ocean Waves",
    description:
      "Sync your breath with gentle ocean waves to release tension.",
  },
];

const detectStressSignals = (message: string): StressPrompt | null => {
  const lowercaseMsg = message.toLowerCase();

  const foundKeyword = STRESS_KEYWORDS.find((keyword) =>
    lowercaseMsg.includes(keyword)
  );

  if (!foundKeyword) return null;

  const randomActivity =
    STRESS_ACTIVITIES[Math.floor(Math.random() * STRESS_ACTIVITIES.length)];

  return {
    trigger: foundKeyword,
    activity: randomActivity,
  };
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Form submitted");

  const currentMessage = message.trim();

  console.log("Current message:", currentMessage);
  console.log("Session ID:", sessionId);
  console.log("Is typing:", isTyping);
  console.log("Is chat paused:", isChatPaused);

  // Prevent invalid submissions
  if (!currentMessage || isTyping || isChatPaused || !sessionId) {
    console.log("Submission blocked:", {
      noMessage: !currentMessage,
      isTyping,
      isChatPaused,
      noSessionId: !sessionId,
    });
    return;
  }

  // Clear input immediately
  setMessage("");

  // Add user message immediately (optimistic UI)
  const userMessage: ChatMessage = {
    role: "user",
    content: currentMessage,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);

  // Show typing indicator
  setIsTyping(true);

  try {
    // Detect stress signals first
    const stressCheck = detectStressSignals(currentMessage);

if (stressCheck) {
  setStressPrompt(stressCheck);
  setShowActivity(true);
  setIsChatPaused(true);
  setIsTyping(false);
  return;
}

    console.log("Sending message to API...");

    // Send message to backend
    const response = await sendChatMessage(sessionId, currentMessage);

    console.log("API response:", response);

    // Build assistant message
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content:
        response.response ||
        response.message ||
        "I'm here to support you. Could you tell me more about what's on your mind?",
      timestamp: new Date(),
    metadata: response.metadata
  ? {
      technique: response.metadata.technique,
      goal: response.metadata.goal,
      progress: response.metadata.progress,
      analysis: response.analysis,
    }
  : undefined
    };

    console.log("Assistant message:", assistantMessage);

    // Add assistant message
    setMessages((prev) => [...prev, assistantMessage]);

  } catch (error) {
    console.error("Error in chat:", error);

    // Fallback assistant response
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      },
    ]);
  } finally {
    // Always stop typing indicator
    setIsTyping(false);

    // Scroll chat to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
};

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted || isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="glass px-10 py-8 rounded-2xl flex flex-col items-center gap-4">

        <div className="w-10 h-10 rounded-full border-2 border-border border-t-(--accent-core) animate-spin" />

        <p className="text-sm text-muted tracking-wide">
          Preparing your therapy space...
        </p>

      </div>

    </div>
  );
}

const handleSuggestedQuestion = async (text: string) => {
  try {
    let activeSessionId = sessionId;

    // Create session if none exists
    if (!activeSessionId) {
      const newSessionId = await createChatSession();
      setSessionId(newSessionId);
      router.push(`/therapy/${newSessionId}`);
      activeSessionId = newSessionId;
    }

    // Immediately send message
    const userMessage: ChatMessage = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    const response = await sendChatMessage(activeSessionId, text);

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content:
        response.response ||
        response.message ||
        "I'm here to support you.",
      timestamp: new Date(),
      metadata: response.metadata
        ? {
            technique: response.metadata.technique,
            goal: response.metadata.goal,
            progress: response.metadata.progress,
            analysis: response.analysis,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, assistantMessage]);

  } catch (error) {
    console.error("Error sending suggested question:", error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "I couldn't send that message right now. Please try again.",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

const handleCompleteSession = async () => {
  if (isCompletingSession) return;

  try {
    setIsCompletingSession(true);

    // Trigger completion celebration
    setShowNFTCelebration(true);

  } catch (error) {
    console.error("Error completing session:", error);
  } finally {
    setIsCompletingSession(false);
  }
};

const handleSessionSelect = async (selectedSessionId: string) => {
  if (!selectedSessionId || selectedSessionId === sessionId) return;

  try {
    setIsLoading(true);

    const history = await getChatHistory(selectedSessionId);

    if (!Array.isArray(history)) {
      throw new Error("Invalid chat history format");
    }

    const formattedHistory: ChatMessage[] = history.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));

    setMessages(formattedHistory);
    setSessionId(selectedSessionId);

    window.history.pushState({}, "", `/therapy/${selectedSessionId}`);

  } catch (error) {
    console.error("Failed to load session:", error);

    setMessages([
      {
        role: "assistant",
        content:
          "I couldn't load that conversation. Please try again.",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

}