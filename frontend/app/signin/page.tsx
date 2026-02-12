"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Button";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

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
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: easeOrganic },
  },
};

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("")
  const [email , setEmail]=useState("")

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="glass breathe w-full max-w-105 px-8 py-10"
      >
        <motion.div variants={fadeUp} className="text-center mb-9">
          <h1 className="font-accent text-[clamp(2rem,4vw,2.4rem)] text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            A quiet space awaits you
          </p>
        </motion.div>

        <motion.form variants={container} className="space-y-6">
          <motion.div variants={fadeUp} className="space-y-2">
            <label className="text-xs tracking-wide text-muted">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
               onChange={(e)=> setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@calmry.app"
                className="w-full h-12 rounded-xl bg-surface-soft border border-border pl-11 pr-4 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-accent transition"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2">
            <label className="text-xs tracking-wide text-muted">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
              onChange={(e)=> setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full h-12 rounded-xl bg-surface-soft border border-border pl-11 pr-11 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-accent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="pt-4">
            <Button className="w-full ">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.form>

        <motion.p
          variants={fadeUp}
          className="mt-10 text-center text-sm text-muted"
        >
          New to Calmry?{" "}
          <Link href="/signup" className="text-foreground hover:underline">
            Create an account
          </Link>
        </motion.p>
      </motion.section>
    </main>
  );
}
