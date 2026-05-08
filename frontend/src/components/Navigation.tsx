import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiFetch<{ok: true, data: any}>("/api/settings").then(res => res.data),
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Estimator", href: "#estimator" },
    { name: "Projects", href: "#projects" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
    }`}>
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "h-14" : "h-16 md:h-20"
        }`}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="text-xl lg:text-2xl font-bold leading-none">
              <span className="gradient-text">i4C</span> Construction
              <span className="text-primary">.</span>
            </a>
          </div>

          {/* Desktop Navigation - Only show on large screens */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-sm xl:text-base"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href={`tel:${(settings?.phone || "+639123456789").replace(/\s+/g, '')}`}
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Phone className="h-4 w-4" />
              <span>{settings?.phone || "+63 912 345 6789"}</span>
            </a>
            <Button 
              className="btn-primary"
              onClick={() => scrollToSection("#contact")}
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile menu button - Show on everything below lg */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Only show below lg */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-300"
                >
                  {item.name}
                </button>
              ))}
              <div className="px-3 py-2 border-t border-border mt-4">
                <a 
                  href={`tel:${(settings?.phone || "+639123456789").replace(/\s+/g, '')}`}
                  className="flex items-center space-x-2 text-sm text-muted-foreground mb-3 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>{settings?.phone || "+63 912 345 6789"}</span>
                </a>
                <Button 
                  className="btn-primary w-full"
                  onClick={() => scrollToSection("#contact")}
                >
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;