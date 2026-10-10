import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BedDouble, Mail, MapPin, Navigation, Phone, Stethoscope, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DemoBadge, DemoNotice, Stars, directionsUrl } from "@/components/common";
import { SchematicMap } from "@/components/SchematicMap";
import { getHospital } from "@/data/hospitals";
import { doctors } from "@/data/doctors";

export const Route = createFileRoute("/hospitals/$id")({
  loader: ({ params }) => {
    const hospital = getHospital(params.id);
    if (!hospital) throw notFound();
    return { hospital };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Hospital not found — MediResQ" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.hospital.name} — MediResQ`;
    const d = `Facilities, specialities and sample bed availability for ${loaderData.hospital.name}.`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  notFoundComponent: () => (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Hospital not found</h1>
      <Link to="/hospitals" className="mt-4 inline-block text-teal underline">Back to Hospital Finder</Link>
    </div>
  ),
  component: HospitalDetail,
});

function HospitalDetail() {
  const { hospital: h } = Route.useLoaderData();
  const docs = doctors.filter((d) => d.hospitalId === h.id);
  const beds = [
    { label: "General", free: h.beds.general },
    { label: "ICU", free: h.beds.icu },
    { label: "Emergency", free: h.beds.emergency },
  ];
  return (
    <div className="space-y-6">
      <Link to="/hospitals" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All hospitals</Link>
      <div className="rounded-3xl border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2"><span className="text-xs font-semibold uppercase tracking-wide text-teal">{h.type} hospital</span><DemoBadge /></div>
            <h1 className="mt-1 text-2xl font-bold text-primary sm:text-3xl">{h.name}</h1>
            <div className="mt-2"><Stars value={h.rating} /></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="teal"><a href={directionsUrl(h.lat, h.lng)} target="_blank" rel="noreferrer"><Navigation /> Get directions</a></Button>
            <Button asChild variant="emergency"><Link to="/ambulance" search={{ destination: h.id }}>Request ambulance (simulated)</Link></Button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-teal" />{h.address}</p>
          <a href={`tel:${h.phone.replace(/\s/g, "")}`} className="flex gap-2 hover:underline"><Phone className="h-4 w-4 text-teal" />{h.phone} (sample)</a>
          <a href={`mailto:${h.email}`} className="flex gap-2 hover:underline"><Mail className="h-4 w-4 text-teal" />{h.email}</a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="flex items-center gap-2 font-bold text-primary"><BedDouble className="h-5 w-5 text-teal" /> Bed availability <span className="text-xs font-normal text-muted-foreground">(sample, last updated: demo)</span></h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {beds.map((b) => (
              <div key={b.label} className="rounded-xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">{b.label}</p>
                <p className={`text-3xl font-bold ${b.free === 0 ? "text-emergency" : "text-primary"}`}>{b.free}</p>
                <p className="text-xs text-muted-foreground">beds free</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Total capacity: {h.beds.total} beds</p>
          <Progress value={((h.beds.total - beds.reduce((a, b) => a + b.free, 0)) / h.beds.total) * 100} className="mt-2" />
          <h3 className="mt-6 font-semibold">Specialities</h3>
          <div className="mt-2 flex flex-wrap gap-2">{h.specialities.map((s: string) => <span key={s} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">{s}</span>)}</div>
          <h3 className="mt-6 font-semibold">Facilities</h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">{h.facilities.map((f: string) => <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" />{f}</li>)}</ul>
        </section>
        <div className="space-y-6">
          <SchematicMap className="aspect-square" activeId={h.id} points={[{ id: h.id, x: h.x, y: h.y, label: h.name, tone: "teal", size: 22 }]} />
          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 font-bold text-primary"><Stethoscope className="h-5 w-5 text-teal" /> Doctors here</h2>
            {docs.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No sample doctor profiles listed for this hospital.</p> : (
              <ul className="mt-3 space-y-2">{docs.map((d) => <li key={d.id} className="text-sm"><span className="font-medium">{d.name}</span> <span className="text-muted-foreground">· {d.speciality}</span></li>)}</ul>
            )}
            <Button asChild variant="outline" size="sm" className="mt-3"><Link to="/doctors">Doctor directory</Link></Button>
          </section>
        </div>
      </div>
      <DemoNotice>This is a fictional hospital profile. Always call the hospital directly to confirm availability before travelling.</DemoNotice>
    </div>
  );
}
