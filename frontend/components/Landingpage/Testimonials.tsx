"use client";

import { motion, Variants } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
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

const idleFloat = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 8,
      ease: easeOrganic,
      repeat: Infinity,
    },
  },
};

const testimonials = [
  {
    quote:
      "Calmry doesn’t rush me to feel better. It lets me sit with my thoughts — and somehow that makes them lighter.",
    name: "Aarav Mehta",
    role: "Product Designer",
    accent: "var(--accent-core)",
    image: "/testimonials-1.jpg",
  },
  {
    quote:
      "Most apps overwhelm me. Calmry feels like a quiet room I can return to when my head gets noisy.",
    name: "Neha Kapoor",
    role: "Graduate Student",
    accent: "var(--accent-calm)",
    image: "/testimonials-5.jpg",
  },
  {
    quote:
      "It feels less like software and more like a presence. Nothing feels forced. Nothing feels judged.",
    name: "Rohan Iyer",
    role: "Founder",
    accent: "var(--accent-warm)",
    image: "/testimonials-3.jpg",
  },
  {
    quote:
      "I don’t feel like I’m being analyzed or optimized here. Calmry gives me space — and that alone helps me breathe better.",
    name: "Ishita Verma",
    role: "UX Researcher",
    accent: "var(--accent-calm)",
    image: "/testimonials-4.jpg",
  },
  {
    quote:
      "There’s no pressure to perform or improve. I open Calmry when I need stillness, not answers.",
    name: "Kabir Singh",
    role: "Software Engineer",
    accent: "var(--accent-core)",
    image: "/testimonials-2.jpg",
  },
  {
    quote:
      "It feels respectful. Like the app knows when to step back instead of pushing forward.",
    name: "Ananya Rao",
    role: "Clinical Psychology Student",
    accent: "var(--accent-warm)",
    image: "/testimonials-6.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
        
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_18%,rgba(47,63,168,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_360px_at_12%_82%,rgba(22,106,94,0.16),transparent_72%)]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-140px" }}
        className="mx-auto max-w-6xl"
      >

        <motion.div
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center mb-28"
        >
          <span className="inline-block mb-4 text-xs tracking-[0.3em] uppercase text-muted">
            Reflections
          </span>

          <h2 className="font-accent text-[clamp(2.3rem,4.5vw,3rem)] leading-tight text-foreground">
            Quiet words from<br /> people who found calm
          </h2>

          <p className="mt-6 text-base text-muted leading-relaxed">
            Calmry isn’t about fixing people.  
            It’s about being present — and letting clarity arrive on its own.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              {...idleFloat}
              className="group"
            >
              <div className="relative h-full rounded-3xl border border-border bg-surface backdrop-blur p-8 transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
                {/* Glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(420px 200px at 20% 0%, ${t.accent}33, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 flex flex-col h-full">
        
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-soft">
                    <Quote className="h-5 w-5" style={{ color: t.accent }} />
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 grow">
                    “{t.quote}”
                  </p>
                  <div className="my-6 h-px w-full bg-border" />
                  <div className="flex items-center gap-4">
                    <div className="relative h-11 w-11 rounded-full overflow-hidden">
                 
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          boxShadow: `0 0 0 1px ${t.accent}55, 0 0 24px ${t.accent}33`,
                        }}
                      />
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="44px"
                        className="object-cover rounded-full grayscale-20 contrast-[0.95]"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
