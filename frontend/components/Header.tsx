"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
const navItems = [
  { href: "#features", label: "Features" },
  { href: "#stories", label: "Stories" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
const scrollToTop = (e: React.MouseEvent) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  if (window.location.hash || window.location.pathname !== "/") {
    router.push("/", { scroll: false });
  }
  setOpen(false);
};
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const signinPage = ()=>{
router.push("/signin")
  }
  const signupPage = ()=>{
router.push("/signup")
  }
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl ">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
  onClick={scrollToTop}
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
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-accent opacity-80 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Button
                onClick={signinPage}
                variant="secondary"
                className="border border-border/90 bg-surface-soft text-foreground hover:bg-surface"
              >
                Sign in
              </Button>

              <Button 
                variant="secondary"
                className="border border-border/90 bg-surface-soft text-foreground hover:bg-surface"
              onClick={signupPage}>
                Sign up
              </Button>
            </div>
          </div>

          <button
            className="md:hidden text-muted hover:text-foreground transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24}  className="m-2"/>}
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
              onClick={signinPage}
                variant="secondary"
                className="border border-border/90 bg-surface-soft text-foreground"
              >
                Sign in
              </Button>
              <Button 
              variant="secondary"
                className="border border-border/90 bg-surface-soft text-foreground"
                onClick={signupPage}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
        
      )}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px">
  <div
    className="
      mx-auto
      h-px
      w-full
      max-w-6xl
      `bg-linear-to-r
      from-transparent
      via-accent
      to-transparent
      opacity-60
    "
  />
  </div>
    </header>
  );
}
