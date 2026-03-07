"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Check } from "lucide-react";
import Button from "@/components/ui/Button";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

export function CalmryBreathingGame() {
  const [phase, setPhase] =
    useState<"inhale" | "hold" | "exhale">("inhale");
  const [progress, setProgress] = useState(0);
  const [round, setRound] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const TOTAL_ROUNDS = 5;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (isComplete || isPaused) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (phaseRef.current === "inhale") {
            setPhase("hold");
            return 0;
          }

          if (phaseRef.current === "hold") {
            setPhase("exhale");
            return 0;
          }

          if (phaseRef.current === "exhale") {
            setRound((r) => {
              if (r >= TOTAL_ROUNDS) {
                setIsComplete(true);
                return r;
              }
              return r + 1;
            });
            setPhase("inhale");
            return 0;
          }
        }

        if (phaseRef.current === "hold") return p + 4;
        return p + 2;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isComplete]);

  const handleReset = () => {
    setPhase("inhale");
    setProgress(0);
    setRound(1);
    setIsComplete(false);
    setIsPaused(false);
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] space-y-8 text-center">

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] space-y-10">

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.6, ease: easeOrganic }}
          className="text-center space-y-6"
        >

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

      <div className="w-72">

        <div className="h-2 w-full rounded-full bg-surface-soft border border-border overflow-hidden">

          <motion.div
            className="h-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />

        </div>

      </div>

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