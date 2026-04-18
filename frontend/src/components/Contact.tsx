import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import OfficeMap from "@/components/OfficeMap";

const Contact = () => {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiFetch<{ok: true, data: any}>("/api/settings").then(res => res.data),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    message: ""
  });
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      details: [
        settings?.addressLine1 || "Edison St. corner Pasteur St.,",
        settings?.addressLine2 || "Lahug, Cebu City,",
        settings?.addressLine3 || "Cebu 6000, Philippines"
      ],
      color: "text-blue-400"
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [settings?.phone || "+63 (2) 8123-4567"],
      color: "text-green-400"
    },
    {
      icon: Mail,
      title: "Email Address",
      details: [settings?.email || "info@i4cconstruction.ph"],
      color: "text-primary"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 3:00 PM"],
      color: "text-purple-400"
    }
  ];

  const projectTypes = [
    "Commercial Construction",
    "Residential Development",
    "Industrial Facility",
    "Infrastructure Project",
    "Renovation/Modernization",
    "Consultation Services"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiFetch<{ ok: true; inquiryId: string }>(`/api/inquiries`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.projectType,
          message: formData.message,
        }),
      });

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting i4C Construction. We'll get back to you within 24 hours.",
        duration: 5000,
      });

      // Optional conversion tracking (GA4)
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "quote_submitted", { method: "contact_form" });
      }
      apiFetch("/api/analytics/event", {
        method: "POST",
        body: JSON.stringify({ event: "quote_submitted", path: window.location.pathname }),
      }).catch(() => {});

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        message: "",
      });
    } catch (err) {
      toast({
        title: "Failed to send message",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-background to-secondary/10">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-semibold text-lg">Get In Touch</span>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Start Your <span className="gradient-text">Construction Project</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to build your vision? Contact our expert team for a free consultation 
            and discover how we can bring your construction dreams to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0`}>
                        <info.icon className={`h-6 w-6 ${info.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground text-sm">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Why Choose Us */}
            <Card className="border-border bg-primary/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-primary">Why Choose i4C?</h3>
                <div className="space-y-3">
                  {[
                    "15+ years of construction excellence",
                    "Licensed and certified professionals",
                    "On-time project delivery guarantee",
                    "Comprehensive warranty coverage",
                    "Sustainable construction practices"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+63 912 345 6789"
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company/Organization
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Project Details
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your project requirements, timeline, budget range, and any specific needs..."
                      rows={6}
                      className="bg-background/50 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="btn-secondary"
                      onClick={() => window.open("tel:+639123456789")}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our privacy policy and terms of service. 
                    We'll respond to your inquiry within 24 hours.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Visit Our Office</h3>
              <p className="text-muted-foreground">
                Visit us at our Cebu office — Lahug, near the business and IT district.
              </p>
            </div>
            <div className="relative h-[min(50vh,480px)] min-h-[320px] w-full bg-muted [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:rounded-b-lg">
              <OfficeMap />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 border-t border-border bg-card/30 text-sm text-muted-foreground text-center sm:text-left">
              <span>
                {[
                  settings?.addressLine1 || "Edison St. corner Pasteur St.,",
                  settings?.addressLine2 || "Lahug, Cebu City,",
                  settings?.addressLine3 || "Cebu 6000, Philippines"
                ].join(" ")}
              </span>
              <a
                href={`https://www.openstreetmap.org/?mlat=${settings?.mapLatitude || 10.32895}&mlon=${settings?.mapLongitude || 123.90235}#map=18/${settings?.mapLatitude || 10.32895}/${settings?.mapLongitude || 123.90235}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Open full map
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;