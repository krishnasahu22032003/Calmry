"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border">
      {/* Subtle ambient tone */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_50%_0%,rgba(47,63,168,0.12),transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: easeOrganic }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6 py-12"
      >
        <div className="flex items-center justify-center text-center">
          <p className="text-xs text-muted flex flex-wrap items-center gap-2 leading-relaxed">
            <span className="font-accent text-foreground">Calmry</span>

            <span className="opacity-50">·</span>

            <span className="flex items-center gap-1">
              Made with
              <Heart className="w-3.5 h-3.5 text-[var(--accent-warm)] fill-[var(--accent-warm)]" />
              by Krishna
            </span>

            <span className="opacity-50">·</span>

            <span>
              © {new Date().getFullYear()} All rights reserved
            </span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
