"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog"
import Button from "../ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/contexts/session-context";
import { logActivity } from "@/lib/api/activity";

const activityTypes = [
  { id: "meditation", name: "Meditation" },
  { id: "exercise", name: "Exercise" },
  { id: "walking", name: "Walking" },
  { id: "reading", name: "Reading" },
  { id: "journaling", name: "Journaling" },
  { id: "therapy", name: "Therapy Session" },
];

interface ActivityLoggerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivityLogged: () => void;
}

export function ActivityLogger({
  open,
  onOpenChange,
  onActivityLogged,
}: ActivityLoggerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const { toast } = useToast();
  const { isAuthenticated, loading } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to log activities",
        variant: "destructive",
      });
      return;
    }

    if (!type || !name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await logActivity({
        type,
        name,
        description,
        duration: duration ? parseInt(duration) : undefined,
      });

      setType("");
      setName("");
      setDuration("");
      setDescription("");

      toast({
        title: "Activity logged",
        description: "Your wellness activity has been recorded.",
      });

      onActivityLogged();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to log activity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          glass
          max-w-[520px]
          p-8
        "
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-accent tracking-tight text-lg">
            Log Activity
          </DialogTitle>
          <DialogDescription className="text-sm text-muted">
            Record your wellness activity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Activity Type */}
          <div className="space-y-2">
            <Label className="text-sm text-muted">
              Activity Type
            </Label>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-surface-soft border-border">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border">
                {activityTypes.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-sm text-muted">
              Name
            </Label>
            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Morning Meditation, Evening Walk..."
              className="bg-surface-soft border-border"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="text-sm text-muted">
              Duration (minutes)
            </Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
              placeholder="15"
              className="bg-surface-soft border-border"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm text-muted">
              Description (optional)
            </Label>
            <Input
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="How did it go?"
              className="bg-surface-soft border-border"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
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
                "Save Activity"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
