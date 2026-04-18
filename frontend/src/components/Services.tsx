import { Building, Hammer, Cog, Shield, Zap, Users } from "lucide-react";

const servicesImage =
  "https://images.unsplash.com/photo-1523413363574-c30aa8d4b4a0?auto=format&fit=crop&w=1800&q=80";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import ServiceDetailDialog from "./ServiceDetailDialog";

type ServiceItem = {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
};

const Services = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const fallbackServices: ServiceItem[] = [
    {
      icon: Building,
      title: "Commercial Construction",
      description: "Office buildings, retail spaces, and commercial complexes built to the highest standards.",
      features: ["High-rise construction", "Retail development", "Office complexes", "Mixed-use buildings"]
    },
    {
      icon: Hammer,
      title: "Residential Projects",
      description: "Custom homes and residential developments that combine quality with Filipino aesthetics.",
      features: ["Custom homes", "Subdivisions", "Condominiums", "Townhouse projects"]
    },
    {
      icon: Cog,
      title: "Industrial Construction",
      description: "Specialized facilities for manufacturing, logistics, and industrial operations.",
      features: ["Warehouses", "Manufacturing plants", "Logistics centers", "Industrial parks"]
    },
    {
      icon: Shield,
      title: "Infrastructure Development",
      description: "Roads, bridges, and public infrastructure that connects communities.",
      features: ["Road construction", "Bridge engineering", "Drainage systems", "Public facilities"]
    },
    {
      icon: Zap,
      title: "Renovation & Modernization",
      description: "Transforming existing structures with modern design and sustainable technologies.",
      features: ["Building upgrades", "Seismic retrofitting", "Energy efficiency", "Modern amenities"]
    },
    {
      icon: Users,
      title: "Project Management",
      description: "End-to-end project coordination ensuring timely delivery and quality results.",
      features: ["Timeline management", "Quality control", "Budget optimization", "Stakeholder coordination"]
    }
  ];

  const { data: apiData } = useQuery({
    queryKey: ["services"],
    queryFn: () => apiFetch<{ ok: true; items: any[] }>("/api/services"),
  });

  const services = useMemo(() => {
    const items = apiData?.items ?? [];
    if (!items.length) return fallbackServices;
    return items.map((s) => ({
      icon: Building,
      title: s.title,
      description: s.description || "",
      features: Array.isArray(s.features) ? s.features : [],
    }));
  }, [apiData]);

  return (
    <section id="services" className="section-padding bg-secondary/10">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-semibold text-lg">Our Services</span>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Construction Solutions for <span className="gradient-text">Every Need</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From residential homes to large-scale infrastructure, we deliver comprehensive 
            construction services with Filipino pride and international standards.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="card-construction group hover:scale-105 transition-all duration-300"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
              </div>

              <div className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-primary font-semibold hover:text-primary-glow transition-colors group/btn"
                >
                  Learn More 
                  <span className="ml-2 group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div 
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{
            backgroundImage: `linear-gradient(rgba(4, 9, 29, 0.9), rgba(4, 9, 29, 0.7)), url(${servicesImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold">Ready to Start Your Project?</h3>
            <p className="text-xl text-muted-foreground">
              Let's discuss how we can bring your construction vision to life with 
              our expertise and commitment to excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="btn-primary"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Dialog */}
      <ServiceDetailDialog
        service={selectedService}
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};

export default Services;