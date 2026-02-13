"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

export const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState("User"); // Replace with real user later

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      <DashboardHeader />

      <main className="pt-28 px-6 pb-12">
  <div className="mx-auto max-w-6xl">

    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: easeOrganic }}
      className="space-y-3"
    >
      {/* One-line welcome */}
      <h1 className="font-accent text-[clamp(1.6rem,2.4vw,2rem)] text-foreground leading-tight">
        Welcome back,{" "}
        <span className="text-accent">
          {username}
        </span>
      </h1>

      {/* Jaw-dropping subtitle */}
      <p className="text-sm text-muted max-w-xl leading-relaxed">
        A quiet space built around you — where reflection feels natural,
        progress feels gentle, and clarity unfolds without pressure.
      </p>

      {/* Date (subtle) */}
      <p className="text-xs text-muted tracking-wide pt-2">
        {currentTime.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>
    </motion.div>

  </div>
</main>
    </div>
  );
};

export default Dashboard;