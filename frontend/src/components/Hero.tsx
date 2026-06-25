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
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        {/* The beautiful branded hero image positioned in the background */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[55vw] z-0 opacity-40 lg:opacity-95 animate-fade-in select-none pointer-events-none">
          <img
            src="/hero-sketch.png"
            alt="i4C Construction - We Build Your Dream"
            className="w-full h-full object-cover lg:object-contain object-center lg:object-right"
          />
          {/* Subtle gradient edges to blend the image into the website's theme colors */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-[35%] bg-gradient-to-r from-background via-background/50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Subtle grid lines in background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] z-10" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <path d="M100,200 L900,200 M100,500 L900,500 M100,800 L900,800" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" />
          <path d="M200,100 L200,900 M500,100 L500,900 M800,100 L800,900" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" />
        </svg>

        {/* Moving Neon Light Spots */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/5 blur-[150px] rounded-full animate-neon-move pointer-events-none z-10"></div>
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-primary-glow/10 blur-[100px] rounded-full animate-neon-move pointer-events-none z-10" style={{ animationDelay: '-7s' }}></div>

        {/* Overall background overlay gradient for left content readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent z-10 pointer-events-none"></div>
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

          {/* Empty Right Column allowing the background image to show clearly without cropping */}
          <div className="hidden lg:block w-full h-full min-h-[500px] pointer-events-none"></div>
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
