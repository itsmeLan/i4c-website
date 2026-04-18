import { useEffect, useMemo, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const fallbackTestimonials = [
    {
      id: 1,
      name: "Maria Santos",
      position: "CEO, Santos Real Estate Group",
      company: "Santos Real Estate",
      rating: 5,
      content: "i4C Construction exceeded our expectations in every aspect. Their attention to detail, project management, and quality of work is outstanding. They delivered our 25-story residential tower on time and within budget.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612c9af?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      project: "Quezon City Residential Tower"
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      position: "Project Director",
      company: "Philippine Infrastructure Corp",
      rating: 5,
      content: "Working with i4C on our infrastructure projects has been a game-changer. Their expertise in large-scale construction and commitment to safety standards make them our go-to construction partner.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      project: "Metro Manila Bridge Project"
    },
    {
      id: 3,
      name: "Angela Reyes",
      position: "Operations Manager",
      company: "Reyes Manufacturing Inc.",
      rating: 5,
      content: "The industrial facility that i4C built for us is world-class. They understood our specific requirements and delivered a sustainable, efficient manufacturing plant that has boosted our productivity significantly.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      project: "Laguna Manufacturing Plant"
    },
    {
      id: 4,
      name: "Roberto Cruz",
      position: "Development Head",
      company: "Cruz Holdings",
      rating: 5,
      content: "i4C's innovative approach to commercial construction helped us create a landmark building in BGC. Their team's professionalism and technical expertise are unmatched in the industry.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      project: "BGC Corporate Headquarters"
    },
    {
      id: 5,
      name: "Dr. Patricia Lim",
      position: "Hospital Administrator",
      company: "Lim Medical Center",
      rating: 5,
      content: "The medical facility constructed by i4C meets international healthcare standards. Their attention to specialized requirements and compliance with health regulations was impressive.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      project: "Modern Medical Complex"
    }
  ];

  const { data: apiData } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => apiFetch<{ ok: true; items: any[] }>("/api/testimonials"),
  });

  const testimonials = useMemo(() => {
    const items = apiData?.items ?? [];
    if (!items.length) return fallbackTestimonials;
    return items.map((t) => ({
      id: t._id,
      name: t.name,
      position: t.position || "",
      company: t.company || "",
      rating: t.rating || 5,
      content: t.content,
      image: t.imageUrl || "https://images.unsplash.com/photo-1494790108755-2616b612c9af?auto=format&fit=crop&w=150&q=80",
      project: t.project || "",
    }));
  }, [apiData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-secondary/10 to-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-semibold text-lg">Client Testimonials</span>
          <h2 className="text-4xl lg:text-5xl font-bold">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what industry leaders and satisfied 
            clients have to say about our construction excellence.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 mx-4">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                      {/* Quote Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <Quote className="h-8 w-8 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center lg:text-left">
                        {/* Stars */}
                        <div className="flex justify-center lg:justify-start mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-primary fill-current" />
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <blockquote className="text-lg lg:text-xl text-foreground mb-6 leading-relaxed">
                          "{testimonial.content}"
                        </blockquote>

                        {/* Project */}
                        <div className="text-sm text-primary font-medium mb-6">
                          Project: {testimonial.project}
                        </div>

                        {/* Client Info */}
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                          />
                          <div>
                            <div className="font-semibold text-foreground">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                            <div className="text-sm text-primary">{testimonial.company}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-primary w-8' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">98%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">30+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">10+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">20+</div>
            <div className="text-muted-foreground">Expert Team</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;