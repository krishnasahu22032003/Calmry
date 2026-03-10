"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Button from "@/components/ui/Button";
import { ChatMessage, ChatSession, createChatSession, getAllChatSessions, getChatHistory, sendChatMessage } from "@/lib/api/chat";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence , motion } from "framer-motion";
import { Bot, BrainCircuit, Loader2, MessageSquare, PlusCircle, Send, Sparkles, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export function ScrollArea({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden", className)}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="flex touch-none select-none transition-colors h-full w-2.5"
      >
        <ScrollAreaPrimitive.Thumb className="flex-1 rounded-full bg-border" />
      </ScrollAreaPrimitive.Scrollbar>

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
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
 const params = useParams();

const [sessionId, setSessionId] = useState<string | null>(
  typeof params?.sessionId === "string" ? params.sessionId : null
);;
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

  router.replace(`/therapy/${newSessionId}`);

  return;
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
}, [messages, isTyping]);

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

const detectStressSignals = React.useCallback(
  (message: string): StressPrompt | null => {
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
  },
  []
);

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
        response?.response ||
        response?.message ||
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

return(

<div className="relative min-h-screen">

<DashboardHeader />

<main className="pt-22 pb-24">
<div className="relative max-w-7xl mx-auto px-4">

<div className="flex h-[calc(100vh-7rem)] gap-6">

{/* SIDEBAR */}
<div className="
hidden lg:flex
w-80 flex-col
rounded-2xl
border border-border
bg-surface-soft
overflow-hidden
">

{/* Sidebar Header */}
<div className="p-5 border-b border-border flex items-center justify-between">

<div>
<h2 className="font-accent text-[1.05rem] tracking-tight">
Sessions
</h2>
<p className="text-xs text-muted">
Your therapy conversations
</p>
</div>

<Button
variant="secondary"
onClick={handleNewSession}
className="rounded-xl bg-(--accent-core)/10 hover:bg-(--accent-core)/20"
>
{isLoading ? (
<Loader2 className="w-4 h-4 animate-spin"/>
) : (
<PlusCircle className="w-4 h-4 text-accent"/>
)}
</Button>

</div>


{/* Sessions */}
<ScrollArea className="flex-1 h-full p-4">

<div className="space-y-3">

{sessions.map((session)=>(
<div
key={session.sessionId}
onClick={()=>handleSessionSelect(session.sessionId)}
className={cn(
"group relative p-4 rounded-2xl cursor-pointer transition-all duration-500",
"border border-border",
"hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(47,63,168,0.12)]",

session.sessionId===sessionId
? "bg-(--accent-core)/10 border-(--accent-core)/20"
: "bg-surface-soft"
)}
>

<div className="space-y-1">

<div className="flex items-center gap-2 text-sm font-medium">

<MessageSquare className="w-4 h-4 text-muted"/>

<span className="line-clamp-1">
{session.messages[0]?.content.slice(0,28) || "New Session"}
</span>

</div>

<p className="text-xs text-muted line-clamp-2">
{session.messages.at(-1)?.content || "Start your reflection"}
</p>

</div>

<div className="flex items-center justify-between mt-3 text-xs text-muted">

<span>
{session.messages.length} messages
</span>

<span>
{formatDistanceToNow(new Date(session.updatedAt),{
addSuffix:true
})}
</span>

</div>

</div>
))}

</div>

</ScrollArea>

</div>



{/* CHAT AREA */}
<div className="
flex-1
flex flex-col
rounded-2xl
border border-border
bg-background
overflow-hidden
relative
">

{/* Emotional Glow Layer */}
<div
className="pointer-events-none absolute inset-0 opacity-30"
style={{
background:
"radial-gradient(900px 400px at 0% 0%, rgba(47,63,168,0.16), transparent 60%), radial-gradient(700px 300px at 100% 100%, rgba(22,106,94,0.14), transparent 60%)"
}}
/>


{/* HEADER */}
<div className="relative p-5 border-b border-border flex items-center gap-3">

<div className="
w-10 h-10 rounded-xl
bg-(--accent-core)/10
flex items-center justify-center
">
<BrainCircuit className="w-5 h-5 text-accent"/>
</div>

<div>

<h2 className="font-accent text-[1.05rem] tracking-tight">
AI Therapist
</h2>

<p className="text-xs text-muted">
{messages.length} messages
</p>

</div>

</div>



{/* CHAT CONTENT */}
{messages.length===0 ? (

<div className="flex-1 flex items-center justify-center px-6">

<div className="max-w-xl text-center space-y-10">

<div className="space-y-3">

<div className="
w-14 h-14 mx-auto rounded-2xl
bg-(--accent-core)/10
flex items-center justify-center
">

<Sparkles className="w-6 h-6 text-accent"/>

</div>

<h3 className="font-accent text-xl tracking-tight">
Begin a Reflection
</h3>

<p className="text-sm text-muted leading-relaxed">
Share what’s on your mind. I’ll help you reflect, process, and explore your thoughts.
</p>

</div>


<div className="grid gap-3">

{SUGGESTED_QUESTIONS.map((q,index)=>(
<motion.div
key={q.id}
initial={{opacity:0,y:10}}
animate={{opacity:1,y:0}}
transition={{delay:index*0.1}}
>

<Button
variant="secondary"
className="
w-full text-left justify-start py-4
rounded-2xl
bg-surface-soft
hover:bg-(--accent-core)/10
transition-all duration-500
"
onClick={()=>handleSuggestedQuestion(q.text)}
>
{q.text}
</Button>

</motion.div>
))}

</div>

</div>

</div>

) : (

<div className="flex-1 overflow-y-auto scroll-smooth pb-20">

<div className="max-w-3xl mx-auto py-6">

<AnimatePresence mode="popLayout">

{messages.map((msg,index)=>(
<motion.div
key={`${msg.timestamp.toISOString()}-${msg.role}-${index}`}
initial={{opacity:0,y:16}}
animate={{opacity:1,y:0}}
transition={{duration:0.35}}
className="px-6 py-5"
>

<div className="flex gap-4">

{/* Avatar */}
<div className="w-9 h-9 shrink-0">

{msg.role==="assistant" ? (

<div className="
w-9 h-9 rounded-xl
bg-(--accent-core)/10
flex items-center justify-center
">

<Bot className="w-5 h-5 text-accent"/>

</div>

) : (

<div className="
w-9 h-9 rounded-xl
bg-surface-soft border border-border
flex items-center justify-center
">

<User className="w-5 h-5 text-muted"/>

</div>

)}

</div>



{/* Message */}
<div className="flex-1 space-y-2">

<div className="flex items-center gap-3">

<p className="text-sm font-medium">
{msg.role==="assistant" ? "AI Therapist" : "You"}
</p>

{msg.metadata?.technique && (
<span className="
text-xs px-2 py-1 rounded-lg
bg-(--accent-calm)/10
text-(--accent-calm)
">
{msg.metadata.technique}
</span>
)}

</div>

<div className="prose prose-sm dark:prose-invert leading-relaxed">

<div className="prose prose-sm max-w-none dark:prose-invert">
  <ReactMarkdown>
    {msg.content}
  </ReactMarkdown>
</div>

</div>

{msg.metadata?.goal && (
<p className="text-xs text-muted">
Goal: {msg.metadata.goal}
</p>
)}

</div>

</div>

</motion.div>
))}

</AnimatePresence>


{isTyping && (

<div className="px-6 py-5 flex gap-4">

<div className="
w-9 h-9 rounded-xl
bg-(--accent-core)/10
flex items-center justify-center
">

<Loader2 className="w-4 h-4 animate-spin text-accent"/>

</div>

<p className="text-sm text-muted">
AI Therapist is thinking...
</p>

</div>

)}

<div ref={messagesEndRef}/>

</div>

</div>

)}



{/* INPUT */}
<div className="border-t border-border p-5">

<form
onSubmit={handleSubmit}
className="max-w-3xl mx-auto flex gap-3"
>

<textarea
disabled={isTyping || isChatPaused}
value={message}
onChange={(e)=>{
  setMessage(e.target.value)
  e.target.style.height="auto"
  e.target.style.height=e.target.scrollHeight+"px"
}}
placeholder="Share what you're feeling..."
rows={1}
className="
flex-1 resize-none
rounded-2xl
border border-border
bg-surface-soft
p-3
min-h-[48px]
max-h-[200px]
focus:outline-none
focus:ring-2
focus:ring-(--accent-core)/30
transition-all duration-300
"
onKeyDown={(e)=>{
if(e.key==="Enter" && !e.shiftKey){
e.preventDefault()
handleSubmit(e)
}
}}
/>

<Button
type="submit"
className="
rounded-xl
px-4
bg-(--accent-core)
hover:bg-(--accent-core)/90
"
disabled={!message.trim()}
>

<Send className="w-4 h-4"/>

</Button>

</form>

<p className="text-xs text-center text-muted mt-2">
Enter to send • Shift + Enter for newline
</p>

</div>

</div>

</div>

</div>
</main>
</div>

)
}