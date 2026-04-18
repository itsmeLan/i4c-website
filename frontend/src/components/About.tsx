import { CheckCircle, Target, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const aboutImage = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Every project executed with meticulous attention to detail and engineering excellence."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Driven by our love for creating infrastructure that serves Filipino communities."
    },
    {
      icon: CheckCircle,
      title: "Quality",
      description: "Uncompromising standards in materials, craftsmanship, and project delivery."
    }
  ];

  const achievements = [
    "ISO 9001:2015 Certified",
    "PCAB License AAA Category",
    "Green Building Council Member",
    "Safety First Certified"
  ];

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-background to-secondary/20">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={aboutImage} 
                alt="i4C Construction Team" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-8 -right-8 bg-card p-6 rounded-2xl shadow-xl border border-border">
              <div className="text-3xl font-bold gradient-text">10+</div>
              <div className="text-sm text-muted-foreground">Years of Excellence</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-primary font-semibold text-lg">About i4C Construction</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                We are <span className="gradient-text">i4C</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Innovation for Construction (i4C) is more than a construction company – we're pioneers 
                of Filipino engineering excellence. Since our founding, we've been dedicated to building 
                infrastructure that not only meets today's needs but anticipates tomorrow's challenges.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                We aspire to build a future where Filipino innovation shapes the landscapes of tomorrow, 
                creating infrastructure that generations will admire. Our commitment extends beyond construction 
                to community building and sustainable development.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center sm:text-left group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Our Certifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default About;