"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Flower2,
  Wind,
  TreePine,
  Waves,
  Music2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/Button";
import { Dialog , DialogContent } from "../ui/Dialog";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

const activities = [
  {
    id: "breathing",
    title: "Breathing Patterns",
    description:
      "Follow calming breathing exercises with immersive visual rhythm.",
    icon: Wind,
    accent: "core",
    duration: "5 mins",
  },
  {
    id: "garden",
    title: "Zen Garden",
    description:
      "Create and maintain your digital peaceful space.",
    icon: Flower2,
    accent: "warm",
    duration: "10 mins",
  },
  {
    id: "forest",
    title: "Mindful Forest",
    description:
      "Take a peaceful walk through a virtual forest.",
    icon: TreePine,
    accent: "calm",
    duration: "15 mins",
  },
  {
    id: "waves",
    title: "Ocean Waves",
    description:
      "Match your breath with gentle ocean waves.",
    icon: Waves,
    accent: "calm",
    duration: "8 mins",
  },
];
interface CalmryMindActivitiesProps {
  onGamePlayed?: (
    gameName: string,
    description: string
  ) => Promise<void>;
}

export const CalmryMindActivities = ({
  onGamePlayed,
}: CalmryMindActivitiesProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleStart = (id: string) => {
    setSelected(id);
    setOpen(true);
  };

  const getAccentStyles = (accent: string) => {
    switch (accent) {
      case "core":
        return {
          bg: "bg-(--accent-core)/10",
          hoverBg: "group-hover:bg-(--accent-core)/20",
          text: "text-accent",
        };
      case "calm":
        return {
          bg: "bg-(--accent-calm)/10",
          hoverBg: "group-hover:bg-(--accent-calm)/20",
          text: "text-(--accent-calm)",
        };
      case "warm":
        return {
          bg: "bg-(--accent-warm)/10",
          hoverBg: "group-hover:bg-(--accent-warm)/20",
          text: "text-(--accent-warm)",
        };
      default:
        return {
          bg: "bg-surface-soft",
          hoverBg: "",
          text: "text-foreground",
        };
    }
  };

  return (
    <>
      <Card className="relative overflow-hidden group transition-all duration-500 hover:-translate-y-1">

        {/* Emotional Glow */}
        <div
          className="
            pointer-events-none absolute inset-0
            opacity-0 group-hover:opacity-100
            transition-opacity duration-700
          "
          style={{
            background:
              "radial-gradient(900px 400px at 0% 0%, rgba(47,63,168,0.18), transparent 60%), radial-gradient(600px 300px at 100% 100%, rgba(22,106,94,0.14), transparent 60%)",
          }}
        />

        <CardContent className="relative p-10 space-y-10">

          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">

              <div
                className="
                  w-10 h-10 rounded-xl
                  bg-(--accent-core)/10
                  flex items-center justify-center
                  transition-all duration-500
                  group-hover:bg-(--accent-core)/20
                "
              >
                <Gamepad2 className="w-5 h-5 text-accent" />
              </div>

              <h3 className="font-accent text-[1.15rem] tracking-tight">
                Calmry Relief Activities
              </h3>

            </div>

            <p className="text-[14px] text-muted leading-relaxed">
              Interactive emotional reset tools designed to reduce anxiety and restore clarity.
            </p>
          </div>

          {/* Activity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {activities.map((activity) => {
              const styles = getAccentStyles(activity.accent);

              return (
                <motion.div
                  key={activity.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.4, ease: easeOrganic }}
                >
                  <div
                    onClick={() => handleStart(activity.id)}
                    className="
                      group/activity
                      relative
                      p-6 rounded-2xl
                      bg-surface-soft
                      border border-border
                      cursor-pointer
                      transition-all duration-500
                      hover:-translate-y-1
                      hover:shadow-[0_0_40px_rgba(47,63,168,0.15)]
                    "
                  >
                    <div className="flex items-start gap-4">

                      <div
                        className={`
                          w-12 h-12 rounded-2xl
                          flex items-center justify-center
                          transition-all duration-500
                          ${styles.bg}
                          ${styles.hoverBg}
                        `}
                      >
                        <activity.icon className={`w-6 h-6 ${styles.text}`} />
                      </div>

                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium tracking-wide">
                          {activity.title}
                        </h4>

                        <p className="text-sm text-muted leading-relaxed">
                          {activity.description}
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                          <Music2 className="w-4 h-4 text-muted" />
                          <span className="text-xs text-muted">
                            {activity.duration}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })}

          </div>

          {/* CTA */}
          {selected && (
            <div className="pt-6 text-center">
              <Button
                variant="primary"
                className="px-8 py-5 text-base"
                onClick={() => setOpen(true)}
              >
                Begin {activities.find((a) => a.id === selected)?.title}
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass max-w-160 p-8">
          <div className="space-y-6">
            <h3 className="font-accent text-lg tracking-tight">
              {activities.find((a) => a.id === selected)?.title}
            </h3>

            <div className="text-sm text-muted">
              Your immersive experience will appear here.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
