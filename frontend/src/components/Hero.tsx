import { ArrowRight, Play, Award, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroImage =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=80";

const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { icon: Building2, value: "30+", label: "Projects Completed" },
    { icon: Award, value: "10+", label: "Years Experience" },
    { icon: Users, value: "20+", label: "Expert Team" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Main background image with subtle floating effect */}
        <div className="absolute inset-0 animate-float" style={{ animationDuration: '20s' }}>
          <img 
            src="/hero-sketch.png" 
            alt="Architectural sketching" 
            className="w-full h-full object-cover opacity-60 scale-110"
          />
        </div>
        
        {/* Animated Sketching Lines Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          {/* Structural grid lines */}
          <path d="M100,200 L900,200 M100,500 L900,500 M100,800 L900,800" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" className="animate-draw-line" />
          <path d="M200,100 L200,900 M500,100 L500,900 M800,100 L800,900" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" className="animate-draw-line" style={{ animationDelay: '1s' }} />
          
          {/* Abstract building shapes */}
          <path d="M300,700 L300,300 L700,300 L700,700 L300,700" stroke="hsl(var(--primary-glow))" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: '2s' }} />
          <path d="M300,300 L500,150 L700,300" stroke="hsl(var(--primary-glow))" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: '3s' }} />
          
          {/* Circular highlights */}
          <circle cx="500" cy="500" r="150" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" className="animate-draw-line" style={{ animationDelay: '4s' }} />
        </svg>

        {/* Moving Neon Light Spots */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-[150px] rounded-full animate-neon-move pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-primary-glow/20 blur-[100px] rounded-full animate-neon-move pointer-events-none" style={{ animationDelay: '-7s' }}></div>

        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
      </div>

      <div className="container-custom section-padding relative z-10 landscape:py-12 lg:landscape:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">Certified Excellence in Construction</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight landscape:text-3xl md:landscape:text-5xl lg:landscape:text-7xl">
                Building
                <span className="block gradient-text text-glow">Tomorrow's</span>
                Philippines
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed landscape:text-lg md:landscape:text-xl">
                Reliable construction solutions designed for growth, durability, and the future.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="btn-primary group"
                onClick={() => scrollToSection("#projects")}
              >
                View Our Projects
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                className="btn-secondary group"
                onClick={() => scrollToSection("#about")}
              >
                <Play className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>

            {/* Stats - Hidden on small landscape mobile viewports, shown on desktop landscape */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border landscape:hidden lg:landscape:grid sm:grid">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-2">
                    <stat.icon className="h-6 w-6 text-primary mr-2" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Elements */}
          <div className="relative hidden lg:block">
            <div className="absolute top-20 right-20 w-20 h-20 rounded-full bg-primary/20 animate-float"></div>
            <div className="absolute bottom-40 right-40 w-12 h-12 rounded-full bg-primary/30 animate-float" style={{ animationDelay: "2s" }}></div>
            <div className="absolute top-40 right-60 w-16 h-16 rounded-full bg-primary/10 animate-float" style={{ animationDelay: "4s" }}></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;