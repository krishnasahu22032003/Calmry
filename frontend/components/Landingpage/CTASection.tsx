"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

export default function CTASection({
  setShowDialog,
}: {
  setShowDialog: (v: boolean) => void;
}) {
  return (
    <section className="relative py-32 px-6">

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(600px_240px_at_50%_100%,rgba(47,63,168,0.12),transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: easeOrganic }}
        viewport={{ once: true, margin: "-120px" }}
        className="mx-auto max-w-4xl"
      >

        <div
          className="
            group
            relative
            rounded-3xl
            border border-border
            bg-surface
            backdrop-blur
            px-10 py-14 sm:px-14 sm:py-6
            shadow-[0_40px_120px_rgba(0,0,0,0.65)]
            transition-all duration-700
            hover:-translate-y-1
            hover:shadow-[0_60px_160px_rgba(0,0,0,0.75)]
          "
        >
          <div
            className="
              pointer-events-none
              absolute inset-0 rounded-3xl
              opacity-60
              transition-opacity duration-700
              group-hover:opacity-100
              bg-[radial-gradient(520px_200px_at_50%_0%,rgba(47,63,168,0.28),transparent_70%)]
            "
          />

          <div
            className="
              pointer-events-none
              absolute inset-0 rounded-3xl
              opacity-0
              transition-opacity duration-700
              group-hover:opacity-70
              bg-[radial-gradient(420px_180px_at_80%_100%,rgba(22,106,94,0.22),transparent_70%)]
            "
          />

          <div className="relative z-10 flex flex-col items-center text-center">

            <span className="mb-3 text-xs tracking-[0.28em] uppercase text-muted">
              Begin gently
            </span>

            <h2 className="font-accent text-[clamp(1.8rem,3.6vw,2.4rem)] leading-snug text-foreground">
              A quiet space for your mind
            </h2>

            <p className="mt-4 max-w-xl text-sm text-muted leading-relaxed">
              Calmry offers a private place to reflect — with thoughtful AI
              conversations, grounding experiences, and gentle progress
              insights. Nothing rushed. Nothing forced.
            </p>

            <p className="mt-3 text-xs text-muted">
              No pressure. No judgment. You stay in control.
            </p>

            <div className="mt-10">
              <Button
                onClick={() => setShowDialog(true)}
                className="
                font-bold
                  group
                  flex items-center justify-center gap-2
                  rounded-full
                  px-7 py-5
                  text-sm 
                 bg-accent
                  text-white
                  transition-all duration-500
                 `hover:-translate-y-px
                  hover:shadow-[0_16px_48px_rgba(47,63,168,0.45)]
                "
              >
                Begin your journey
                <ArrowRight className="w-4 h-4 mt-px transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
