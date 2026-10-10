import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, MapPin, Phone, Search, Navigation, BedDouble } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CardSkeletonGrid, DemoBadge, EmptyState, PageHeader, Stars, directionsUrl, useSimulatedLoading } from "@/components/common";
import { SchematicMap } from "@/components/SchematicMap";
import { allSpecialities, availableBeds, hospitals } from "@/data/hospitals";

export const Route = createFileRoute("/hospitals/")({
  head: () => ({
    meta: [
      { title: "Hospital Finder — MediResQ" },
      { name: "description", content: "Search sample hospitals by name, location and speciality, with bed availability and directions." },
      { property: "og:title", content: "Hospital Finder — MediResQ" },
      { property: "og:description", content: "Search hospitals, view facilities and sample bed availability." },
    ],
  }),
  component: HospitalFinder,
});

function HospitalFinder() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [spec, setSpec] = useState("all");
  const [type, setType] = useState("all");
  const [bedsOnly, setBedsOnly] = useState(false);
  const [active, setActive] = useState<string>();
  const loading = useSimulatedLoading([q, loc, spec, type, bedsOnly]);

  const results = useMemo(() => hospitals.filter((h) =>
    h.name.toLowerCase().includes(q.toLowerCase()) &&
    (h.city + h.address).toLowerCase().includes(loc.toLowerCase()) &&
    (spec === "all" || h.specialities.includes(spec)) &&
    (type === "all" || h.type === type) &&
    (!bedsOnly || availableBeds(h) > 0),
  ), [q, loc, spec, type, bedsOnly]);

  const reset = () => { setQ(""); setLoc(""); setSpec("all"); setType("all"); setBedsOnly(false); };

  return (
    <div>
      <PageHeader title="Hospital Finder" subtitle="Search by name, location and speciality. Bed counts are sample figures." icon={<Building2 />} actions={<DemoBadge />} />
      <div className="mb-6 grid gap-3 rounded-2xl border bg-card p-4 shadow-card md:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Hospital name" className="pl-9" aria-label="Hospital name" />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="City or area" className="pl-9" aria-label="Location" />
        </div>
        <Select value={spec} onValueChange={setSpec}>
          <SelectTrigger aria-label="Speciality"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All specialities</SelectItem>
            {allSpecialities.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger aria-label="Hospital type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="Government">Government</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
            <SelectItem value="Trust">Trust</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 lg:col-span-5">
          <Switch id="beds" checked={bedsOnly} onCheckedChange={setBedsOnly} />
          <Label htmlFor="beds">Only show hospitals with available beds</Label>
          <span className="ml-auto text-sm text-muted-foreground">{results.length} result{results.length !== 1 && "s"}</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div>
          {loading ? <CardSkeletonGrid count={4} /> : results.length === 0 ? (
            <EmptyState title="No hospitals match" body="Try a different name, location or remove some filters." action={<Button variant="outline" onClick={reset}>Clear filters</Button>} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((h) => {
                const f = availableBeds(h);
                return (
                  <article key={h.id} onMouseEnter={() => setActive(h.id)} className={`flex flex-col rounded-2xl border bg-card p-5 shadow-card transition-colors ${active === h.id ? "border-teal" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-teal">{h.type}</span>
                        <h3 className="font-bold text-primary">{h.name}</h3>
                      </div>
                      <Stars value={h.rating} />
                    </div>
                    <p className="mt-2 flex gap-1.5 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{h.address}</p>
                    <a href={`tel:${h.phone.replace(/\s/g, "")}`} className="mt-1 flex gap-1.5 text-sm text-muted-foreground hover:text-foreground"><Phone className="mt-0.5 h-4 w-4" />{h.phone} <span className="text-xs">(sample)</span></a>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {h.facilities.slice(0, 4).map((x) => <span key={x} className="rounded-full bg-muted px-2 py-0.5 text-xs">{x}</span>)}
                    </div>
                    <div className={`mt-3 flex items-center gap-2 rounded-lg p-2 text-sm ${f === 0 ? "bg-emergency-soft text-emergency" : "bg-success-soft text-success"}`}>
                      <BedDouble className="h-4 w-4" />
                      {f === 0 ? "No beds available (sample)" : `${h.beds.general} general · ${h.beds.icu} ICU · ${h.beds.emergency} ER (sample)`}
                    </div>
                    <div className="mt-4 flex gap-2 pt-1">
                      <Button asChild className="flex-1"><Link to="/hospitals/$id" params={{ id: h.id }}>View details</Link></Button>
                      <Button asChild variant="outline"><a href={directionsUrl(h.lat, h.lng)} target="_blank" rel="noreferrer"><Navigation /> Directions</a></Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
        <aside className="xl:sticky xl:top-28 xl:self-start">
          <SchematicMap className="aspect-square" activeId={active} onSelect={setActive}
            points={results.map((h) => ({ id: h.id, x: h.x, y: h.y, label: h.name.replace(" (Sample)", ""), tone: availableBeds(h) === 0 ? "emergency" : "teal" }))} />
          <p className="mt-2 text-xs text-muted-foreground">Teal: beds available · Red: full. Positions are illustrative; use “Directions” for real navigation.</p>
        </aside>
      </div>
    </div>
  );
}
