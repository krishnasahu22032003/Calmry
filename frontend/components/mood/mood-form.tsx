"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "sonner"; // ✅ FIXED
import { useSession } from "@/lib/contexts/session-context";
import { useRouter } from "next/navigation";
import { ENV } from "@/lib/env";

interface MoodFormProps {
  onSuccess?: () => void;
}

export function CalmryMoodForm({ onSuccess }: MoodFormProps) {
  const [moodScore, setMoodScore] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, loading } = useSession();
  const router = useRouter();

  const emotions = [
    { value: 0, label: "😔", description: "Very Low" },
    { value: 25, label: "😕", description: "Low" },
    { value: 50, label: "😊", description: "Neutral" },
    { value: 75, label: "😃", description: "Good" },
    { value: 100, label: "🤗", description: "Great" },
  ];

  const currentEmotion =
    emotions.find((em) => Math.abs(moodScore - em.value) < 15) ||
    emotions[2];

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to track your mood");
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);

      await axios.post(
        ENV.BACKEND_MOOD_URL as string,
        { score: moodScore },
        {
          withCredentials: true,
        }
      );

      toast.success("Your emotional state has been saved."); // ✅ FIXED

      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to track mood"
      ); // ✅ FIXED
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6">

      <div className="text-center space-y-3">
        <div className="text-5xl">{currentEmotion.label}</div>
        <div className="text-sm text-muted tracking-wide">
          {currentEmotion.description}
        </div>
      </div>

      <div className="space-y-6">

        <div className="flex justify-between px-2">
          {emotions.map((em) => {
            const isActive = Math.abs(moodScore - em.value) < 15;

            return (
              <div
                key={em.value}
                onClick={() => setMoodScore(em.value)}
                className={`cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "opacity-100 scale-110"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <div className="text-2xl">{em.label}</div>
              </div>
            );
          })}
        </div>

        <div className="relative w-full">

          <div className="w-full h-2 rounded-full bg-gray-700" />

          <div
            className="absolute top-0 left-0 h-2 rounded-full bg-orange-500 transition-all"
            style={{ width: `${moodScore}%` }}
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-4 border-orange-500 shadow-md transition-all"
            style={{ left: `calc(${moodScore}% - 10px)` }}
          />

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={moodScore}
            onChange={(e) =>
              setMoodScore(Number(e.target.value))
            }
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <Button
        variant="primary"
        className="w-full py-6 text-base"
        onClick={handleSubmit}
        disabled={isLoading || loading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        ) : loading ? (
          "Loading..."
        ) : (
          "Save Mood"
        )}
      </Button>
    </div>
  );
}