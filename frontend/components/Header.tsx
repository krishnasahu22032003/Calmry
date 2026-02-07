"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";

const navItems = [
  { href: "/use-cases", label: "Use cases" },
  { href: "/testimonials", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl ">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Logo />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold tracking-wide text-foreground">
                Calmry
              </span>
              <span className="mt-0.5 text-[14px] tracking-tight text-muted">
                A private space for the mind
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-[15px] font-medium text-muted hover:text-foreground transition-colors group"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[color:var(--accent-core)] opacity-80 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-5">
              <Button
                variant="secondary"
                className="border border-border/90 bg-surface-soft text-foreground hover:bg-surface"
              >
                Sign in
              </Button>

              <Button>
                Sign up
              </Button>
            </div>
          </div>

          <button
            className="md:hidden text-muted hover:text-foreground transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="mx-auto max-w-6xl px-6 pb-8 pt-6 glass space-y-6">
            <nav className="flex flex-col gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-muted hover:text-foreground transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-2 pt-4">
              <Button
                variant="secondary"
                className="border border-border/90 bg-surface-soft text-foreground"
              >
                Sign in
              </Button>
              <Button>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
