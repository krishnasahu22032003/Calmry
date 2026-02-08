"use client";

import { motion, Variants } from "framer-motion";
import {
  Brain,
  Shield,
  Waves,
  Lock,
  Sparkles,
} from "lucide-react";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

/* ------------------ ANIMATION SYSTEM ------------------ */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: easeOrganic,
    },
  },
};

const cardFloat = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 7,
      ease: easeOrganic,
      repeat: Infinity,
    },
  },
};

/* ------------------ FEATURE DATA ------------------ */

const primaryFeatures = [
  {
    title: "Emotion-Aware Intelligence",
    description:
      "Calmry doesn’t just respond — it senses emotional shifts and adapts tone, pacing, and depth in real time.",
    icon: Brain,
    glow: "rgba(47,63,168,0.35)",
  },
  {
    title: "A Space That Listens",
    description:
      "No scripts. No judgment. Conversations flow naturally, shaped by how you feel — not predefined paths.",
    icon: Waves,
    glow: "rgba(22,106,94,0.35)",
  },
  {
    title: "Designed for Calm",
    description:
      "Every interaction is crafted to reduce cognitive load, slow the mind, and create emotional safety.",
    icon: Sparkles,
    glow: "rgba(47,63,168,0.28)",
  },
];

const secondaryFeatures = [
  {
    title: "Privacy First, Always",
    description:
      "Your thoughts are never stored or analyzed without consent. Calmry remembers nothing unless you allow it.",
    icon: Shield,
  },
  {
    title: "Secure by Design",
    description:
      "Built with modern security principles so your most personal moments stay protected.",
    icon: Lock,
  },
];

/* ------------------ COMPONENT ------------------ */

export default function FeaturesSection() {
  return (
    <section className="relative py-32 px-6">
      {/* Ambient background wash */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_0%,rgba(47,63,168,0.12),transparent_70%)]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        className="mx-auto max-w-6xl"
      >
        {/* Header */}
        <motion.div
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center mb-20"
        >
          <h2 className="font-accent text-[clamp(2.1rem,4vw,2.8rem)] text-foreground leading-tight">
            Built to feel human.
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed">
            Calmry blends emotional intelligence, privacy, and thoughtful design
            to create a space where your mind can finally slow down.
          </p>
        </motion.div>

        {/* Primary features */}
        <div className="grid gap-8 md:grid-cols-3">
          {primaryFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                {...cardFloat}
                className="group relative"
              >
                <div
                  className="
                    relative h-full rounded-3xl border border-border
                    bg-surface backdrop-blur
                    p-8
                    transition-all duration-700
                    hover:-translate-y-1
                    hover:shadow-[0_30px_120px_rgba(0,0,0,0.6)]
                  "
                  style={{
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 0 120px ${feature.glow}`,
                  }}
                >
                  {/* Glow hover */}
                  <div
                    className="
                      pointer-events-none absolute inset-0 rounded-3xl
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-700
                    "
                    style={{
                      background: `radial-gradient(420px_180px_at_20%_0%, ${feature.glow}, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10 space-y-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-soft">
                      <Icon className="h-6 w-6 text-[var(--accent-core)]" />
                    </div>

                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary features */}
        <motion.div
          variants={fadeUp}
          className="mt-18 grid gap-6 md:grid-cols-2"
        >
          {secondaryFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="
                  relative rounded-2xl border border-border
                  bg-surface-soft
                  p-6
                  transition-all duration-500
                  hover:bg-surface
                "
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                    <Icon className="h-5 w-5 text-[var(--accent-calm)]" />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {feature.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
