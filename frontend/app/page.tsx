import Header from "@/components/Header";
import Hero from "@/components/HeroSection";
import FeaturesSection from "@/components/Features";
import AboutSection from "@/components/About";
import StorySection from "@/components/Stories";
import TestimonialsSection from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <FeaturesSection/>
      <AboutSection/>
      <StorySection/>
      <TestimonialsSection/>
      </main>
  );
}
