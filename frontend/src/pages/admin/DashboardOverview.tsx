import { useEffect, useRef } from "react";

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

type Project = { _id: string; title: string };
type Service = { _id: string; title: string };
type Testimonial = { _id: string; name: string };

/* ── Animated Counter ─────────────────────────────────── */
function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let start = 0;
    const end = value;
    if (end === 0) {
      ref.current.textContent = "0";
      return;
    }
    const duration = 800;
    const stepTime = Math.max(Math.floor(duration / end), 16);
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      if (ref.current) ref.current.textContent = start.toLocaleString();
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span ref={ref}>0</span>;
}

/* ── Stat Card ────────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon,
  accent,
  subtitle,
}: {
  label: string;
  value: number;
  icon: string;
  accent?: string;
  subtitle?: string;
}) {
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            <AnimatedCount value={value} />
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className="stat-icon"
          style={
            accent
              ? {
                  background: `${accent}22`,
                  color: accent,
                }
              : undefined
          }
        >
          {icon}
        </div>
      </div>
      {/* Decorative gradient blobs */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ background: accent || "hsl(var(--primary))" }}
      />
    </div>
  );
}

/* ── Main Overview ────────────────────────────────────── */
export default function DashboardOverview({
  inquiries,
  projects,
  services,
  testimonials,
  onNavigate,
}: {
  inquiries: Inquiry[];
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  onNavigate: (tab: string) => void;
}) {
  const recentInquiries = inquiries.slice(0, 5);
  const thisWeek = inquiries.filter((inq) => {
    const d = new Date(inq.createdAt);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  });

  return (
    <div className="admin-panel-enter space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back<span className="text-primary">.</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's what's happening with your construction business today.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Inquiries"
          value={inquiries.length}
          icon="📩"
          accent="#2dd4bf"
          subtitle={thisWeek.length > 0 ? `${thisWeek.length} this week` : undefined}
        />
        <StatCard
          label="Projects"
          value={projects.length}
          icon="🏗️"
          accent="#60a5fa"
        />
        <StatCard
          label="Services"
          value={services.length}
          icon="⚙️"
          accent="#a78bfa"
        />
        <StatCard
          label="Testimonials"
          value={testimonials.length}
          icon="⭐"
          accent="#fbbf24"
        />
      </div>

      {/* ── Recent Inquiries ── */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Recent Inquiries</h2>
            <p className="text-sm text-muted-foreground">Latest leads from your website</p>
          </div>
          <button
            onClick={() => onNavigate("inquiries")}
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="divide-y divide-border">
          {recentInquiries.length === 0 && (
            <div className="px-6 py-10 text-center text-muted-foreground">
              No inquiries yet. They'll appear here once prospects reach out.
            </div>
          )}
          {recentInquiries.map((inq) => (
            <div
              key={inq._id}
              className="admin-table-row flex items-center gap-4 px-6 py-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {inq.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{inq.name}</p>
                <p className="truncate text-sm text-muted-foreground">{inq.email}</p>
              </div>
              <div className="hidden text-right sm:block">
                <span className={`status-badge ${inq.status === "new" ? "new" : inq.status === "replied" ? "replied" : "read"}`}>
                  {inq.status || "new"}
                </span>
              </div>
              <div className="hidden text-sm text-muted-foreground md:block">
                {new Date(inq.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Add Project", tab: "projects", icon: "🏗️" },
          { label: "Add Service", tab: "services", icon: "⚙️" },
          { label: "Add Testimonial", tab: "testimonials", icon: "⭐" },
          { label: "Upload Media", tab: "uploads", icon: "📷" },
        ].map((action) => (
          <button
            key={action.tab}
            onClick={() => onNavigate(action.tab)}
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card/30 px-4 py-5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5"
          >
            <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
              {action.icon}
            </span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
