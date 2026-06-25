import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/api";
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
  BarChart,
  Bar,
} from "recharts";
import { Printer, ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";

type AnalyticsData = {
  period: string;
  pageViews: number;
  inquiries: number;
  conversionRate: number;
  avgScrollDepth: number;
  latestInquiries?: any[];
  areaData?: { name: string; views: number }[];
  sourceData?: { name: string; value: number; color: string }[];
  countryData?: { name: string; value: number }[];
  activityHeatmap?: any[];
  topPages?: { path: string; count: number }[];
};

export default function AnalyticsReport() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const days = parseInt(searchParams.get("days") || "30", 10);

  useEffect(() => {
    setLoading(true);
    apiFetch<{ ok: true; stats: AnalyticsData }>(`/api/analytics/dashboard?days=${days}`, {
      auth: true,
    })
      .then((res: { stats: AnalyticsData }) => {
        setData(res.stats);
      })
      .catch((err: Error | any) => console.error("Report Load Error:", err))
      .finally(() => setLoading(false));
  }, [days]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.querySelector(".report-document") as HTMLElement;
    if (!element) return;

    // @ts-ignore
    import("html2pdf.js").then((html2pdf) => {
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `i4c_analytics_report_${days}days_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4" as any, orientation: "portrait" as any },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as any }
      };
      html2pdf.default().set(opt).from(element).save();
    });
  };

  if (loading) return <div className="p-20 text-center font-medium">Preparing Professional Report...</div>;
  if (!data) return <div className="p-20 text-center text-red-500">Failed to load report data.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 print:bg-white print:p-0">
      {/* ── UI Controls (Hidden on Print) ── */}
      <div className="mx-auto mb-8 flex max-w-[210mm] items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
        <Button 
          onClick={() => navigate("/admin")} 
          className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-md transition-all active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex gap-3">
          <Button 
            onClick={handlePrint} 
            className="gap-2 bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" /> Print Document
          </Button>
          <Button 
            onClick={handleDownloadPDF} 
            className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-md transition-all active:scale-95"
          >
            <Download className="h-4 w-4" /> Save as PDF
          </Button>
        </div>
      </div>

      {/* ── Report Document ── */}
      <div className="report-document mx-auto max-w-[210mm] bg-white p-12 shadow-2xl print:p-0 print:shadow-none">
        {/* Header */}
        <header className="mb-12 flex items-start justify-between border-b-2 border-slate-900 pb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
              i4C <span className="text-primary font-light">Construction</span>
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Analytics Performance Report</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Generated On</p>
            <p className="text-base font-black text-slate-900">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            <p className="text-xs font-medium text-primary mt-1 uppercase tracking-wider">Period: Last {days} Days</p>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-slate-900">
            <div className="h-4 w-1 bg-primary" /> Executive Summary
          </h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Views</p>
              <p className="text-2xl font-black text-slate-900">{data.pageViews.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Inquiries</p>
              <p className="text-2xl font-black text-slate-900">{data.inquiries.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Conversion</p>
              <p className="text-2xl font-black text-primary">{data.conversionRate}%</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Scroll Depth</p>
              <p className="text-2xl font-black text-slate-900">{data.avgScrollDepth}%</p>
            </div>
          </div>
        </section>

        {/* Traffic Analysis */}
        <section className="mb-8 page-break-inside-avoid">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-slate-900">
            <div className="h-4 w-1 bg-primary" /> Traffic Performance Trend
          </h2>
          <div className="h-[250px] w-full bg-slate-50/30 rounded-xl border border-slate-100 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.areaData || []}>
                <defs>
                  <linearGradient id="reportColorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#reportColorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Audience Breakdown */}
        <div className="grid grid-cols-2 gap-8 mb-8 page-break-inside-avoid">
          <section className="flex flex-col">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900">
              <div className="h-3 w-1 bg-primary" /> Traffic Source Distribution
            </h2>
            <div className="w-full">
              <div className="h-[180px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.sourceData || []}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(data.sourceData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col items-center gap-2">
                {(data.sourceData || []).map(s => (
                  <div key={s.name} className="flex items-center justify-between w-full max-w-[200px] border-b border-slate-100 pb-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[10px] font-bold text-slate-700 uppercase">{s.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900">
              <div className="h-3 w-1 bg-primary" /> Regional Engagement
            </h2>
            <div className="space-y-4 pt-2">
              {(data.countryData || []).slice(0, 5).map((c) => {
                const max = Math.max(...(data.countryData || []).map(d => d.value));
                const percent = (c.value / max) * 100;
                return (
                  <div key={c.name} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-900 uppercase tracking-tight">
                      <span>{c.name}</span>
                      <span className="text-xs">{c.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full">
                      <div className="h-full bg-slate-900 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Top Content */}
        <section className="mb-8 page-break-inside-avoid">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-slate-900">
            <div className="h-4 w-1 bg-primary" /> Most Engaging Content
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="pb-2">Content Path</th>
                <th className="pb-2 text-right">Unique Views</th>
                <th className="pb-2 text-right">Impact Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data.topPages || []).map((page) => (
                <tr key={page.path} className="text-sm">
                  <td className="py-3 font-medium text-slate-700">
                    {page.path === "/" ? "Home Page" : 
                     page.path === "/#about" ? "Home: About Section" :
                     page.path === "/#services" ? "Home: Services Section" :
                     page.path === "/#projects" ? "Home: Projects Section" :
                     page.path === "/#testimonials" ? "Home: Testimonials" :
                     page.path === "/#contact" ? "Home: Contact Section" :
                     page.path === "/#estimator" ? "Home: Cost Estimator" :
                     page.path === "/admin" ? "Admin Dashboard" : 
                     page.path === "/admin/login" ? "Admin Login" : 
                     page.path === "/admin/report" ? "Analytics Report" :
                     page.path === "/privacy-policy" ? "Privacy Policy" :
                     page.path === "/terms-of-service" ? "Terms of Service" :
                     page.path === "/cookie-policy" ? "Cookie Policy" :
                     page.path.replace(/\//g, " ").replace(/#/g, ": ").trim().split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900">{page.count.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className="rounded bg-slate-200 text-slate-900 px-2 py-0.5 text-[10px] font-bold">{(page.count / data.pageViews * 100).toFixed(1)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Inquiries */}
        <section className="mb-8 page-break-inside-avoid">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-slate-900">
            <div className="h-4 w-1 bg-primary" /> Recent Inquiries & Leads
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="pb-2">Lead Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data.latestInquiries || []).map((inq) => (
                <tr key={inq._id} className="text-xs">
                  <td className="py-3 font-bold text-slate-900">{inq.name}</td>
                  <td className="py-3 text-slate-700 font-medium">{inq.email}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-slate-200 text-slate-900 px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter">
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900">{new Date(inq.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} i4C Construction & Development Corp. • Private & Confidential</p>
          <p className="mt-1">Generated by i4C Administrative Portal</p>
        </footer>
      </div>

      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 0mm;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .report-document {
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 15mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            display: block !important;
            background: white !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          h1, h2, h3, p, span, td, th {
            color: black !important;
          }
          .text-primary {
            color: #10b981 !important;
          }
          .recharts-responsive-container {
            width: 100% !important;
            height: 250px !important;
          }
          /* Remove browser URL and date headers */
          header, footer {
            display: block !important;
          }
        }
      `}} />
    </div>
  );
}
