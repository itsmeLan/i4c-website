import { useEffect } from "react";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import CostEstimator from "@/components/CostEstimator";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const SOUND_URL = "/light-bulb-moment.mp3";

const Index = () => {
  useKeyboardNavigation();
  
  useEffect(() => {
    let played = false;

    const playSound = () => {
      if (played) return;
      played = true;
      const audio = new Audio(SOUND_URL);
      audio.volume = 1;
      audio.play().catch(() => {});
    };

    const INTERACTIONS = ["click", "keydown", "touchstart", "scroll"] as const;

    const onInteraction = () => {
      playSound();
      INTERACTIONS.forEach(evt =>
        document.removeEventListener(evt, onInteraction)
      );
    };

    // Try autoplay after 2 seconds
    const timer = setTimeout(() => {
      const audio = new Audio(SOUND_URL);
      audio.volume = 1;
      audio.play().then(() => {
        played = true;
        // If autoplay succeeded, remove interaction listeners
        INTERACTIONS.forEach(evt =>
          document.removeEventListener(evt, onInteraction)
        );
      }).catch(() => {
        // Autoplay blocked — wait for first user interaction
        INTERACTIONS.forEach(evt =>
          document.addEventListener(evt, onInteraction, { once: true, passive: true })
        );
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      INTERACTIONS.forEach(evt =>
        document.removeEventListener(evt, onInteraction)
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main>
        <Hero />
        <About />
        <Services />
        <CostEstimator />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;