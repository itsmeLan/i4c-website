import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function InquiriesPanel({
  inquiries,
  onUpdateStatus,
}: {
  inquiries: Inquiry[];
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = inquiries.filter((inq) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.service.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-panel-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
          <p className="mt-1 text-muted-foreground">
            {inquiries.length} total lead{inquiries.length !== 1 ? "s" : ""} from your website
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
          <Input
            placeholder="Search by name, email, service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background/50 pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 text-5xl opacity-40">📭</div>
            <p className="text-lg font-medium text-muted-foreground">
              {search ? "No inquiries match your search" : "No inquiries yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search ? "Try a different keyword" : "Leads will appear here when prospects fill out the contact form."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Service</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inq) => (
                <>
                  <TableRow
                    key={inq._id}
                    className="admin-table-row cursor-pointer border-border"
                    onClick={() =>
                      setExpandedId(expandedId === inq._id ? null : inq._id)
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {inq.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{inq.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {inq.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {inq.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {inq.service}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <select
                        value={inq.status || "new"}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdateStatus(inq._id, e.target.value)}
                        className={`status-badge cursor-pointer appearance-none outline-none border-none pr-6 bg-right ${
                          inq.status === "lost"
                            ? "lost"
                            : inq.status === "won" || inq.status === "replied"
                              ? "replied"
                              : inq.status === "contacted" || inq.status === "read"
                                ? "read"
                                : "new"
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 8px center",
                          backgroundSize: "8px auto"
                        }}
                      >
                        <option value="new" className="bg-background text-foreground">new</option>
                        <option value="contacted" className="bg-background text-foreground">contacted</option>
                        <option value="won" className="bg-background text-foreground">won</option>
                        <option value="lost" className="bg-background text-foreground">lost</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                  {/* Expanded Message */}
                  {expandedId === inq._id && (
                    <TableRow key={`${inq._id}-msg`} className="border-border bg-background/30">
                      <TableCell colSpan={5}>
                        <div className="space-y-2 py-2">
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="text-muted-foreground">
                              📞 {inq.phone}
                            </span>
                            <span className="text-muted-foreground">
                              📧 {inq.email}
                            </span>
                          </div>
                          <div className="rounded-lg bg-background/50 p-4 text-sm leading-relaxed text-foreground/90">
                            {inq.message}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
