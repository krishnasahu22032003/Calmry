"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Brain,
  Shield,
  Waves,
  ArrowRight,
  Lock,
  Sparkles,
} from "lucide-react";

import { Slider } from "./Slider";
import Button from "./Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Ripple } from "./ui/Ripple";


export default function Hero() {
  const router = useRouter()
  const emotions = [
    { value: 0, label: "😔 Heavy", glow: "var(--glow-warm)" },
    { value: 25, label: "😟 Anxious", glow: "var(--glow-core)" },
    { value: 50, label: "😐 Steady", glow: "var(--glow-calm)" },
    { value: 75, label: "🙂 Calm", glow: "var(--glow-calm)" },
    { value: 100, label: "✨ Hopeful", glow: "var(--glow-core)" },
  ];

  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => setMounted(true), []);

  const currentEmotion =
    emotions.find((e) => Math.abs(emotion - e.value) < 15) || emotions[2];

  const welcomeSteps = [
    {
      title: "Hi, I’m Calmry 👋",
      description:
        "This is a quiet space. You don’t need the right words here.",
      icon: Waves,
    },
    {
      title: "Emotion-Aware Support",
      description:
        "I adapt to how you feel — gently, thoughtfully, without pressure.",
      icon: Brain,
    },
    {
      title: "Privacy, by Design",
      description:
        "Your thoughts stay yours. Nothing is remembered unless you allow it.",
      icon: Shield,
    },
  ];

  return (
    <section id="hero" className="relative min-h-[calc(100vh-80px)] pt-28 flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background),var(--background-deep))]" />

        <motion.div
          key={emotion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute w-160 h-160 rounded-full blur-[120px] top-1/2 left-1/2"
          style={{
            background: currentEmotion.glow,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-105 h-105rounded-full border border-border/30 animate-spin-slow" />
          <div className="absolute w-75 h-75 rounded-full border border-border/20 animate-spin-reverse" />
        </div>
        <Ripple className="absolute inset-0 opacity-60" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 18 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-190 text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs border border-border bg-surface backdrop-blur">
          <Waves className="w-4 h-4 text-(--accent-calm)" />
          <span className="text-foreground/85">
            Calmry · AI Therapist
          </span>
        </div>
        <div>
          <h1 className="font-accent text-[clamp(2.3rem,4.4vw,3.3rem)] leading-tight text-foreground -mb-2">
            Find a calmer place
          </h1>
          <h2 className="font-accent text-[clamp(1.8rem,3.4vw,2.5rem)] text-foreground/80">
            inside your own mind.
          </h2>
        </div>
        <p className="max-w-140 mx-auto text-sm md:text-base text-muted leading-relaxed">
          Calmry is an AI therapist that listens deeply, senses emotional
          shifts, and responds with care — not scripts.
        </p>
        <div className="glass px-8 py-6 space-y-4 mt-6">
          <div className="space-y-1">
            <p className="text-sm text-muted">
              Where does your mind feel right now?
            </p>
            <p className="text-xs text-muted/70">
              There’s no right answer — just notice.
            </p>
          </div>

          <div className="flex justify-between px-3">
            {emotions.map((em) => (
              <div
                key={em.value}
                onClick={() => setEmotion(em.value)}
                className={`cursor-pointer transition-all duration-300 ${
                  Math.abs(emotion - em.value) < 15
                    ? "opacity-100 scale-105"
                    : "opacity-40"
                }`}
              >
                <div className="text-lg">{em.label.split(" ")[0]}</div>
                <div className="text-[11px] mt-1 text-muted">
                  {em.label.split(" ")[1]}
                </div>
              </div>
            ))}
          </div>

          <Slider
            value={[emotion]}
            min={0}
            max={100}
            step={1}
            onValueChange={(v) => setEmotion(v[0])}
          />

          <p className="text-xs text-muted">
            Calmry is gently attuning to{" "}
            <span className="text-foreground font-medium">
              {currentEmotion.label.split(" ")[1].toLowerCase()}
            </span>
          </p>
        </div>
        <div className="mt-8">
          <Button
            className="flex items-center justify-center "
            onClick={() => setShowDialog(true)}
          >
            Begin your journey
            <ArrowRight className="w-4 h-4 font-bold mt-1" />
          </Button>

          <div className="flex justify-center items-center gap-2 text-[11px] text-muted pt-6">
            <Lock className="w-3 h-3" />
            Private · Thoughtful · Secure
          </div>
        </div>
      </motion.div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center">
                {(() => {
                  const Icon = welcomeSteps[currentStep].icon;
                  return <Icon className="w-6 h-6 text-accent" />;
                })()}
              </div>

              <DialogTitle className="font-accent text-xl">
                {welcomeSteps[currentStep].title}
              </DialogTitle>

              <DialogDescription>
                {welcomeSteps[currentStep].description}
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <div className="flex justify-between items-center mt-5">
            <div className="flex gap-2">
              {welcomeSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentStep
                      ? "w-4 bg-accent"
                      : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={() => {
                if (currentStep < welcomeSteps.length - 1) {
                  setCurrentStep((s) => s + 1);
                } else {
                  setShowDialog(false);
                  router.push("/signup")
                  setCurrentStep(0);
                }
              }}
            >
              {currentStep === welcomeSteps.length - 1 ? (
                <>
                  Let’s begin
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
