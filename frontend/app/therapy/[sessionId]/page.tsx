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

export default function ThreapyPage () {

  const params = useParams();
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
  const [sessionId, setSessionId] = useState<string | null>(
    params.sessionId as string
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

 const detectStressSignals = (message: string): StressPrompt | null => {
    const stressKeywords = [
      "stress",
      "anxiety",
      "worried",
      "panic",
      "overwhelmed",
      "nervous",
      "tense",
      "pressure",
      "can't cope",
      "exhausted",
    ];

    const lowercaseMsg = message.toLowerCase();
    const foundKeyword = stressKeywords.find((keyword) =>
      lowercaseMsg.includes(keyword)
    );

    if (foundKeyword) {
      const activities = [
        {
          type: "breathing" as const,
          title: "Breathing Exercise",
          description:
            "Follow calming breathing exercises with visual guidance",
        },
        {
          type: "garden" as const,
          title: "Zen Garden",
          description: "Create and maintain your digital peaceful space",
        },
        {
          type: "forest" as const,
          title: "Mindful Forest",
          description: "Take a peaceful walk through a virtual forest",
        },
        {
          type: "waves" as const,
          title: "Ocean Waves",
          description: "Match your breath with gentle ocean waves",
        },
      ];

      return {
        trigger: foundKeyword,
        activity: activities[Math.floor(Math.random() * activities.length)],
      };
    }

    return null;
  };


}