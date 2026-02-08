"use client";

import { motion, Variants } from "framer-motion";
import {
  Brain,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Compass,
  UserCheck,
} from "lucide-react";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

/* ------------------ ANIMATION SYSTEM ------------------ */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.15,
      ease: easeOrganic,
    },
  },
};

const cardIdle = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 8,
      ease: easeOrganic,
      repeat: Infinity,
    },
  },
};

/* ------------------ COMPONENT ------------------ */

export default function AboutSection() {
  return (
    <section className="relative py-32 px-6">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(700px_360px_at_50%_0%,rgba(22,106,94,0.12),transparent_70%)]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        className="mx-auto max-w-6xl"
      >
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center mb-24"
        >
          <h2 className="font-accent text-[clamp(2.2rem,4vw,2.9rem)] text-foreground leading-tight">
            About Calmry
          </h2>
          <p className="mt-5 text-base text-muted leading-relaxed">
            Calmry was created to offer a quieter, safer way to reflect — where
            technology supports the mind instead of overwhelming it.
          </p>
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[220px] gap-6">
          {/* Core philosophy */}
          <motion.div
            variants={fadeUp}
            {...cardIdle}
            className="md:col-span-2 md:row-span-2 group"
          >
            <div className="relative h-full rounded-3xl border border-border bg-surface backdrop-blur p-10 transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(520px_260px_at_20%_0%,rgba(47,63,168,0.28),transparent_70%)] opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 space-y-6 max-w-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-soft">
                  <Brain className="h-6 w-6 text-[var(--accent-core)]" />
                </div>

                <h3 className="text-2xl font-semibold text-foreground leading-snug">
                  Built for the human mind
                </h3>

                <p className="text-sm leading-relaxed text-muted">
                  Calmry is not designed to diagnose, fix, or rush you. It’s a
                  reflective space that listens carefully, adapts gently, and
                  responds with emotional awareness rather than automation.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div variants={fadeUp} className="md:col-span-2 group">
            <div className="relative h-full rounded-3xl border border-border bg-surface-soft p-8 transition-all duration-500 group-hover:bg-surface group-hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                <Compass className="h-5 w-5 text-[var(--accent-calm)]" />
              </div>

              <h4 className="mt-2 text-lg font-semibold text-foreground">
                Our mission
              </h4>

              <p className="mt-2 text-sm text-muted leading-relaxed max-w-sm">
                To make emotional support accessible, private, and deeply human
                — without pressure, judgment, or performance.
              </p>
            </div>
          </motion.div>

          {/* NEW — Human-in-the-loop (bottom-left fill) */}
          <motion.div variants={fadeUp} className="group">
            <div className="relative h-full rounded-3xl border border-border bg-surface-soft p-8 transition-all duration-500 group-hover:bg-surface group-hover:-translate-y-1 group-hover:shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                <UserCheck className="h-5 w-5 text-[var(--accent-core)]" />
              </div>

              <h4 className="mt-2 text-lg font-semibold text-foreground">
                Human-centered by design
              </h4>

              <p className="mt-2 text-sm text-muted leading-relaxed">
                Calmry supports reflection — it never replaces human care or
                oversteps emotional boundaries.
              </p>
            </div>
          </motion.div>

          {/* Empathy */}
          <motion.div variants={fadeUp} className="group">
            <div className="relative h-full rounded-3xl border border-border bg-surface-soft p-8 transition-all duration-500 group-hover:bg-surface group-hover:-translate-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                <HeartHandshake className="h-5 w-5 text-[var(--accent-calm)]" />
              </div>

              <h4 className="mt-2 text-lg font-semibold text-foreground">
                Empathy over efficiency
              </h4>

              <p className="mt-2 text-sm text-muted leading-relaxed">
                Conversations slow down when needed. Silence is respected.
                Emotional nuance always comes first.
              </p>
            </div>
          </motion.div>


          {/* Closing thought */}
          <motion.div variants={fadeUp} className="md:col-span-2 group">
            <div className="relative h-full rounded-3xl border border-border bg-surface backdrop-blur p-8 transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(420px_180px_at_80%_0%,rgba(22,106,94,0.25),transparent_70%)] opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 space-y-4 max-w-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-soft">
                  <Sparkles className="h-5 w-5 text-[var(--accent-calm)]" />
                </div>

                <h4 className="text-lg font-semibold text-foreground">
                  A quieter future
                </h4>

                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Calmry represents a future where technology feels supportive,
                  gentle, and human — not loud, addictive, or invasive.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
        
    </section>
  );
}
