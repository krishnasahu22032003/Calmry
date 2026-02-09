"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signupUser } from "@/lib/auth/signup";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.9, ease: easeOrganic },
    },
};

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const rules = [
        { label: "One capital letter", valid: /[A-Z]/.test(password) },
        { label: "One number", valid: /\d/.test(password) },
        { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
    ];

    const validPassword = rules.every((r) => r.valid);
    const match = password && confirm && password === confirm;

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validPassword || !match) return;

        setLoading(true);

        try {
            await signupUser({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            toast.success("Account created successfully");
            router.push("/signin");
        } catch (err: any) {
            toast.error(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center px-6 pt-2 pb-2">
            <motion.section
                variants={container}
                initial="hidden"
                animate="show"
                className="glass breathe w-full max-w-105 px-7 py-8"
            >
                <motion.div variants={fadeUp} className="text-center mb-7">
                    <h1 className="font-accent text-[clamp(1.75rem,3.5vw,2.1rem)]">
                        Begin your journey
                    </h1>
                    <p className="mt-2 text-xs text-muted">
                        Create a calm space that’s truly yours
                    </p>
                </motion.div>

                <motion.form variants={container} className="space-y-5" onSubmit={handleSignup}>
                    <motion.div variants={fadeUp} className="space-y-1.5">
                        <label className="text-[11px] tracking-wide text-muted">Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your name"
                                className="w-full h-11 rounded-xl bg-surface-soft border border-border pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="space-y-1.5">
                        <label className="text-[11px] tracking-wide text-muted">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@calmry.app"
                                className="w-full h-11 rounded-xl bg-surface-soft border border-border pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="space-y-1.5">
                        <label className="text-[11px] tracking-wide text-muted">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full h-11 rounded-xl bg-surface-soft border border-border pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-accent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="mt-2 space-y-1 flex gap-6">
                            {rules.map((rule) => (
                                <div key={rule.label} className="flex items-center gap-2 text-[11px]">
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full transition-colors ${rule.valid ? "bg-accent" : "bg-border"
                                            }`}
                                    />
                                    <span
                                        className={
                                            rule.valid ? "text-foreground" : "text-muted"
                                        }
                                    >
                                        {rule.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} className="space-y-1.5">
                        <label className="text-[11px] tracking-wide text-muted">
                            Confirm password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full h-11 rounded-xl bg-surface-soft border border-border pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-accent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {confirm && (
                            <p className={`text-[11px] ${match ? "text-accent" : "text-muted"}`}>
                                {match ? "Passwords match" : "Passwords must match"}
                            </p>
                        )}
                    </motion.div>

                    <motion.div variants={fadeUp} className="pt-3">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !validPassword || !match}
                        >
                            {loading ? "Creating account…" : "Create account"}
                            {!loading && <ArrowRight className="h-4 w-4" />}
                        </Button>
                    </motion.div>
                </motion.form>

                <motion.p variants={fadeUp} className="mt-8 text-center text-xs text-muted">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-foreground hover:underline">
                        Sign in
                    </Link>
                </motion.p>
            </motion.section>
        </main>
    );
}
