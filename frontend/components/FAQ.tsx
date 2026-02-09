"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown, Shield, Brain, Gamepad2, BarChart3, Lock } from "lucide-react";
import { useState } from "react";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

/* ------------------ DATA ------------------ */

const faqs = [
  {
    icon: Brain,
    question: "How does Calmry’s AI chat work?",
    answer:
      "Calmry’s AI chat is designed for reflection, not diagnosis. It listens gently, adapts to emotional tone, and responds without pressure. There are no performance metrics, no forced conclusions — just space to think and feel safely.",
  },
  {
    icon: Shield,
    question: "Is Calmry a replacement for therapy?",
    answer:
      "No. Calmry is not therapy and never tries to replace human care. It exists as a private, supportive space for reflection — especially between moments of real-world support.",
  },
  {
    icon: BarChart3,
    question: "How does progress tracking work?",
    answer:
      "Progress in Calmry isn’t about streaks or productivity. It’s about awareness. You’ll see gentle patterns over time — mood trends, reflection frequency, and emotional themes — without judgment or pressure.",
  },
  {
    icon: Gamepad2,
    question: "What are the games inside Calmry?",
    answer:
      "Calmry includes quiet, grounding experiences — not competitive games. These are designed to slow breathing, improve focus, and gently shift mental state without stimulation overload.",
  },
  {
    icon: Lock,
    question: "Is my data private and secure?",
    answer:
      "Yes. Privacy is foundational to Calmry. Conversations are protected, never shared, and never used to manipulate behavior. Calmry is designed to feel safe — emotionally and technically.",
  },
  {
    icon: Brain,
    question: "Does Calmry adapt over time?",
    answer:
      "Yes, but gently. Calmry learns patterns to respond more thoughtfully — never aggressively. Adaptation is subtle, respectful, and always in service of emotional well-being.",
  },
];

/* ------------------ ANIMATION VARIANTS ------------------ */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: easeOrganic,
    },
  },
};

/* ------------------ COMPONENT ------------------ */

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-36 px-6 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(820px_380px_at_50%_12%,rgba(47,63,168,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_360px_at_88%_82%,rgba(22,106,94,0.16),transparent_72%)]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-140px" }}
        className="mx-auto max-w-4xl"
      >
        {/* Header */}
        <motion.div
          variants={fadeUp}
          className="text-center mb-24 max-w-2xl mx-auto"
        >
          <span className="inline-block mb-4 text-xs tracking-[0.3em] uppercase text-muted">
            Questions
          </span>

          <h2 className="font-accent text-[clamp(2.3rem,4.5vw,3rem)] leading-tight text-foreground">
            Answers, without pressure
          </h2>

          <p className="mt-6 text-base text-muted leading-relaxed">
            Calmry is built with intention.  
            Here’s what people usually want to know — answered gently.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                variants={fadeUp}
                className="group"
              >
                <div
                  className={`relative rounded-2xl border border-border bg-surface backdrop-blur transition-all duration-700 ${
                    isOpen
                      ? "shadow-[0_40px_140px_rgba(0,0,0,0.65)]"
                      : "hover:bg-surface-soft"
                  }`}
                >
                  {/* Question */}
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-4 p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-soft">
                        <Icon className="h-5 w-5 text-[var(--accent-core)]" />
                      </div>

                      <h3 className="font-accent text-base sm:text-lg text-foreground">
                        {faq.question}
                      </h3>
                    </div>

                    <ChevronDown
                      className={`h-5 w-5 text-muted transition-transform duration-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.55,
                          ease: easeOrganic,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-sm text-muted leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
