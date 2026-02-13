"use client";

import { motion, Variants } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { updateUserDetails } from "@/lib/update/updateuserdetails";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

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

export default function ProfilePage() {
  const router = useRouter();

  const [newusername, setNewUsername] = useState("");
  const [newemail, setNewEmail] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [currentpassword, setCurrentPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const rules = [
    { label: "One capital letter", valid: /[A-Z]/.test(newpassword) },
    { label: "One number", valid: /\d/.test(newpassword) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(newpassword) },
  ];

  const validPassword =
    newpassword.length >= 8 && rules.every((r) => r.valid);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentpassword) {
      toast.error("Current password is required");
      return;
    }

    if (newpassword && !validPassword) {
      toast.error("Password does not meet requirements");
      return;
    }

    setLoading(true);

    try {
      const res = await updateUserDetails({
        currentpassword,
        newemail,
        newusername,
        newpassword,
      });

      toast.success(res.message || "Updated successfully");

      setTimeout(() => {
        router.replace("/dashboard");
      }, 1200);

    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex justify-center px-6 py-7">
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="glass breathe w-full max-w-105 px-7 py-8"
      >
        <motion.div variants={fadeUp} className="text-center mb-7">
          <h1 className="font-accent text-[clamp(1.75rem,3.5vw,2.1rem)]">
            Profile & Settings
          </h1>
          <p className="mt-2 text-xs text-muted">
            Refine your private space
          </p>
        </motion.div>

        <motion.form
          variants={container}
          className="space-y-5"
          onSubmit={handleUpdate}
        >

          <motion.div variants={fadeUp} className="space-y-1.5">
            <label className="text-[11px] tracking-wide text-muted">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                value={newusername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="New username"
                className="w-full h-11 rounded-xl bg-surface-soft border border-border pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1.5">
            <label className="text-[11px] tracking-wide text-muted">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="email"
                value={newemail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="you@calmry.app"
                className="w-full h-11 rounded-xl bg-surface-soft border border-border pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1.5">
            <label className="text-[11px] tracking-wide text-muted">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="password"
                value={currentpassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Confirm current password"
                className="w-full h-11 rounded-xl bg-surface-soft border border-border pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1.5">
            <label className="text-[11px] tracking-wide text-muted">
              New Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={newpassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 rounded-xl bg-surface-soft border border-border pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {newpassword && (
              <div className="mt-2 space-y-1 flex gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-[11px]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      newpassword.length >= 8 ? "bg-accent" : "bg-border"
                    }`}
                  />
                  <span
                    className={
                      newpassword.length >= 8
                        ? "text-foreground"
                        : "text-muted"
                    }
                  >
                    Min 8 characters
                  </span>
                </div>

                {rules.map((rule) => (
                  <div
                    key={rule.label}
                    className="flex items-center gap-2 text-[11px] "
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        rule.valid ? "bg-accent" : "bg-border"
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
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="pt-3 ">
          <Button
  type="submit"
  className="w-full disabled:opacity-60 disabled:cursor-not-allowed font-bold" 
  disabled={loading || (newpassword.length > 0 && !validPassword)}
 >
  {loading ? "Updating…" : "Save changes"}
  {!loading && <ArrowRight className="h-4 w-4" />}
</Button>
          </motion.div>
        </motion.form>
      </motion.section>
    </main>
  );
}