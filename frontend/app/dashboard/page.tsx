"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getUserDetails } from "@/lib/auth/me";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

const lines = [
  "Clarity emerges when noise fades.",
  "Your momentum is building quietly.",
  "Small reflections create lasting change.",
  "Consistency compounds silently.",
  "This space grows with you."
];

export const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate lines every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % lines.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch user
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

  return (
    <div className="relative min-h-screen">
      <DashboardHeader />

      <main className="pt-28 pb-24">
        <div className="ml-10 md:ml-24 max-w-2xl px-6 space-y-2">

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOrganic }}
            className="font-accent text-[1.6rem] md:text-[1.8rem] leading-snug tracking-tight"
          >
            {loading ? (
              <span className="text-muted text-base">Loading...</span>
            ) : (
              <>
                Welcome back,{" "}
                <span className="text-accent">
                  {username}
                </span>
              </>
            )}
          </motion.h1>

          {/* Rotating Insight Line */}
          <div className="h-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.7, ease: easeOrganic }}
                className="absolute text-[14.5px] text-muted leading-relaxed"
              >
                {lines[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Date & Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1, ease: easeOrganic }}
            className="text-sm text-muted tracking-wide "
          >
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            {" "}
           
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;