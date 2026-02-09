"use client";

import { motion, Variants } from "framer-motion";
import {
  Waves,
  Moon,
  Feather,
  Shield,
} from "lucide-react";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

/* ------------------ ANIMATION SYSTEM ------------------ */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.25,
      ease: easeOrganic,
    },
  },
};

const floatIdle = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 9,
      ease: easeOrganic,
      repeat: Infinity,
    },
  },
};

/* ------------------ COMPONENT ------------------ */

export default function StorySection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Ambient emotional background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_12%,rgba(47,63,168,0.16),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_380px_at_82%_78%,rgba(22,106,94,0.14),transparent_72%)]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-140px" }}
        className="mx-auto max-w-6xl"
      >
        {/* Section intro */}
        <motion.div
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center mb-28"
        >
          <span className="inline-block mb-4 text-xs tracking-[0.28em] uppercase text-muted">
            The story
          </span>

          <h2 className="font-accent text-[clamp(2.4rem,4.6vw,3.1rem)] leading-tight text-foreground">
            Designed for quiet moments,<br /> not constant engagement
          </h2>

          <p className="mt-6 text-base text-muted leading-relaxed">
            Calmry didn’t begin with features or growth charts.  
            It began with a simple realization — the world is loud,  
            and the mind deserves a softer place to land.
          </p>
        </motion.div>

        {/* STORY STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[220px] gap-6">
          {/* The Noise */}
          <motion.div
            variants={fadeUp}
            {...floatIdle}
            className="md:col-span-2 md:row-span-2 group"
          >
            <div className="relative h-full rounded-3xl border border-border bg-surface backdrop-blur p-10 transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(520px_260px_at_18%_0%,rgba(122,75,34,0.22),transparent_70%)] opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 space-y-6 max-w-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-soft">
                  <Waves className="h-6 w-6 text-[var(--accent-warm)]" />
                </div>

                <h3 className="text-2xl font-semibold text-foreground">
                  Everything is noisy
                </h3>

                <p className="text-sm leading-relaxed text-muted">
                  Endless notifications. Performative wellness.  
                  Apps that demand attention instead of offering relief.  
                  Calmry exists because most digital spaces forgot how to be quiet.
                </p>
              </div>
            </div>
          </motion.div>

          {/* The Pause */}
          <motion.div variants={fadeUp} className="group">
            <div className="relative h-full rounded-3xl border border-border bg-surface-soft p-8 transition-all duration-500 group-hover:bg-surface group-hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                <Moon className="h-5 w-5 text-[var(--accent-core)]" />
              </div>

              <h4 className="mt-2 text-lg font-semibold text-foreground">
                We chose to slow down
              </h4>

              <p className="mt-2 text-sm text-muted leading-relaxed">
                Calmry introduces pauses, not pressure —  
                moments where nothing demands a response.
              </p>
            </div>
          </motion.div>

          {/* The Design */}
          <motion.div variants={fadeUp} className="group">
            <div className="relative h-full rounded-3xl border border-border bg-surface-soft p-8 transition-all duration-500 group-hover:bg-surface group-hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                <Feather className="h-5 w-5 text-[var(--accent-calm)]" />
              </div>

              <h4 className="mt-2 text-lg font-semibold text-foreground">
                Gentle by design
              </h4>

              <p className="mt-2 text-sm text-muted leading-relaxed">
                Motion breathes. Colors soothe.  
                Every interaction respects emotional weight.
              </p>
            </div>
          </motion.div>

          {/* Trust */}
          <motion.div variants={fadeUp} className="md:col-span-2 group">
            <div className="relative h-full rounded-3xl border border-border bg-surface backdrop-blur p-9 transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(420px_200px_at_80%_0%,rgba(47,63,168,0.26),transparent_70%)] opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 space-y-4 max-w-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-soft">
                  <Shield className="h-5 w-5 text-[var(--accent-core)]" />
                </div>

                <h4 className="text-lg font-semibold text-foreground">
                  A space you can trust
                </h4>

                <p className="text-sm text-muted leading-relaxed">
                  Calmry protects emotional boundaries.  
                  No urgency. No judgment. No manipulation.  
                  Just presence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
