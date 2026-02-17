"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getUserDetails } from "@/lib/auth/me";
import { Card, CardContent } from "@/components/ui/Card";
import { addDays, format, isWithinInterval, startOfDay, subDays } from "date-fns";
import { Container } from "@/components/ui/Container";
import { CalmryMindActivities } from "@/components/games/AnxietyGames ";
import {
  ArrowRight,
  BrainCircuit,
  Heart,
  MessageSquare,
  Sparkles,
  BarChart3,
  Loader2,
  Brain,
  Trophy,
  Activity,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { getAllChatSessions } from "@/lib/api/chat";
import axios from "axios";
import { ENV } from "@/lib/env";

type ActivityLevel = "none" | "low" | "medium" | "high";

interface DayActivity {
  date: Date;
  level: ActivityLevel;
  activities: {
    type: string;
    name: string;
    completed: boolean;
    time?: string;
  }[];
}

interface Activity {
  id: string;
  userId: string | null;
  type: string;
  name: string;
  description: string | null;
  timestamp: Date;
  duration: number | null;
  completed: boolean;
  moodScore: number | null;
  moodNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DailyStats {
  moodScore: number | null;
  completionRate: number;
  mindfulnessCount: number;
  totalActivities: number;
  lastUpdated: Date;
}

const calculateDailyStats = (activities: Activity[]): DailyStats => {
  const today = startOfDay(new Date());
  const todaysActivities = activities.filter((activity) =>
    isWithinInterval(new Date(activity.timestamp), {
      start: today,
      end: addDays(today, 1),
    })
  );

  // Calculate mood score (average of today's mood entries)
  const moodEntries = todaysActivities.filter(
    (a) => a.type === "mood" && a.moodScore !== null
  );
  const averageMood =
    moodEntries.length > 0
      ? Math.round(
          moodEntries.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) /
            moodEntries.length
        )
      : null;

  // Count therapy sessions (all sessions ever)
  const therapySessions = activities.filter((a) => a.type === "therapy").length;

  return {
    moodScore: averageMood,
    completionRate: 100, // Always 100% as requested
    mindfulnessCount: therapySessions, // Total number of therapy sessions
    totalActivities: todaysActivities.length,
    lastUpdated: new Date(),
  };
};

const generateInsights = (activities: Activity[]) => {
  const insights: {
    title: string;
    description: string;
    icon: any;
    priority: "low" | "medium" | "high";
  }[] = [];

  // Get activities from last 7 days
  const lastWeek = subDays(new Date(), 7);
  const recentActivities = activities.filter(
    (a) => new Date(a.timestamp) >= lastWeek
  );

  // Analyze mood patterns
  const moodEntries = recentActivities.filter(
    (a) => a.type === "mood" && a.moodScore !== null
  );
  if (moodEntries.length >= 2) {
    const averageMood =
      moodEntries.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) /
      moodEntries.length;
    const latestMood = moodEntries[moodEntries.length - 1].moodScore || 0;

    if (latestMood > averageMood) {
      insights.push({
        title: "Mood Improvement",
        description:
          "Your recent mood scores are above your weekly average. Keep up the good work!",
        icon: Brain,
        priority: "high",
      });
    } else if (latestMood < averageMood - 20) {
      insights.push({
        title: "Mood Change Detected",
        description:
          "I've noticed a dip in your mood. Would you like to try some mood-lifting activities?",
        icon: Heart,
        priority: "high",
      });
    }
  }

  const mindfulnessActivities = recentActivities.filter((a) =>
    ["game", "meditation", "breathing"].includes(a.type)
  );
  if (mindfulnessActivities.length > 0) {
    const dailyAverage = mindfulnessActivities.length / 7;
    if (dailyAverage >= 1) {
      insights.push({
        title: "Consistent Practice",
        description: `You've been regularly engaging in mindfulness activities. This can help reduce stress and improve focus.`,
        icon: Trophy,
        priority: "medium",
      });
    } else {
      insights.push({
        title: "Mindfulness Opportunity",
        description:
          "Try incorporating more mindfulness activities into your daily routine.",
        icon: Sparkles,
        priority: "low",
      });
    }
  }

  const completedActivities = recentActivities.filter((a) => a.completed);
  const completionRate =
    recentActivities.length > 0
      ? (completedActivities.length / recentActivities.length) * 100
      : 0;

  if (completionRate >= 80) {
    insights.push({
      title: "High Achievement",
      description: `You've completed ${Math.round(
        completionRate
      )}% of your activities this week. Excellent commitment!`,
      icon: Trophy,
      priority: "high",
    });
  } else if (completionRate < 50) {
    insights.push({
      title: "Activity Reminder",
      description:
        "You might benefit from setting smaller, more achievable daily goals.",
      icon: Calendar,
      priority: "medium",
    });
  }
  
  // Time pattern analysis
  const morningActivities = recentActivities.filter(
    (a) => new Date(a.timestamp).getHours() < 12
  );
  const eveningActivities = recentActivities.filter(
    (a) => new Date(a.timestamp).getHours() >= 18
  );

  if (morningActivities.length > eveningActivities.length) {
    insights.push({
      title: "Morning Person",
      description:
        "You're most active in the mornings. Consider scheduling important tasks during your peak hours.",
      icon: Sun,
      priority: "medium",
    });
  } else if (eveningActivities.length > morningActivities.length) {
    insights.push({
      title: "Evening Routine",
      description:
        "You tend to be more active in the evenings. Make sure to wind down before bedtime.",
      icon: Moon,
      priority: "medium",
    });
  }

  // Sort insights by priority and return top 3
  return insights
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);
};

const easeOrganic = [0.22, 1, 0.36, 1] as const;

const lines = [
  "Clarity emerges when noise fades.",
  "Your momentum is building quietly.",
  "Small reflections create lasting change.",
  "Consistency compounds silently.",
  "This space grows with you.",
];

export const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showCheckInChat, setShowCheckInChat] = useState(false);
  const [activityHistory, setActivityHistory] = useState<DayActivity[]>([]);
  const [isSavingActivity, setIsSavingActivity] = useState(false);
  const [isSavingMood, setIsSavingMood] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showActivityLogger, setShowActivityLogger] = useState(false);
    const [dailyStats, setDailyStats] = useState<DailyStats>({
    moodScore: null,
    completionRate: 100,
    mindfulnessCount: 0,
    totalActivities: 0,
    lastUpdated: new Date(),
  });
  const [insights, setInsights] = useState<
    {
      title: string;
      description: string;
      icon: any;
      priority: "low" | "medium" | "high";
    }[]
  >([]);
  const router = useRouter();

  const transformActivitiesToDayActivity = (
    activities: Activity[]
  ): DayActivity[] => {
    const days: DayActivity[] = [];
    const today = new Date();

    // Create array for last 28 days
    for (let i = 27; i >= 0; i--) {
      const date = startOfDay(subDays(today, i));
      const dayActivities = activities.filter((activity) =>
        isWithinInterval(new Date(activity.timestamp), {
          start: date,
          end: addDays(date, 1),
        })
      );

      // Determine activity level based on number of activities
      let level: ActivityLevel = "none";
      if (dayActivities.length > 0) {
        if (dayActivities.length <= 2) level = "low";
        else if (dayActivities.length <= 4) level = "medium";
        else level = "high";
      }

      days.push({
        date,
        level,
        activities: dayActivities.map((activity) => ({
          type: activity.type,
          name: activity.name,
          completed: activity.completed,
          time: format(new Date(activity.timestamp), "h:mm a"),
        })),
      });
    }

    return days;
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % lines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserDetails();
        setUsername(user?.username || "User");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleStartTherapy = () => {
    router.push("/therapy/new");
  };

  const handleAICheckIn = () => {
    setShowActivityLogger(true);
  };


// assuming you already have this axios instance
// import { api } from "@/services/api";

const fetchDailyStats = useCallback(async () => {
  try {
    // 1️⃣ Fetch therapy sessions
    const sessions = await getAllChatSessions();

    // 2️⃣ Fetch today's activities using axios
    const activitiesResponse = await axios.get(
      ENV.BACKEND_ACTIVITY_URL as string,
      { withCredentials: true } // needed for cookie auth
    );

    const activities = activitiesResponse.data;

    // 3️⃣ Calculate mood score
    const moodEntries = activities.filter(
      (a: Activity) => a.type === "mood" && a.moodScore !== null
    );

    const averageMood =
      moodEntries.length > 0
        ? Math.round(
            moodEntries.reduce(
              (acc: number, curr: Activity) =>
                acc + (curr.moodScore || 0),
              0
            ) / moodEntries.length
          )
        : null;

    // 4️⃣ Set state
    setDailyStats({
      moodScore: averageMood,
      completionRate: 100,
      mindfulnessCount: sessions.length,
      totalActivities: activities.length,
      lastUpdated: new Date(),
    });
  } catch (error: any) {
    console.error(
      "Error fetching daily stats:",
      error.response?.data || error.message
    );
  }
}, []);
  const wellnessStats = [
    {
      title: "Mood Score",
      value: dailyStats.moodScore ? `${dailyStats.moodScore}%` : "No data",
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Today's average mood",
    },
    {
      title: "Completion Rate",
      value: "100%",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: "Perfect completion rate",
    },
    {
      title: "Therapy Sessions",
      value: `${dailyStats.mindfulnessCount} sessions`,
      icon: Heart,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      description: "Total sessions completed",
    },
    {
      title: "Total Activities",
      value: dailyStats.totalActivities.toString(),
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Planned for today",
    },
  ];
  return (
    <div className="relative min-h-screen">
      
      <DashboardHeader />

      <main className="pt-22 pb-24">
        <Container>
        <div className="ml-10 md:ml-24 max-w-350 px-6 space-y-4">

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOrganic }}
            className="font-accent text-[1.7rem] md:text-[2rem] leading-snug tracking-tight"
          >
            {loading ? (
              <span className="text-muted text-base">Loading...</span>
            ) : (
              <>
                Welcome back,{" "}
                <span className="text-accent">{username}</span>
              </>
            )}
          </motion.h1>

          <div className="h-6 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: easeOrganic }}
                className="absolute text-[14px] text-muted leading-relaxed"
              >
                {lines[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="text-sm text-muted tracking-wide pb-3">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ">
            <Card className="relative overflow-hidden group transition-all duration-500 hover:-translate-y-1">
              <div
                className="
      pointer-events-none absolute inset-0
      opacity-0 group-hover:opacity-100
      transition-opacity duration-700
    "
                style={{
                  background:
                    "radial-gradient(900px 400px at -10% -20%, rgba(47,63,168,0.18), transparent 60%), radial-gradient(600px 300px at 120% 120%, rgba(22,106,94,0.15), transparent 60%)",
                }}
              />

              <CardContent className="relative p-10 space-y-8">
                <div className="flex items-center gap-4">

                  <div
                    className="
          w-12 h-12 rounded-2xl
          bg-(--accent-core)/10
          flex items-center justify-center
          transition-all duration-500
          group-hover:bg-(--accent-core)/20
          group-hover:scale-105
        "
                  >
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>

                  <div>
                    <h3 className="font-accent text-[1.1rem] tracking-tight">
                      Quick Actions
                    </h3>
                    <p className="text-[14px] text-muted leading-relaxed">
                      Continue your clarity journey with intention.
                    </p>
                  </div>

                </div>
                <Button
                  variant="primary"
                  className="
        w-full justify-between px-8 py-6 text-base
        group/button
      "
                  onClick={handleStartTherapy}
                >
                  <div className="flex items-center gap-4">

                    <div className="
          w-10 h-10 rounded-xl
          bg-white/10
          flex items-center justify-center
        ">
                      <MessageSquare className="w-5 h-5 text-foreground" />
                    </div>

                    <div className="text-left">
                      <div className="font-semibold">
                        Begin Session
                      </div>
                      <div className="text-sm opacity-80">
                        Start a guided reflection
                      </div>
                    </div>

                  </div>

                  <ArrowRight
                    className="
          w-5 h-5 opacity-60
          transition-all duration-300
          group-hover/button:translate-x-1
          group-hover/button:opacity-100
          font-bold
        "
                  />
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="secondary"
                    className="
      h-35 p-2
      flex flex-col items-center justify-center
      text-center
      transition-all duration-500
      hover:-translate-y-1
    "
                    onClick={() => setShowMoodModal(true)}
                  >
                    <div className="flex flex-col items-center gap-3 ">

                      <div className="
        w-12 h-12 rounded-2xl
        bg-(--accent-warm)/10
        flex items-center justify-center
        transition-all duration-500
       hover:bg-(--accent-warm)/20
      ">
                        <Heart className="w-5 h-5  text-(--accent-warm)" />
                      </div>

                      <div className="font-medium text-sm">
                        Track Mood
                      </div>

                      <div className="text-xs text-muted">
                        How are you feeling?
                      </div>

                    </div>
                  </Button>

                  {/* AI */}
                  <Button
                    variant="secondary"
                    className="
      h-35 p-2
      flex flex-col items-center justify-center
      text-center
      transition-all duration-500
      hover:-translate-y-1
    "
                    onClick={handleAICheckIn}
                  >
                    <div className="flex flex-col items-center gap-3">

                      <div className="
        w-12 h-12 rounded-2xl
        bg-(--accent-calm)/10
        flex items-center justify-center
        transition-all duration-500
        hover:bg-(--accent-calm)/20
      ">
                        <BrainCircuit className="w-5 h-5 text-(--accent-calm)" />
                      </div>

                      <div className="font-medium text-sm">
                        Check-In
                      </div>

                      <div className="text-xs text-muted ">
                        Quick wellness reset
                      </div>

                    </div>
                  </Button>

                </div>
              </CardContent>
            </Card>
             {/*Second card */}
           <Card className="relative overflow-hidden group transition-all duration-500 hover:-translate-y-1">

  {/* Subtle Emotional Glow Layer */}
  <div
    className="
      pointer-events-none absolute inset-0
      opacity-0 group-hover:opacity-100
      transition-opacity duration-700
    "
    style={{
      background:
        "radial-gradient(900px 400px at 0% 0%, rgba(47,63,168,0.16), transparent 60%), radial-gradient(600px 300px at 100% 100%, rgba(22,106,94,0.14), transparent 60%)",
    }}
  />

  <CardContent className="relative p-10 space-y-10">

    {/* Header Section */}
    <div className="flex items-start justify-between gap-6">

      <div className="space-y-2">
        <h3 className="font-accent text-[1.15rem] tracking-tight">
          Today’s Overview
        </h3>

        <p className="text-[14px] text-muted leading-relaxed">
          Your wellness metrics for{" "}
          {format(new Date(), "MMMM d, yyyy")}
        </p>
      </div>

      <Button
        variant="secondary"
        onClick={fetchDailyStats}
        className="
          h-10 w-10 rounded-xl
          bg-(--accent-core)/10
          hover:bg-(--accent-core)/20
          transition-all duration-500
        "
      >
        <Loader2 className="w-4 h-4 text-accent animate-spin" />
      </Button>

    </div>

    {/* Metrics Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

      {wellnessStats.map((stat) => (
        <div
          key={stat.title}
          className="
            relative group/stat
            p-6 rounded-2xl
           bg-surface-soft
            border border-border
            transition-all duration-500
            hover:-translate-y-1
            hover:shadow-[0_0_40px_rgba(47,63,168,0.15)]
          "
        >

          {/* Soft Glow on Hover */}
          <div
            className="
              absolute inset-0 rounded-2xl
              opacity-0 group-hover/stat:opacity-100
              transition-opacity duration-700
            "
            style={{
              background:
                "radial-gradient(500px 200px at 50% 0%, rgba(47,63,168,0.15), transparent 70%)",
            }}
          />

          <div className="relative space-y-4">

            {/* Icon + Title */}
            <div className="flex items-center gap-3">

              <div
                className="
                  w-10 h-10 rounded-xl
                  flex items-center justify-center
                  bg-(--accent-calm)/10
                  transition-all duration-500
                  group-hover/stat:bg-(--accent-calm)/20
                "
              >
                <stat.icon className="w-5 h-5 text-(--accent-calm)" />
              </div>

              <p className="text-sm font-medium tracking-wide">
                {stat.title}
              </p>

            </div>

            {/* Main Value */}
            <div className="text-3xl font-semibold tracking-tight">
              {stat.value}
            </div>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed">
              {stat.description}
            </p>

          </div>

        </div>
      ))}

    </div>

    {/* Footer */}
    <div className="pt-2 border-t border-border text-xs text-muted text-right tracking-wide">
      Last updated: {format(dailyStats.lastUpdated, "h:mm a")}
    </div>

  </CardContent>
</Card>


{/* Third Card – Insights */}
<Card className="relative overflow-hidden group transition-all duration-500 hover:-translate-y-1">

  {/* Emotional Glow Layer */}
  <div
    className="
      pointer-events-none absolute inset-0
      opacity-0 group-hover:opacity-100
      transition-opacity duration-700
    "
    style={{
      background:
        "radial-gradient(900px 400px at 10% 0%, rgba(47,63,168,0.18), transparent 60%), radial-gradient(600px 300px at 100% 100%, rgba(22,106,94,0.14), transparent 60%)",
    }}
  />

  <CardContent className="relative p-10 space-y-10">

    {/* Header */}
    <div className="space-y-2">
      <div className="flex items-center gap-3">

        <div
          className="
            w-10 h-10 rounded-xl
            bg-(--accent-core)/10
            flex items-center justify-center
            transition-all duration-500
            group-hover:bg-(--accent-core)/20
          "
        >
          <BrainCircuit className="w-5 h-5 text-accent" />
        </div>

        <h3 className="font-accent text-[1.15rem] tracking-tight">
          Insights
        </h3>

      </div>

      <p className="text-[14px] text-muted leading-relaxed">
        Personalized recommendations based on your activity patterns.
      </p>
    </div>

    {/* Insights Content */}
    <div className="space-y-5">

      {insights.length > 0 ? (
        insights.map((insight, index) => {

          const priorityStyles =
            insight.priority === "high"
              ? "bg-(--accent-core)/10 border border-(--accent-core)/20"
              : insight.priority === "medium"
              ? "bg-(--accent-calm)/10 border border-(--accent-calm)/20"
              : "bg-surface-soft border border-border";

          return (
            <div
              key={index}
              className={`
                relative group/insight
                p-6 rounded-2xl
                transition-all duration-500
                hover:-translate-y-1
                hover:shadow-[0_0_40px_rgba(47,63,168,0.12)]
                ${priorityStyles}
              `}
            >

              <div className="space-y-3">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-9 h-9 rounded-xl
                      bg-white/5
                      flex items-center justify-center
                    "
                  >
                    <insight.icon className="w-4 h-4 text-foreground" />
                  </div>

                  <p className="font-medium tracking-wide">
                    {insight.title}
                  </p>

                </div>

                <p className="text-sm text-muted leading-relaxed">
                  {insight.description}
                </p>

              </div>

            </div>
          );
        })
      ) : (
        <div className="text-center py-10 space-y-4">

          <div
            className="
              w-14 h-14 mx-auto rounded-2xl
              bg-(--accent-calm)/10
              flex items-center justify-center
            "
          >
            <Activity className="w-6 h-6 text-(--accent-calm)" />
          </div>

          <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
            Complete more activities to receive personalized insights tailored to your emotional rhythm.
          </p>

        </div>
      )}

    </div>
  </CardContent>
</Card>
    </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side - Spans 2 columns */}
            <div className="lg:col-span-3 space-y-6">
              {/* Anxiety Games - Now directly below Fitbit */}
              <CalmryMindActivities onGamePlayed={handleGamePlayed} />
            </div>
          </div>
        </div>
   
          </Container>
        
      </main>
    </div>
  );
};

export default Dashboard;