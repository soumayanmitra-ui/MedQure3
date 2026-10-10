import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, AlertTriangle, BedDouble, Building2, LineChart as LineIcon, MapPinned, Sparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DemoBadge, PageHeader } from "@/components/common";
import { SchematicMap } from "@/components/SchematicMap";
import { diseaseTrends, hotspots, regionCapacity, simulatedAlerts } from "@/data/health";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Government Health Dashboard (Sample) — MediResQ" },
      { name: "description", content: "Sample public-health dashboard with hospital capacity, disease trends, hotspots and simulated risk signals." },
      { property: "og:title", content: "Government Health Dashboard (Sample) — MediResQ" },
      { property: "og:description", content: "Hospital capacity, disease trends and simulated risk signals for public-health review." },
    ],
  }),
  component: Dashboard,
});

const diseases = [
  { key: "dengue", label: "Dengue", color: "var(--chart-4)" },
  { key: "influenza", label: "Influenza", color: "var(--chart-1)" },
  { key: "gastro", label: "Gastroenteritis", color: "var(--chart-2)" },
  { key: "malaria", label: "Malaria", color: "var(--chart-3)" },
] as const;

const tone = { high: "emergency", medium: "warning", low: "success" } as const;

function Dashboard() {
  const [range, setRange] = useState("9");
  const [active, setActive] = useState<string[]>(diseases.map((d) => d.key));
  const [alert, setAlert] = useState<(typeof simulatedAlerts)[number] | null>(null);
  const [spot, setSpot] = useState<string>();

  const data = useMemo(() => diseaseTrends.slice(-Number(range)), [range]);
  const totalCases = data.reduce((a, w) => a + w.dengue + w.malaria + w.influenza + w.gastro, 0);
  const occ = regionCapacity.reduce((a, r) => ({ o: a.o + r.occupied, t: a.t + r.total }), { o: 0, t: 0 });
  const capData = regionCapacity.map((r) => ({ region: r.region, Occupied: r.occupied, Available: r.total - r.occupied }));
  const selectedSpot = hotspots.find((h) => h.region === spot);

  const cards = [
    { label: "Reported cases (period)", value: totalCases.toLocaleString("en-IN"), icon: Activity },
    { label: "Bed occupancy", value: `${Math.round((occ.o / occ.t) * 100)}%`, icon: BedDouble },
    { label: "Reporting hospitals", value: "48", icon: Building2 },
    { label: "Open signals", value: String(simulatedAlerts.length), icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Government Health Dashboard" subtitle="Delhi NCR · sample surveillance view for public-health officers." icon={<LineIcon />}
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge>Simulated data</DemoBadge>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-40" aria-label="Date range"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="4">Last 4 weeks</SelectItem><SelectItem value="6">Last 6 weeks</SelectItem><SelectItem value="9">Last 9 weeks</SelectItem></SelectContent>
            </Select>
          </div>
        } />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border bg-card p-4 shadow-card">
            <c.icon className="h-5 w-5 text-teal" />
            <p className="mt-2 text-2xl font-bold text-primary">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-primary">Reported disease trends (weekly)</h2>
          <div className="flex flex-wrap gap-1">
            {diseases.map((d) => (
              <button key={d.key} onClick={() => setActive((a) => a.includes(d.key) ? a.filter((x) => x !== d.key) : [...a, d.key])}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-opacity ${active.includes(d.key) ? "" : "opacity-40"}`} aria-pressed={active.includes(d.key)}>
                <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: d.color }} />{d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -20, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis fontSize={12} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
              {diseases.filter((d) => active.includes(d.key)).map((d) => <Line key={d.key} type="monotone" dataKey={d.key} name={d.label} stroke={d.color} strokeWidth={2.5} dot={false} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="mb-3 font-bold text-primary">Hospital bed capacity by region</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="region" fontSize={11} stroke="var(--muted-foreground)" interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Legend />
                <Bar dataKey="Occupied" stackId="a" fill="var(--chart-1)" />
                <Bar dataKey="Available" stackId="a" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-primary"><MapPinned className="h-5 w-5 text-teal" /> Hotspot indicators</h2>
          <SchematicMap className="h-64" activeId={spot} onSelect={setSpot}
            points={hotspots.map((h) => ({ id: h.region, x: h.x, y: h.y, label: h.region, tone: tone[h.level], size: h.level === "high" ? 30 : h.level === "medium" ? 22 : 16 }))} />
          <p className="mt-3 min-h-10 text-sm">{selectedSpot ? <><strong>{selectedSpot.region}:</strong> {selectedSpot.signal}</> : <span className="text-muted-foreground">Select a region marker to see its indicator.</span>}</p>
        </section>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h2 className="flex items-center gap-2 font-bold text-primary"><Sparkles className="h-5 w-5 text-teal" /> Simulated risk signals</h2>
          <DemoBadge>Simulated · not AI predictions</DemoBadge>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">These are rule-based examples on sample data illustrating how an AI model could flag <strong>possible signals</strong>. They are not confirmed outbreaks and require verification by public-health officials.</p>
        <div className="grid gap-3 md:grid-cols-3">
          {simulatedAlerts.map((a) => (
            <article key={a.id} className={`rounded-xl border-l-4 bg-muted/50 p-4 ${a.severity === "High" ? "border-l-emergency" : a.severity === "Medium" ? "border-l-warning" : "border-l-success"}`}>
              <p className="text-xs font-semibold uppercase text-muted-foreground">{a.severity} · {a.region}</p>
              <h3 className="mt-1 font-semibold">{a.title}</h3>
              <Button variant="link" className="h-auto px-0" onClick={() => setAlert(a)}>View details</Button>
            </article>
          ))}
        </div>
      </section>

      <Dialog open={!!alert} onOpenChange={(o) => !o && setAlert(null)}>
        {alert && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{alert.title}</DialogTitle>
              <DialogDescription>Simulated signal · {alert.region} · severity {alert.severity}</DialogDescription>
            </DialogHeader>
            <p className="text-sm">{alert.detail}</p>
            <p className="rounded-lg bg-warning-soft p-3 text-sm">This is a possible signal requiring public-health verification — not a confirmed outbreak.</p>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
