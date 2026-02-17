"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Button from "@/components/Button";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/contexts/session-context";
import { useRouter } from "next/navigation";

interface MoodFormProps {
  onSuccess?: () => void;
}

export function CalmryMoodForm({ onSuccess }: MoodFormProps) {
  const [moodScore, setMoodScore] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { user, isAuthenticated, loading } = useSession();
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
      toast({
        title: "Authentication required",
        description: "Please log in to track your mood",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: moodScore }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to track mood");
      }

      toast({
        title: "Mood recorded",
        description: "Your emotional state has been saved.",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to track mood",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6">

      {/* Emotion Display */}
      <div className="text-center space-y-3">

        <div className="text-5xl">
          {currentEmotion.label}
        </div>

        <div className="text-sm text-muted tracking-wide">
          {currentEmotion.description}
        </div>

      </div>

      {/* Emotion Selector */}
      <div className="space-y-6">

        <div className="flex justify-between px-2">

          {emotions.map((em) => {
            const isActive =
              Math.abs(moodScore - em.value) < 15;

            return (
              <div
                key={em.value}
                onClick={() => setMoodScore(em.value)}
                className={`
                  cursor-pointer
                  transition-all duration-300
                  ${
                    isActive
                      ? "opacity-100 scale-110"
                      : "opacity-50 hover:opacity-80"
                  }
                `}
              >
                <div className="text-2xl">
                  {em.label}
                </div>
              </div>
            );
          })}

        </div>

        {/* Custom Calmry Slider */}
        <div className="relative w-full h-2 rounded-full bg-surface-soft border border-border">

          <div
            className="absolute h-full bg-(--accent-warm) rounded-full transition-all"
            style={{ width: `${moodScore}%` }}
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

      {/* Submit */}
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
