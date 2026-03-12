"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Activity as ActivityIcon,
  Clock,
  CheckCircle2,
  Loader2,
  Calendar,
  Sparkles,
  CheckSquare,
} from "lucide-react";
import { format } from "date-fns";

import { getUserActivities, Activity } from "@/lib/api/get-activity";
import { toggleActivityCompletion } from "@/lib/api/update-activity";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    try {
      const data = await getUserActivities();
      setActivities(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleToggle = async (activity: Activity) => {
    try {
      setUpdatingId(activity._id);

      const updated = await toggleActivityCompletion(
        activity._id,
        !activity.completed
      );

      setActivities((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <DashboardHeader />

      <main className="pt-22 pb-24">
        <Container>
          <div className="ml-10 md:ml-24 max-w-350 px-6 space-y-10">

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOrganic }}
              className="space-y-3"
            >
              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-(--accent-core)/10 flex items-center justify-center">
                  <ActivityIcon className="w-5 h-5 text-accent" />
                </div>

                <div>
                  <h1 className="font-accent text-[1.7rem] tracking-tight">
                    Activity History
                  </h1>
                  <p className="text-muted text-sm">
                    Track your completed and ongoing wellness activities.
                  </p>
                </div>

              </div>
            </motion.div>

            {loading && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            )}

            {!loading && activities.length === 0 && (
              <Card>
                <CardContent className="p-10 text-center space-y-4">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-(--accent-calm)/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-(--accent-calm)" />
                  </div>

                  <p className="text-muted max-w-md mx-auto text-sm">
                    No activities logged yet.
                  </p>

                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {activities.map((activity) => (

                <Card
                  key={activity._id}
                  className="relative flex flex-col overflow-hidden group transition-all duration-500 hover:-translate-y-1"
                >

                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background:
                        "radial-gradient(900px 400px at -10% -20%, rgba(47,63,168,0.18), transparent 60%), radial-gradient(600px 300px at 120% 120%, rgba(22,106,94,0.15), transparent 60%)",
                    }}
                  />

                  <CardContent className="relative p-6 flex flex-col gap-6">

                    <div className="flex justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-(--accent-calm)/10 flex items-center justify-center">
                          <ActivityIcon className="w-4 h-4 text-(--accent-calm)" />
                        </div>

                        <div>
                          <p className="font-medium tracking-tight">
                            {activity.name}
                          </p>
                          <p className="text-xs text-muted capitalize">
                            {activity.type}
                          </p>
                        </div>

                      </div>

               <Button
  variant="secondary"
  className={`
    h-9 w-9 rounded-xl
    transition-all duration-300
    ${updatingId === activity._id ? "opacity-60 cursor-not-allowed" : ""}
  `}
  disabled={updatingId === activity._id}
  onClick={() => handleToggle(activity)}
>
  {activity.completed ? (
    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
  ) : (
    <CheckSquare className="w-4 h-4 text-muted" />
  )}
</Button>

                    </div>

                    {activity.description && (
                      <p className="text-sm text-muted">
                        {activity.description}
                      </p>
                    )}

                    <div className="flex gap-4 text-xs text-muted">

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(activity.timestamp), "MMM d, yyyy")}
                      </div>

                      {activity.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {activity.duration} min
                        </div>
                      )}

                    </div>

                    <div className="pt-4 border-t border-border/50 text-xs">

                      {activity.completed ? (
                        <span className="text-emerald-400 font-medium">
                          Completed
                        </span>
                      ) : (
                        <span className="text-muted">
                          Not completed yet
                        </span>
                      )}

                    </div>

                  </CardContent>

                </Card>

              ))}

            </div>

          </div>
        </Container>
      </main>
    </div>
  );
}