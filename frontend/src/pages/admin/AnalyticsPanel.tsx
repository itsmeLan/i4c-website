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
import { Calendar as CalendarIcon, Download, SlidersHorizontal, ArrowUpRight, CheckCircle2, Circle } from "lucide-react";

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
  latestInquiries?: Inquiry[];
  areaData?: { name: string; views: number }[];
  sourceData?: { name: string; value: number; color: string }[];
  countryData?: { name: string; value: number }[];
  activityHeatmap?: { time: string; data: { day: string; value: number }[] }[];
};

// ── Mock Data Generators for Charts (Demo Mode) ── //
const generateAreaChartData = (daysCount: number) => {
  const data = [];
  const start = new Date();
  start.setDate(start.getDate() - daysCount);
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    data.push({
      name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: Math.floor(Math.random() * 500) + 100 + (Math.sin(i / 3) * 150),
    });
  }
  return data;
};

const sourceData = [
  { name: "Direct Search", value: 400, color: "#3b82f6" }, 
  { name: "Social Media", value: 300, color: "#f59e0b" }, 
  { name: "Search Engine", value: 200, color: "#10b981" }, 
  { name: "Referral", value: 100, color: "#6366f1" }, 
];

const countryData = [
  { name: "Philippines", value: 1200 },
  { name: "United States", value: 450 },
  { name: "Singapore", value: 320 },
  { name: "Canada", value: 210 },
  { name: "Australia", value: 150 },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["9am", "12pm", "3pm", "6pm"];
const activityHeatmap = times.map((t) => ({
  time: t,
  data: weekDays.map((d) => ({
    day: d,
    value: Math.floor(Math.random() * 4), 
  })),
}));

export default function AnalyticsPanel() {
  const { toast } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const demoAreaData = generateAreaChartData(days);

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

  const handleDownload = () => {
    if (!data?.latestInquiries?.length) {
      toast({ title: "No data to download" });
      return;
    }
    const headers = ["Name", "Email", "Status", "Date"];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\\n" +
      data.latestInquiries
        .map((inq) => `${inq.name},${inq.email},${inq.status},${new Date(inq.createdAt).toLocaleDateString()}`)
        .join("\\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_report_${days}days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Report downloaded!" });
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
          <button 
            onClick={() => toast({ title: "Sorting applied" })}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Sort By
          </button>
          
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
              <AreaChart data={demoAreaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  data={sourceData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceData.map((entry, index) => (
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
             {sourceData.map(s => (
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
            <span className="text-xs text-muted-foreground cursor-pointer hover:underline">Last 30 days v</span>
          </div>
          <div className="space-y-5">
            {countryData.map((c, i) => {
              const max = Math.max(...countryData.map(d => d.value));
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
            <span className="text-xs text-muted-foreground cursor-pointer hover:underline">Last 7 days v</span>
          </div>
          <div className="flex h-full flex-col justify-between max-h-[220px]">
            {activityHeatmap.map((row) => (
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
                {weekDays.map(d => <span key={d} className="text-[10px] text-muted-foreground w-full text-center">{d.charAt(0)}</span>)}
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
             <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary">•••</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {!data.latestInquiries?.length ? (
              <p className="text-sm text-muted-foreground mt-10 text-center">No recent inquiries.</p>
            ) : (
              data.latestInquiries.map((inq) => (
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
          <button 
            onClick={handleDownload}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/5"
          >
            <Download className="h-3 w-3" />
            DOWNLOAD REPORT
          </button>
        </div>
      </div>
    </div>
  );
}
