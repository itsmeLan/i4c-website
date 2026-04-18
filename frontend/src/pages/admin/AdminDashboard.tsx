import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, setAdminToken } from "@/lib/api";

import DashboardOverview from "./DashboardOverview";
import InquiriesPanel from "./InquiriesPanel";
import ProjectsPanel from "./ProjectsPanel";
import ServicesPanel from "./ServicesPanel";
import TestimonialsPanel from "./TestimonialsPanel";
import UploadsPanel from "./UploadsPanel";
import SettingsPanel from "./SettingsPanel";
import AnalyticsPanel from "./AnalyticsPanel";

/* ── Types ──────────────────────────────────────────────── */
type Inquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
};

type Project = {
  _id: string;
  title: string;
  category: string;
  location?: string;
  year?: string;
  client?: string;
  description?: string;
  status?: "Completed" | "In Progress";
  coverImageUrl?: string;
  images?: { url: string; publicId: string }[];
};

type Service = {
  _id: string;
  title: string;
  description?: string;
  features?: string[];
  icon?: string;
  order?: number;
};

type Testimonial = {
  _id: string;
  name: string;
  position?: string;
  company?: string;
  rating?: number;
  content: string;
  project?: string;
  imageUrl?: string;
  order?: number;
  isPublished?: boolean;
};

type TabKey =
  | "overview"
  | "analytics"
  | "inquiries"
  | "projects"
  | "services"
  | "testimonials"
  | "uploads"
  | "settings";

const NAV_ITEMS: { key: TabKey; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "analytics", label: "Analytics", icon: "📈" },
  { key: "inquiries", label: "Inquiries", icon: "📩" },
  { key: "projects", label: "Projects", icon: "🏗️" },
  { key: "services", label: "Services", icon: "⚙️" },
  { key: "testimonials", label: "Testimonials", icon: "⭐" },
  { key: "uploads", label: "Media", icon: "📷" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

/* ── Main Dashboard ─────────────────────────────────────── */
export default function AdminDashboard() {
  const { toast } = useToast();
  const [tab, setTab] = useState<TabKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  /* ── Data Fetching ── */
  async function loadAll() {
    const [inq, proj, srv, tst] = await Promise.all([
      apiFetch<{ ok: true; items: Inquiry[] }>("/api/inquiries", {
        auth: true,
      }),
      apiFetch<{ ok: true; items: Project[] }>("/api/projects"),
      apiFetch<{ ok: true; items: Service[] }>("/api/services"),
      apiFetch<{ ok: true; items: Testimonial[] }>("/api/testimonials"),
    ]);
    setInquiries(inq.items);
    setProjects(proj.items);
    setServices(srv.items);
    setTestimonials(tst.items);
  }

  useEffect(() => {
    setLoading(true);
    loadAll()
      .catch((err) => {
        toast({
          title: "Failed to load admin data",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── CRUD helpers ── */
  async function createProject(p: Omit<Project, "_id">) {
    const res = await apiFetch<{ ok: true; item: Project }>("/api/projects", {
      method: "POST",
      auth: true,
      body: JSON.stringify(p),
    });
    setProjects((prev) => [res.item, ...prev]);
  }

  async function deleteProject(id: string) {
    await apiFetch<{ ok: true }>(`/api/projects/${id}`, {
      method: "DELETE",
      auth: true,
    });
    setProjects((prev) => prev.filter((p) => p._id !== id));
  }

  async function updateProject(id: string, p: Omit<Project, "_id">) {
    const res = await apiFetch<{ ok: true; item: Project }>(
      `/api/projects/${id}`,
      { method: "PUT", auth: true, body: JSON.stringify(p) },
    );
    setProjects((prev) =>
      prev.map((item) => (item._id === id ? res.item : item)),
    );
  }

  async function createService(s: Omit<Service, "_id">) {
    const res = await apiFetch<{ ok: true; item: Service }>("/api/services", {
      method: "POST",
      auth: true,
      body: JSON.stringify(s),
    });
    setServices((prev) =>
      [...prev, res.item].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    );
  }

  async function deleteService(id: string) {
    await apiFetch<{ ok: true }>(`/api/services/${id}`, {
      method: "DELETE",
      auth: true,
    });
    setServices((prev) => prev.filter((s) => s._id !== id));
  }

  async function updateService(id: string, s: Omit<Service, "_id">) {
    const res = await apiFetch<{ ok: true; item: Service }>(
      `/api/services/${id}`,
      { method: "PUT", auth: true, body: JSON.stringify(s) },
    );
    setServices((prev) =>
      prev.map((item) => (item._id === id ? res.item : item)),
    );
  }

  async function createTestimonial(t: Omit<Testimonial, "_id">) {
    const res = await apiFetch<{ ok: true; item: Testimonial }>(
      "/api/testimonials",
      { method: "POST", auth: true, body: JSON.stringify(t) },
    );
    setTestimonials((prev) =>
      [...prev, res.item].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    );
  }

  async function deleteTestimonial(id: string) {
    await apiFetch<{ ok: true }>(`/api/testimonials/${id}`, {
      method: "DELETE",
      auth: true,
    });
    setTestimonials((prev) => prev.filter((t) => t._id !== id));
  }

  async function updateTestimonial(
    id: string,
    t: Omit<Testimonial, "_id">,
  ) {
    const res = await apiFetch<{ ok: true; item: Testimonial }>(
      `/api/testimonials/${id}`,
      { method: "PUT", auth: true, body: JSON.stringify(t) },
    );
    setTestimonials((prev) =>
      prev.map((item) => (item._id === id ? res.item : item)),
    );
  }

  /* ── Logout ── */
  function logout() {
    setAdminToken("");
    window.location.href = "/admin/login";
  }

  /* ── Navigate ── */
  function navigateTo(key: string) {
    setTab(key as TabKey);
    setSidebarOpen(false);
  }

  /* ── Loading Skeleton ── */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`admin-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-border/40 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-lg font-bold text-primary">
            i4
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">i4C Construction</p>
            <p className="text-[11px] text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => navigateTo(item.key)}
              className={`admin-sidebar-item w-full ${
                tab === item.key ? "active" : ""
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
              {item.key === "inquiries" && inquiries.length > 0 && (
                <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                  {inquiries.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="border-t border-border/40 px-4 py-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Admin</p>
              <p className="truncate text-xs text-muted-foreground">
                Dashboard
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={async () => {
                try {
                  await loadAll();
                  toast({ title: "Dashboard refreshed ✨", duration: 2000 });
                } catch (err) {
                  toast({
                    title: "Refresh failed",
                    description: String(err),
                    variant: "destructive",
                  });
                }
              }}
            >
              ↻ Refresh
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1 text-xs"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-x-hidden">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
          >
            ☰
          </button>
          <p className="text-sm font-semibold">
            {NAV_ITEMS.find((n) => n.key === tab)?.label || "Dashboard"}
          </p>
        </header>

        {/* Content area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {tab === "overview" && (
            <DashboardOverview
              inquiries={inquiries}
              projects={projects}
              services={services}
              testimonials={testimonials}
              onNavigate={navigateTo}
            />
          )}
          {tab === "inquiries" && (
            <InquiriesPanel
              inquiries={inquiries}
              onUpdateStatus={async (id, status) => {
                const res = await apiFetch<{ ok: true; item: Inquiry }>(
                  `/api/inquiries/${id}`,
                  { method: "PUT", auth: true, body: JSON.stringify({ status }) }
                );
                setInquiries((prev) => prev.map((inq) => (inq._id === id ? res.item : inq)));
              }}
            />
          )}
          {tab === "projects" && (
            <ProjectsPanel
              projects={projects}
              onCreate={createProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
            />
          )}
          {tab === "services" && (
            <ServicesPanel
              services={services}
              onCreate={createService}
              onUpdate={updateService}
              onDelete={deleteService}
            />
          )}
          {tab === "testimonials" && (
            <TestimonialsPanel
              testimonials={testimonials}
              onCreate={createTestimonial}
              onUpdate={updateTestimonial}
              onDelete={deleteTestimonial}
            />
          )}
          {tab === "uploads" && <UploadsPanel />}
          {tab === "settings" && <SettingsPanel />}
          {tab === "analytics" && <AnalyticsPanel />}
        </div>
      </main>
    </div>
  );
}
