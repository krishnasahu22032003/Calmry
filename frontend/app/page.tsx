"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Landingpage/Header";
import Hero from "@/components/Landingpage/HeroSection";
import FeaturesSection from "@/components/Landingpage/Features";
import AboutSection from "@/components/Landingpage/About";
import StorySection from "@/components/Landingpage/Stories";
import TestimonialsSection from "@/components/Landingpage/Testimonials";
import FAQSection from "@/components/Landingpage/FAQ";
import CTASection from "@/components/Landingpage/CTASection";
import Footer from "@/components/Landingpage/Footer";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

export default function Home() {
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter()

  const handleContinueWithEmail = () => {
    setShowDialog(false);
    router.push("/signup")
  }
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <FeaturesSection />
      <AboutSection />
      <StorySection />
      <TestimonialsSection />
      <FAQSection />

      <CTASection setShowDialog={setShowDialog} />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Welcome to Calmry
            </DialogTitle>

            <DialogDescription>
              A quiet space to reflect, breathe, and reconnect — at your own
              pace.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <Button onClick={handleContinueWithEmail} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white transition hover:opacity-90">
              Continue with Email
            </Button>

            <p className="text-xs text-muted text-center">
              You’re always in control. Nothing is shared without consent.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
