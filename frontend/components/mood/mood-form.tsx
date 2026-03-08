"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/Select";
import { toast } from "sonner";
import { useSession } from "@/lib/contexts/session-context";
import { useRouter } from "next/navigation";
import { ENV } from "@/lib/env";

interface MoodFormProps {
onSuccess?: () => void;
}

const activityOptions = [
"meditation",
"exercise",
"walking",
"reading",
"journaling",
"therapy",
];

export function CalmryMoodForm({ onSuccess }: MoodFormProps) {
const [moodScore, setMoodScore] = useState(50);
const [note, setNote] = useState("");
const [context, setContext] = useState("");
const [activities, setActivities] = useState<string[]>([]);
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

const toggleActivity = (activity: string) => {
setActivities((prev) =>
prev.includes(activity)
? prev.filter((a) => a !== activity)
: [...prev, activity]
);
};

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
    {
      score: moodScore,
      note,
      context,
      activities,
    },
    {
      withCredentials: true,
    }
  );

  toast.success("Your emotional state has been saved.");

  setNote("");
  setContext("");
  setActivities([]);
  setMoodScore(50);

  onSuccess?.();
} catch (error: any) {
  toast.error(
    error?.response?.data?.message || "Failed to track mood"
  );
} finally {
  setIsLoading(false);
}

};

return ( 
<div className="space-y-5">

  {/* Emotion */}
  <div className="text-center space-y-1">
    <div className="text-3xl">{currentEmotion.label}</div>
    <div className="text-xs text-muted">
      {currentEmotion.description}
    </div>
  </div>

  {/* Slider */}
  <div className="space-y-3">

    <div className="flex justify-between px-1">
      {emotions.map((em) => {
        const isActive = Math.abs(moodScore - em.value) < 15;

        return (
          <div
            key={em.value}
            onClick={() => setMoodScore(em.value)}
            className={`cursor-pointer transition-all duration-200 ${
              isActive
                ? "opacity-100 scale-105"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            <div className="text-xl">{em.label}</div>
          </div>
        );
      })}
    </div>

    <div className="relative w-full">

      <div className="w-full h-1.5 rounded-full bg-surface-soft" />

      <div
        className="absolute top-0 left-0 h-1.5 rounded-full bg-accent-warm"
        style={{ width: `${moodScore}%` }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-accent-warm"
        style={{ left: `calc(${moodScore}% - 8px)` }}
      />

      <input
        type="range"
        min={0}
        max={100}
        value={moodScore}
        onChange={(e) =>
          setMoodScore(Number(e.target.value))
        }
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
    </div>
  </div>

  {/* Context */}
  <div className="space-y-1">
    <Label className="text-xs text-muted">Context</Label>

    <Select value={context} onValueChange={setContext}>
      <SelectTrigger className="h-9 bg-surface-soft border-border cursor-pointer">
        <SelectValue placeholder="Context"  />
      </SelectTrigger>

      <SelectContent className="bg-surface border-border ">
        <SelectItem value="work">Work</SelectItem>
        <SelectItem value="personal">Personal</SelectItem>
        <SelectItem value="health">Health</SelectItem>
        <SelectItem value="social">Social</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Activities */}
  <div className="space-y-1">
    <Label className="text-xs text-muted">Activities</Label>

    <div className="flex flex-wrap gap-1.5">
      {activityOptions.map((activity) => {
        const active = activities.includes(activity);

        return (
          <button
            key={activity}
            type="button"
            onClick={() => toggleActivity(activity)}
            className={`px-2 py-1 text-xs rounded-md border transition cursor-pointer
            ${
              active
                ? "bg-accent-core text-white border-transparent"
                : "bg-surface-soft border-border text-muted"
            }`}
          >
            {activity}
          </button>
        );
      })}
    </div>
  </div>

  {/* Note */}
  <div className="space-y-1">
    <Label className="text-xs text-muted">Note</Label>

    <Input
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Optional note..."
      className="h-9 bg-surface-soft border-border"
    />
  </div>

  {/* Button */}
  <Button
    variant="primary"
    className="w-full h-10 text-sm"
    onClick={handleSubmit}
    disabled={isLoading || loading}
  >
    {isLoading ? (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Saving...
      </div>
    ) : (
      "Save Mood"
    )}
  </Button>

</div>

);
}
