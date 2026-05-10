import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar as CalendarIcon, Download, SlidersHorizontal, ArrowUpRight, CheckCircle2, Circle, FileText } from "lucide-react";

type Inquiry = {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
};

type AnalyticsData = {
  period: string;
  pageViews: number;
  inquiries: number;
  conversionRate: number;
  avgScrollDepth: number;
  latestInquiries?: Inquiry[];
  areaData?: { name: string; views: number }[];
  sourceData?: { name: string; value: number; color: string }[];
  countryData?: { name: string; value: number }[];
  activityHeatmap?: { time: string; data: { day: string; value: number }[] }[];
  topPages?: { path: string; count: number }[];
};

export default function AnalyticsPanel() {
  const { toast } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [sortKey, setSortKey] = useState("newest");

  useEffect(() => {
    setLoading(true);
    apiFetch<{ ok: true; stats: AnalyticsData }>(`/api/analytics/dashboard?days=${days}`, {
      auth: true,
    })
      .then((res) => {
        res.stats.period = `Last ${days} Days`;
        setData(res.stats);
      })
      .catch((err) =>
        toast({
          title: "Failed to load analytics",
          description: String(err),
          variant: "destructive",
        })
      )
      .finally(() => setLoading(false));
  }, [toast, days]);

  const sortedInquiries = data?.latestInquiries ? [...data.latestInquiries].sort((a, b) => {
    if (sortKey === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortKey === "name") return a.name.localeCompare(b.name);
    if (sortKey === "status") {
      if (a.status === b.status) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.status === "new" ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }) : [];

  const handleDownload = () => {
    if (!data) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // ── 1. Summary Section ──
    csvContent += "ANALYTICS SUMMARY\n";
    csvContent += `Period,${data.period}\n`;
    csvContent += `Total Page Views,${data.pageViews}\n`;
    csvContent += `Total Inquiries,${data.inquiries}\n`;
    csvContent += `Conversion Rate,${data.conversionRate}%\n`;
    csvContent += `Average Scroll Depth,${data.avgScrollDepth}%\n\n`;

    // ── 2. Top Pages Section ──
    if (data.topPages?.length) {
      csvContent += "TOP VISITED PAGES\n";
      csvContent += "Path,Views\n";
      data.topPages.forEach(p => {
        csvContent += `"${p.path}",${p.count}\n`;
      });
      csvContent += "\n";
    }

    // ── 3. Inquiry History Section ──
    if (sortedInquiries.length) {
      csvContent += "INQUIRY HISTORY\n";
      csvContent += "Name,Email,Status,Date\n";
      sortedInquiries.forEach((inq) => {
        csvContent += `"${inq.name}","${inq.email}","${inq.status}","${new Date(inq.createdAt).toLocaleDateString()}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `full_analytics_report_${days}days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Comprehensive report downloaded!" });
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-muted-foreground">No data available.</div>;

  return (
    <div className="admin-panel-enter space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Overview<span className="text-primary">.</span></h1>
          <p className="mt-1 text-sm text-muted-foreground text-opacity-80 uppercase tracking-widest font-medium">
            {data.period}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="appearance-none flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card pl-10 pr-8 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="status">Sort: Status</option>
            </select>
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-muted-foreground rotate-45" />
          </div>
          
          <div className="relative group">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="appearance-none flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card pl-10 pr-8 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-muted-foreground rotate-45" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Area Chart: Overall Traffic ── */}
        <div className="col-span-1 lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Overall Page Views</h2>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-3xl font-bold tracking-tight">{data.pageViews.toLocaleString()}</span>
                <span className="flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +12.5%
                </span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.areaData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--primary))", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Donut Chart: Traffic Sources ── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold tracking-wide">Source of Traffic</h2>
          <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.sourceData || []}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {(data.sourceData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-2xl font-bold">{data.pageViews}</span>
               <span className="text-xs text-green-500 font-medium">Total</span>
            </div>
          </div>
          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-y-3">
             {(data.sourceData || []).map(s => (
               <div key={s.name} className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                 <span className="text-xs font-medium text-muted-foreground">{s.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* ── Horizontal Bar: Regions ── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wide">Top Output Regions</h2>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-1 rounded-md font-medium">Last {days} Days</span>
          </div>
          <div className="space-y-5">
            {(data.countryData || []).map((c, i) => {
              const max = Math.max(...(data.countryData || []).map(d => d.value));
              const percent = (c.value / max) * 100;
              return (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="w-24 text-xs font-medium text-muted-foreground truncate">{c.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs font-bold text-foreground">{c.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Weekly Activity Heatmap ── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wide">Activity per week</h2>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-1 rounded-md font-medium">Last {days} Days</span>
          </div>
          <div className="flex h-full flex-col justify-between max-h-[220px]">
            {(data.activityHeatmap || []).map((row) => (
              <div key={row.time} className="flex items-center gap-2">
                <span className="w-8 text-[10px] text-muted-foreground">{row.time}</span>
                <div className="flex flex-1 justify-between gap-1">
                  {row.data.map((cell, i) => (
                    <div 
                      key={i} 
                      className={`h-6 w-full rounded-sm md:rounded-md transition-colors ${
                        cell.value === 0 ? "bg-muted" : 
                        cell.value === 1 ? "bg-blue-500/30" : 
                        cell.value === 2 ? "bg-blue-500/60" : "bg-blue-500"
                      }`}
                      title={`${cell.day} ${row.time}`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <span className="w-8" />
              <div className="flex flex-1 justify-between">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="text-[10px] text-muted-foreground w-full text-center">{d}</span>)}
              </div>
            </div>
            {/* Legend Line */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground border-t border-border pt-4">
              <span>Low</span>
              <div className="h-2 w-8 rounded-full bg-gradient-to-r from-muted to-blue-500" />
              <span>High</span>
            </div>
          </div>
        </div>

        {/* ── Recent Inquiries / History ── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-[320px] flex flex-col">
          <div className="mb-6 flex items-center justify-between">
             <h2 className="text-sm font-bold tracking-wide">Inquiry History</h2>
             <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-1 rounded-md font-medium">Last {days} Days</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {!sortedInquiries.length ? (
              <p className="text-sm text-muted-foreground mt-10 text-center">No recent inquiries.</p>
            ) : (
              sortedInquiries.map((inq) => (
                <div key={inq._id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold shadow-sm">
                      {inq.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[150px] group-hover:text-primary transition-colors">{inq.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{inq.email}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-foreground">
                       {new Date(inq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                    </span>
                    {inq.status === 'new' ? (
                      <Circle className="h-3 w-3 text-red-500 fill-red-500/20 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button 
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted"
            >
              <Download className="h-3 w-3" />
              DOWNLOAD CSV
            </button>
            <button 
              onClick={() => window.open(`/admin/report?days=${days}`, '_blank')}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2.5 text-xs font-black text-primary transition-all hover:bg-primary hover:text-white shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              GENERATE PROFESSIONAL REPORT
            </button>
          </div>
        </div>

        {/* ── Top Visited Pages ── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wide">Top Visited Pages</h2>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-1 rounded-md font-medium">Last {days} Days</span>
          </div>
          <div className="space-y-4">
            {(!data.topPages || data.topPages.length === 0) ? (
              <p className="text-sm text-muted-foreground py-10 text-center">No page view data recorded yet.</p>
            ) : (
              data.topPages.map((page, i) => {
                const max = Math.max(...data.topPages!.map(p => p.count));
                const percent = (page.count / max) * 100;
                return (
                  <div key={page.path} className="flex items-center gap-4 group">
                    <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-md group-hover:text-primary transition-colors">{page.path}</span>
                        <span className="text-xs font-bold">{page.count.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">views</span></span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Engagement Overview ── */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wide">Engagement Metrics</h2>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center space-y-6">
            <div className="relative">
              <svg className="h-32 w-32 rotate-[-90deg]">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * (data.avgScrollDepth || 0)) / 100}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{data.avgScrollDepth || 0}%</span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium">Scroll Depth</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                On average, visitors explore about <span className="font-bold text-foreground">{data.avgScrollDepth || 0}%</span> of your page content before leaving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
