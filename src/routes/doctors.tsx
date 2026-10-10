import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Stethoscope, Video, MapPin, Clock, Languages, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CardSkeletonGrid, DemoNotice, EmptyState, PageHeader, Stars, useSimulatedLoading } from "@/components/common";
import { doctors, doctorCities, doctorSpecialities, type Doctor } from "@/data/doctors";
import { getHospital } from "@/data/hospitals";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Doctor Directory — MediResQ" },
      { name: "description", content: "Search sample doctor profiles by speciality and location. Profiles are not verified." },
      { property: "og:title", content: "Doctor Directory — MediResQ" },
      { property: "og:description", content: "Browse sample doctor profiles with qualifications, experience and ratings." },
    ],
  }),
  component: DoctorsPage,
});

function DoctorsPage() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("all");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState("rating");
  const [selected, setSelected] = useState<Doctor | null>(null);
  const loading = useSimulatedLoading([q, spec, city, sort]);

  const list = useMemo(() => doctors
    .filter((d) => d.name.toLowerCase().includes(q.toLowerCase()) && (spec === "all" || d.speciality === spec) && (city === "all" || d.city === city))
    .sort((a, b) => sort === "rating" ? b.rating - a.rating : sort === "experience" ? b.experience - a.experience : a.fee - b.fee), [q, spec, city, sort]);

  return (
    <div>
      <PageHeader title="Doctor Directory" subtitle="Search by speciality and location." icon={<Stethoscope />} />
      <div className="mb-4"><DemoNotice>All profiles below are <strong>sample profiles</strong> and have <strong>not</strong> been verified against the National Medical Commission register. A “Verified” badge would appear only after real credential checks — a future integration.</DemoNotice></div>
      <div className="mb-6 grid gap-3 rounded-2xl border bg-card p-4 shadow-card sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Doctor name" className="pl-9" aria-label="Doctor name" />
        </div>
        <Select value={spec} onValueChange={setSpec}><SelectTrigger aria-label="Speciality"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All specialities</SelectItem>{doctorSpecialities.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={city} onValueChange={setCity}><SelectTrigger aria-label="Location"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All locations</SelectItem>{doctorCities.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={sort} onValueChange={setSort}><SelectTrigger aria-label="Sort"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rating">Sort: Rating</SelectItem><SelectItem value="experience">Sort: Experience</SelectItem><SelectItem value="fee">Sort: Lowest fee</SelectItem></SelectContent></Select>
      </div>

      {loading ? <CardSkeletonGrid count={6} /> : list.length === 0 ? (
        <EmptyState title="No doctors found" body="Try another speciality or location." action={<Button variant="outline" onClick={() => { setQ(""); setSpec("all"); setCity("all"); }}>Clear filters</Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((d) => (
            <article key={d.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent font-display font-bold text-accent-foreground">{d.name.split(" ").slice(1).map((n) => n[0]).join("")}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-primary">{d.name}</h3>
                  <p className="text-sm text-teal">{d.speciality}</p>
                </div>
                <VerificationBadge v={d.verification} />
              </div>
              <p className="mt-3 text-sm">{d.qualifications}</p>
              <p className="text-sm text-muted-foreground">{d.experience} years experience</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <Stars value={d.rating} /><span className="text-muted-foreground">{d.reviews} sample reviews</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-1"><MapPin className="h-3 w-3" />{d.city}</span>
                {d.mode.map((m) => <span key={m} className="flex items-center gap-1 rounded-full bg-muted px-2 py-1">{m === "Video" && <Video className="h-3 w-3" />}{m}</span>)}
                <span className="rounded-full bg-muted px-2 py-1">₹{d.fee}</span>
              </div>
              <Button className="mt-4" onClick={() => setSelected(d)}>View profile</Button>
            </article>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">{selected.name} <VerificationBadge v={selected.verification} /></DialogTitle>
              <DialogDescription>{selected.speciality} · {selected.qualifications}</DialogDescription>
            </DialogHeader>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><MapPin className="h-4 w-4 text-teal" />{getHospital(selected.hospitalId)?.name}, {selected.city}</li>
              <li className="flex gap-2"><Clock className="h-4 w-4 text-teal" />{selected.availability}</li>
              <li className="flex gap-2"><Languages className="h-4 w-4 text-teal" />{selected.languages.join(", ")}</li>
              <li>Consultation fee: <strong>₹{selected.fee}</strong> · {selected.mode.join(" / ")}</li>
              <li>Experience: <strong>{selected.experience} years</strong></li>
            </ul>
            <Button onClick={() => toast.info("Appointment booking is a future integration", { description: "No appointment was booked in this prototype." })}>Book appointment (future integration)</Button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function VerificationBadge({ v }: { v: Doctor["verification"] }) {
  return v === "verified" ? (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success"><ShieldCheck className="h-3 w-3" />Verified</span>
  ) : (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning"><ShieldAlert className="h-3 w-3" />Sample · unverified</span>
  );
}
