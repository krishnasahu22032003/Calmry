"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TreePine,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from "lucide-react";
import Button from "@/components/ui/Button";

const MEDITATION_DURATION = 5 * 60;
const easeOrganic = [0.22, 1, 0.36, 1] as const;

export function CalmryForestExperience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] =
    useState(MEDITATION_DURATION);

  const [audioElements] = useState({
    birds: new Audio("/sounds/birds.mp3"),
    wind: new Audio("/sounds/wind.mp3"),
    leaves: new Audio("/sounds/leaves.mp3"),
  });

  /* ================= AUDIO SETUP ================= */

  useEffect(() => {
    Object.values(audioElements).forEach((audio) => {
      audio.loop = true;
      audio.volume = volume / 100;
    });

    return () => {
      Object.values(audioElements).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  useEffect(() => {
    Object.values(audioElements).forEach((audio) => {
      audio.volume = volume / 100;
    });
  }, [volume]);

  /* ================= TIMER ================= */

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const updated = prev - 1;

          setProgress(
            ((MEDITATION_DURATION - updated) /
              MEDITATION_DURATION) *
              100
          );

          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const togglePlay = () => {
    if (isPlaying) {
      Object.values(audioElements).forEach((a) =>
        a.pause()
      );
    } else {
      Object.values(audioElements).forEach((a) =>
        a.play()
      );
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col items-center justify-center h-115 space-y-10">

      {/* Forest Orb */}
      <div className="relative w-56 h-56">

        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 0.6, -0.6, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: easeOrganic,
          }}
          className="absolute inset-0 rounded-full"
        >
          <div
            className="
              absolute inset-0
              rounded-full
              bg-(--accent-calm)/20
              blur-2xl
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
            <TreePine className="w-24 h-24 text-(--accent-calm)" />
          </div>
        </motion.div>

      </div>

      {/* Controls */}
      <div className="w-80 space-y-8">

        {/* Volume */}
        <div className="space-y-3">

          <div className="flex justify-between text-sm text-muted tracking-wide">
            <span>Ambient Volume</span>
            <span>{volume}%</span>
          </div>

          <div className="flex items-center gap-3">

            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-muted" />
            ) : (
              <Volume2 className="w-4 h-4 text-muted" />
            )}

            {/* Custom Calmry Slider */}
            <div className="relative w-full h-2 rounded-full bg-surface-soft border border-border">

              <div
                className="absolute h-full bg-(--accent-calm) rounded-full transition-all"
                style={{ width: `${volume}%` }}
              />

              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) =>
                  setVolume(Number(e.target.value))
                }
                className="
                  absolute inset-0 w-full opacity-0 cursor-pointer
                "
              />
            </div>

          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3">

          <div className="h-2 w-full rounded-full bg-surface-soft border border-border overflow-hidden">
            <motion.div
              className="h-full bg-(--accent-calm)"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted">
            <span>{formatTime(timeLeft)}</span>
            <span>{formatTime(MEDITATION_DURATION)}</span>
          </div>

        </div>

        {/* Play Button */}
        <div className="flex justify-center pt-2">

          <Button
            variant="secondary"
            onClick={togglePlay}
            className="
              w-14 h-14 rounded-full
              flex items-center justify-center
            "
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>

        </div>

      </div>

    </div>
  );
}
