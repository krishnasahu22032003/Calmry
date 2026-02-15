"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getUserDetails } from "@/lib/auth/me";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ArrowRight,
  BrainCircuit,
  Heart,
  MessageSquare,
  Sparkles,
  BarChart3,
} from "lucide-react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

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
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showActivityLogger, setShowActivityLogger] = useState(false);

  const router = useRouter();

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

  return (
    <div className="relative min-h-screen">
      <DashboardHeader />

      <main className="pt-22 pb-24">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;