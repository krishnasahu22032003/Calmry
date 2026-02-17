"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Check } from "lucide-react";
import Button from "@/components/ui/Button";

const TOTAL_ROUNDS = 5;
const easeOrganic = [0.22, 1, 0.36, 1] as const;

export function CalmryBreathingGame() {
  const [phase, setPhase] =
    useState<"inhale" | "hold" | "exhale">("inhale");
  const [progress, setProgress] = useState(0);
  const [round, setRound] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isComplete || isPaused) return;

    let timer: NodeJS.Timeout;

    if (phase === "inhale") {
      timer = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPhase("hold");
            return 0;
          }
          return p + 2;
        });
      }, 100);
    } else if (phase === "hold") {
      timer = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPhase("exhale");
            return 0;
          }
          return p + 4;
        });
      }, 100);
    } else {
      timer = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            if (round >= TOTAL_ROUNDS) {
              setIsComplete(true);
              return p;
            }
            setPhase("inhale");
            setRound((r) => r + 1);
            return 0;
          }
          return p + 2;
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [phase, round, isComplete, isPaused]);

  const handleReset = () => {
    setPhase("inhale");
    setProgress(0);
    setRound(1);
    setIsComplete(false);
    setIsPaused(false);
  };

  /* ================= COMPLETION SCREEN ================= */

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-105 space-y-8 text-center">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: easeOrganic }}
          className="
            w-24 h-24 rounded-full
            bg-(--accent-calm)/15
            flex items-center justify-center
            breathe
          "
        >
          <Check className="w-10 h-10 text-(--accent-calm)" />
        </motion.div>

        <div className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-tight">
            Beautiful work.
          </h3>

          <p className="text-muted max-w-sm mx-auto leading-relaxed">
            You completed {TOTAL_ROUNDS} mindful breathing rounds.
            Notice how your body feels now.
          </p>
        </div>

        <Button
          variant="primary"
          className="px-8 py-5"
          onClick={handleReset}
        >
          Begin Again
        </Button>
      </div>
    );
  }

  /* ================= ACTIVE SESSION ================= */

  return (
    <div className="flex flex-col items-center justify-center h-105 space-y-10">

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.6, ease: easeOrganic }}
          className="text-center space-y-6"
        >

          {/* Breathing Orb */}
          <div className="relative w-40 h-40 mx-auto">

            <motion.div
              animate={{
                scale:
                  phase === "inhale"
                    ? 1.6
                    : phase === "exhale"
                    ? 1
                    : 1.3,
              }}
              transition={{
                duration: 4,
                ease: easeOrganic,
              }}
              className="
                absolute inset-0
                rounded-full
                bg-(--accent-core)/15
                blur-xl
              "
            />

            <div
              className="
                absolute inset-0
                flex items-center justify-center
                rounded-full
                bg-surface-soft
                border border-border
              "
            >
              <Wind className="w-8 h-8 text-accent" />
            </div>

          </div>

          <h3 className="text-2xl font-semibold tracking-tight">
            {phase === "inhale"
              ? "Breathe In"
              : phase === "hold"
              ? "Hold"
              : "Breathe Out"}
          </h3>

        </motion.div>
      </AnimatePresence>

      {/* Progress Bar (Custom Calmry Style) */}
      <div className="w-72">

        <div className="h-2 w-full rounded-full bg-surface-soft border border-border overflow-hidden">

          <motion.div
            className="h-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />

        </div>

      </div>

      {/* Footer Controls */}
      <div className="space-y-3 text-center">

        <div className="text-sm text-muted tracking-wide">
          Round {round} of {TOTAL_ROUNDS}
        </div>

        <Button
          variant="secondary"
        
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>

      </div>

    </div>
  );
}
