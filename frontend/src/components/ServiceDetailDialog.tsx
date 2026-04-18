import { X, CheckCircle, ArrowRight } from "lucide-react";

type ServiceItem = {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
};

type Props = {
  service: ServiceItem | null;
  open: boolean;
  onClose: () => void;
};

export default function ServiceDetailDialog({ service, open, onClose }: Props) {
  if (!open || !service) return null;

  const Icon = service.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        {/* Header gradient strip */}
        <div className="relative h-32 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent">
          <div className="absolute -bottom-8 left-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 shadow-lg ring-4 ring-card backdrop-blur-sm">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-12">
          <h2 className="text-2xl font-bold">{service.title}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {service.description}
          </p>

          {/* Features */}
          {service.features.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                What We Offer
              </h3>
              <ul className="space-y-2.5">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex gap-3">
            <button
              className="btn-primary flex flex-1 items-center justify-center gap-2"
              onClick={() => {
                onClose();
                setTimeout(() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }}
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-border bg-background/50 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
