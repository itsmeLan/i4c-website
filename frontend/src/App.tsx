import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { RequireAdmin } from "./pages/admin/RequireAdmin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import { apiFetch } from "./lib/api";

const queryClient = new QueryClient();

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", { page_path: path });
    }
    apiFetch("/api/analytics/event", {
      method: "POST",
      body: JSON.stringify({ 
        event: "page_view", 
        path,
        meta: {
          referrer: document.referrer || "direct",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown"
        }
      }),
    }).catch(() => {});

    const milestones = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.round((window.scrollY / scrollable) * 100);
      const steps = [25, 50, 75, 100];
      for (const step of steps) {
        if (pct >= step && !milestones.has(step)) {
          milestones.add(step);
          apiFetch("/api/analytics/event", {
            method: "POST",
            body: JSON.stringify({ event: "scroll_depth", path, meta: { percent: step } }),
          }).catch(() => {});
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname, location.search]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
