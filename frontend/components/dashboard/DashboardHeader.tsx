"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Activity,
  Gamepad2,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { signout } from "@/lib/auth/signout";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/games", label: "Games", icon: Gamepad2 },
];

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await signout();
      toast.success("Signed Out Successfully");
      setProfileOpen(false);
      setOpen(false);
      router.replace("/signin");
    } catch (err: any) {
      toast.error(err.message || "Signout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl">
        <div className="flex h-18 items-center justify-between">

          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Logo />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold tracking-wide text-foreground">
                Calmry
              </span>
              <span className="mt-0.5 text-[14px] tracking-tight text-muted">
                Your private dashboard
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative flex items-center gap-2 text-[15px] font-medium text-muted hover:text-foreground transition-colors duration-300"
                  >
                    <Icon className="h-4 w-4 text-muted group-hover:text-accent transition-colors duration-300" />
                    {item.label}
                    <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-accent opacity-70 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                );
              })}
            </nav>

            <div className="relative flex items-center" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="group relative z-50"
              >
                <div className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-full bg-surface border border-border backdrop-blur transition-all duration-500 group-hover:shadow-[0_0_40px_var(--glow-core)] group-hover:-translate-y-0.5">
                  <User className="h-5 w-5 text-foreground" />
                </div>

                <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(47,63,168,0.28),transparent_70%)] opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-4 w-64 z-40">
                  <div className="glass p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Your Account
                      </p>
                      <p className="text-xs text-muted">
                        Manage your profile & settings
                      </p>
                    </div>

                    <div className="border-t border-border my-2" />

                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 text-sm text-muted hover:text-foreground transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-accent" />
                      Profile & Settings
                    </Link>

                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="flex w-full cursor-pointer items-center gap-3 text-sm text-muted hover:text-(--accent-warm) transition disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {loading ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-muted hover:text-foreground transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} className="mr-4"/> : <Menu size={24} className="m-2" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden">
          <div className="mx-auto max-w-6xl px-6 pb-8 pt-6 glass space-y-8">

            <nav className="flex flex-col gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 text-base font-medium text-muted hover:text-foreground transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-accent" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border pt-6 space-y-4">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 text-base text-muted hover:text-foreground transition"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-5 w-5 text-accent" />
                Profile & Settings
              </Link>

              <button
                onClick={handleSignOut}
                disabled={loading}
                className="flex items-center gap-3 text-base text-muted hover:text-(--accent-warm) transition disabled:opacity-50"
              >
                <LogOut className="h-5 w-5" />
                {loading ? "Signing out..." : "Sign out"}
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px">
        <div className="mx-auto h-px w-full max-w-6xl bg-linear-to-r from-transparent via-accent to-transparent opacity-60" />
      </div>
    </header>
  );
}