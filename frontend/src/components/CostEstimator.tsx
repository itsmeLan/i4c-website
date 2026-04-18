import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

const SERVICE_OPTIONS = [
  "Commercial Construction",
  "Residential Development",
  "Industrial Facility",
  "Infrastructure Project",
  "Renovation/Modernization",
  "Consultation Services",
] as const;

type EstimateInputs = {
  service: string;
  areaSqm: number;
  floors: number;
  materialQuality: "low" | "mid" | "high";
  location: "cebu" | "manila" | "remote";
  designComplexity: "simple" | "standard" | "complex";
};

type EstimateResponse = {
  ok: true;
  currency: "PHP";
  inputs: EstimateInputs;
  totalCost: number;
  breakdown: {
    materials: number;
    labor: number;
    permits: number;
    misc: number;
  };
  disclaimer: string;
};

function formatPhp(n: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);
}

export default function CostEstimator() {
  const { toast } = useToast();
  const [service, setService] = useState<(typeof SERVICE_OPTIONS)[number]>("Residential Development");
  const [areaSqm, setAreaSqm] = useState<number>(120);
  const [floors, setFloors] = useState<number>(1);
  const [materialQuality, setMaterialQuality] = useState<EstimateInputs["materialQuality"]>("mid");
  const [location, setLocation] = useState<EstimateInputs["location"]>("cebu");
  const [designComplexity, setDesignComplexity] = useState<EstimateInputs["designComplexity"]>("standard");
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const areaOk = useMemo(
    () => Number.isFinite(areaSqm) && areaSqm >= 10 && areaSqm <= 1_000_000,
    [areaSqm],
  );

  async function estimate() {
    if (!areaOk) return;
    setLoading(true);
    try {
      const res = await apiFetch<EstimateResponse>("/api/estimator/estimate", {
        method: "POST",
        body: JSON.stringify({
          service,
          areaSqm,
          floors,
          materialQuality,
          location,
          designComplexity,
        }),
      });
      setResult(res);
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "cost_estimate", { service, area_sqm: areaSqm });
      }
      apiFetch("/api/analytics/event", {
        method: "POST",
        body: JSON.stringify({ event: "cost_estimate", path: window.location.pathname, meta: { service, areaSqm } }),
      }).catch(() => {});
    } catch (err) {
      toast({
        title: "Estimator unavailable",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="estimator" className="section-padding bg-secondary/10">
      <div className="container-custom">
        <div className="text-center mb-12 space-y-4">
          <span className="text-primary font-semibold text-lg">Cost Estimator</span>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Get a <span className="gradient-text">Quick Estimate</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose project parameters and approximate floor area for a multi-factor budget estimate. Final pricing
            depends on design, site conditions, materials, and timeline.
          </p>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-sm max-w-4xl mx-auto">
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">Service type</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value as any)}
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Area (sqm)</label>
                <Input
                  type="number"
                  min={10}
                  max={1_000_000}
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Floors</label>
                <Input
                  type="number"
                  min={1}
                  value={floors}
                  onChange={(e) => setFloors(Math.max(1, Math.floor(Number(e.target.value)) || 1))}
                  className="bg-background/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Material quality</label>
                <select
                  value={materialQuality}
                  onChange={(e) => setMaterialQuality(e.target.value as EstimateInputs["materialQuality"])}
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="mid">Mid</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as EstimateInputs["location"])}
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="cebu">Cebu</option>
                  <option value="manila">Manila</option>
                  <option value="remote">Remote / other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Design complexity</label>
                <select
                  value={designComplexity}
                  onChange={(e) => setDesignComplexity(e.target.value as EstimateInputs["designComplexity"])}
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="simple">Simple</option>
                  <option value="standard">Standard</option>
                  <option value="complex">Complex</option>
                </select>
              </div>
            </div>

            <Button className="btn-primary w-full md:w-auto" onClick={estimate} disabled={!areaOk || loading}>
              {loading ? "Estimating..." : "Estimate Cost"}
            </Button>

            {result && (
              <div className="rounded-2xl border border-border bg-background/30 p-6 space-y-4">
                <div className="text-sm text-muted-foreground">
                  Area: {result.inputs.areaSqm} sqm · Floors: {result.inputs.floors} · {result.inputs.materialQuality}{" "}
                  materials · {result.inputs.location} · {result.inputs.designComplexity} design
                </div>
                <div className="text-3xl font-bold gradient-text">{formatPhp(result.totalCost)}</div>
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Materials (55%): {formatPhp(result.breakdown.materials)}</div>
                  <div>Labor (25%): {formatPhp(result.breakdown.labor)}</div>
                  <div>Permits (10%): {formatPhp(result.breakdown.permits)}</div>
                  <div>Misc. (10%): {formatPhp(result.breakdown.misc)}</div>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t border-border/60">{result.disclaimer}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
