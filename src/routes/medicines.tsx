import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Clock, MapPin, Phone, Pill, Search, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardSkeletonGrid, DemoBadge, EmptyState, PageHeader, useSimulatedLoading } from "@/components/common";
import { medicines, pharmacies } from "@/data/medicines";

export const Route = createFileRoute("/medicines")({
  head: () => ({
    meta: [
      { title: "Medicine & Pharmacy Finder — MediResQ" },
      { name: "description", content: "Look up general medicine information, same-salt generic alternatives and sample nearby pharmacies." },
      { property: "og:title", content: "Medicine & Pharmacy Finder — MediResQ" },
      { property: "og:description", content: "General medicine information and sample pharmacy listings." },
    ],
  }),
  component: MedicinesPage,
});

function MedicinesPage() {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(medicines[0]?.id ?? "");
  const loading = useSimulatedLoading([q]);
  const results = useMemo(() => medicines.filter((m) => (m.name + m.salt + m.category).toLowerCase().includes(q.toLowerCase())), [q]);
  const med = results.find((m) => m.id === selectedId) ?? results[0];
  const stocking = med ? pharmacies.filter((p) => p.stock.includes(med.id)).sort((a, b) => a.distanceKm - b.distanceKm) : [];

  return (
    <div>
      <PageHeader title="Medicine & Pharmacy Finder" subtitle="General information for education only — not medical advice." icon={<Pill />} actions={<DemoBadge />} />
      <div role="alert" className="mb-6 flex gap-3 rounded-xl border-2 border-emergency/40 bg-emergency-soft p-4 text-sm">
        <AlertTriangle className="h-5 w-5 shrink-0 text-emergency" />
        <p><strong>Safety notice:</strong> Never switch, substitute or stop a medicine without confirming with a qualified doctor or pharmacist. Generic alternatives are shown only when the active ingredient and strength are identical in our sample dataset.</p>
      </div>
      <div className="relative mb-6 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search medicine or salt, e.g. Paracetamol" className="h-12 pl-9" aria-label="Search medicines" />
      </div>

      {loading ? <CardSkeletonGrid count={3} /> : !med ? (
        <EmptyState title="Medicine not in sample dataset" body="This prototype contains a small list of common medicines. A licensed drug database would be integrated in future." action={<Button variant="outline" onClick={() => setQ("")}>Show all</Button>} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {results.map((m) => (
              <li key={m.id} className="shrink-0">
                <button onClick={() => setSelectedId(m.id)} className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${m.id === med.id ? "border-teal bg-accent text-accent-foreground" : "bg-card hover:bg-muted"}`}>
                  <span className="block font-semibold">{m.name}</span>
                  <span className="text-xs text-muted-foreground">{m.category}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="space-y-6">
            <section className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-primary">{med.name}</h2>
                  <p className="text-sm text-muted-foreground">{med.salt} · {med.form}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${med.prescriptionRequired ? "bg-emergency-soft text-emergency" : "bg-success-soft text-success"}`}>{med.prescriptionRequired ? "Prescription required" : "Over the counter"}</span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div><h3 className="text-sm font-semibold">Common uses</h3><ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">{med.uses.map((u) => <li key={u}>{u}</li>)}</ul></div>
                <div><h3 className="text-sm font-semibold">Possible side effects</h3><ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">{med.commonSideEffects.map((u) => <li key={u}>{u}</li>)}</ul></div>
              </div>
              <p className="mt-4 text-sm">Sample MRP: <strong>₹{med.samplePrice}</strong></p>
              <h3 className="mt-5 text-sm font-semibold">Generic alternatives (same salt & strength)</h3>
              {med.generics.length === 0 ? (
                <p className="mt-1 text-sm text-muted-foreground">No verified same-composition alternative in our sample data.</p>
              ) : (
                <ul className="mt-2 space-y-2">{med.generics.map((g) => (
                  <li key={g.name} className="flex items-center justify-between rounded-lg bg-teal-soft p-3 text-sm"><span>{g.name}</span><strong>₹{g.samplePrice}</strong></li>
                ))}</ul>
              )}
              <p className="mt-2 text-xs text-muted-foreground">Confirm any substitution with your doctor or pharmacist.</p>
            </section>
            <section>
              <h2 className="mb-3 flex items-center gap-2 font-bold text-primary"><Store className="h-5 w-5 text-teal" /> Nearby pharmacies stocking it (sample)</h2>
              {stocking.length === 0 ? <EmptyState title="No sample pharmacy lists this" body="Try another medicine." /> : (
                <div className="grid gap-3 md:grid-cols-2">
                  {stocking.map((p) => (
                    <article key={p.id} className="rounded-2xl border bg-card p-4 shadow-card">
                      <div className="flex justify-between gap-2"><h3 className="font-semibold">{p.name}</h3><span className="text-sm text-muted-foreground">{p.distanceKm} km</span></div>
                      <p className="mt-1 flex gap-1.5 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{p.address}</p>
                      <p className="mt-1 flex gap-1.5 text-sm"><Clock className="mt-0.5 h-4 w-4 text-teal" /><span className={p.open24x7 ? "font-medium text-success" : ""}>{p.hours}</span></p>
                      <Button asChild variant="outline" size="sm" className="mt-3"><a href={`tel:${p.phone.replace(/\s/g, "")}`}><Phone /> {p.phone}</a></Button>
                    </article>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">Distances and stock are sample values, not based on your location.</p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
