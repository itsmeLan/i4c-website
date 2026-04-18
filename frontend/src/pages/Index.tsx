import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import CostEstimator from "@/components/CostEstimator";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
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