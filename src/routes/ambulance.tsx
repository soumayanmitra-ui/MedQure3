import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Ambulance, CheckCircle2, LocateFixed, Phone, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DemoNotice, PageHeader } from "@/components/common";
import { hospitals } from "@/data/hospitals";

const searchSchema = z.object({ destination: z.string().optional() });

export const Route = createFileRoute("/ambulance")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Ambulance Request (Simulated) — MediResQ" },
      { name: "description", content: "Simulated ambulance request form with validation and confirmation. No ambulance is dispatched." },
      { property: "og:title", content: "Ambulance Request (Simulated) — MediResQ" },
      { property: "og:description", content: "Try the MediResQ ambulance request flow. Demo only — call 108 or 112 in a real emergency." },
    ],
  }),
  component: AmbulancePage,
});

const categories = ["Cardiac / chest pain", "Road accident / trauma", "Breathing difficulty", "Pregnancy / labour", "Stroke symptoms", "Unconscious person", "Other"];

const formSchema = z.object({
  pickup: z.string().trim().min(5, "Enter a pickup address (at least 5 characters)").max(200),
  destination: z.string().min(1, "Choose a destination hospital"),
  category: z.string().min(1, "Choose an emergency category"),
  name: z.string().trim().min(2, "Enter the contact person's name").max(80),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  notes: z.string().max(500).optional(),
});
type FormData = z.infer<typeof formSchema>;
type Errors = Partial<Record<keyof FormData, string>>;

function AmbulancePage() {
  const search = Route.useSearch();
  const [data, setData] = useState<FormData>({ pickup: "", destination: search.destination ?? "", category: "", name: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const set = (k: keyof FormData, v: string) => { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const review = (e: React.FormEvent) => {
    e.preventDefault();
    const r = formSchema.safeParse(data);
    if (!r.success) {
      const errs: Errors = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as keyof FormData] ??= i.message; });
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setReviewOpen(true);
  };

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setReviewOpen(false);
      setConfirmed(`SIM-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 900);
  };

  const useLocation = () => {
    if (!navigator.geolocation) { toast.error("Location is not available in this browser"); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => set("pickup", `Near ${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`),
      () => toast.error("Location permission denied — please type the address"),
    );
  };

  const hospitalName = hospitals.find((h) => h.id === data.destination)?.name;

  if (confirmed) {
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success"><CheckCircle2 className="h-9 w-9" /></div>
        <h1 className="text-2xl font-bold text-primary">Simulated request recorded</h1>
        <p className="text-muted-foreground">Reference <strong className="text-foreground">{confirmed}</strong>. This was a demonstration only — <strong className="text-foreground">no ambulance has been dispatched</strong> and no one has been notified.</p>
        <div className="rounded-2xl border bg-card p-5 text-left text-sm shadow-card">
          <Summary data={data} hospitalName={hospitalName} />
        </div>
        <div className="rounded-2xl border-2 border-emergency bg-emergency-soft p-5">
          <p className="font-semibold text-emergency">Real emergency? Call now:</p>
          <div className="mt-3 flex justify-center gap-3">
            <Button asChild variant="emergency"><a href="tel:108"><Phone /> 108 Ambulance</a></Button>
            <Button asChild variant="outline"><a href="tel:112"><Phone /> 112</a></Button>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => { setConfirmed(null); setData({ pickup: "", destination: "", category: "", name: "", phone: "", notes: "" }); }}>New simulated request</Button>
          <Button asChild><Link to="/">Back to home</Link></Button>
        </div>
      </div>
    );
  }

  const field = (k: keyof FormData) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });
  const Err = ({ k }: { k: keyof FormData }) => errors[k] ? <p id={`${k}-err`} className="mt-1 text-sm text-destructive">{errors[k]}</p> : null;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Ambulance Request" subtitle="Simulated request flow for demonstration." icon={<Ambulance />} />
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border-2 border-emergency bg-emergency-soft p-4 sm:flex-row sm:items-center">
        <FlaskConical className="h-6 w-6 shrink-0 text-emergency" />
        <p className="flex-1 text-sm"><strong>Simulation only.</strong> MediResQ is not connected to any ambulance service. For a real emergency call <strong>108</strong> or <strong>112</strong>.</p>
        <Button asChild variant="emergency" size="sm"><a href="tel:108"><Phone /> Call 108</a></Button>
      </div>
      <form onSubmit={review} noValidate className="space-y-5 rounded-2xl border bg-card p-5 shadow-card sm:p-6">
        <div>
          <Label htmlFor="pickup">Pickup location *</Label>
          <div className="mt-1.5 flex gap-2">
            <Input id="pickup" value={data.pickup} onChange={(e) => set("pickup", e.target.value)} placeholder="House no., street, landmark, area" {...field("pickup")} />
            <Button type="button" variant="outline" onClick={useLocation} aria-label="Use my location"><LocateFixed /><span className="hidden sm:inline">Locate</span></Button>
          </div>
          <Err k="pickup" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Destination hospital *</Label>
            <Select value={data.destination} onValueChange={(v) => set("destination", v)}>
              <SelectTrigger className="mt-1.5" {...field("destination")}><SelectValue placeholder="Select hospital" /></SelectTrigger>
              <SelectContent>{hospitals.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
            </Select>
            <Err k="destination" />
          </div>
          <div>
            <Label>Emergency category *</Label>
            <Select value={data.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger className="mt-1.5" {...field("category")}><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Err k="category" />
          </div>
          <div>
            <Label htmlFor="name">Contact name *</Label>
            <Input id="name" className="mt-1.5" value={data.name} onChange={(e) => set("name", e.target.value)} {...field("name")} />
            <Err k="name" />
          </div>
          <div>
            <Label htmlFor="phone">Mobile number *</Label>
            <Input id="phone" className="mt-1.5" inputMode="numeric" maxLength={10} value={data.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} placeholder="10-digit number" {...field("phone")} />
            <Err k="phone" />
          </div>
        </div>
        <div>
          <Label htmlFor="notes">Additional notes</Label>
          <Textarea id="notes" className="mt-1.5" value={data.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Patient condition, number of people, access instructions" />
        </div>
        <p className="text-xs text-muted-foreground">Please don't enter real personal or medical details — nothing is stored or sent.</p>
        <Button type="submit" variant="emergency" size="lg" className="w-full">Review simulated request</Button>
      </form>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review request summary</DialogTitle>
            <DialogDescription>Submitting creates a simulated reference only. No ambulance will be dispatched.</DialogDescription>
          </DialogHeader>
          <div className="text-sm"><Summary data={data} hospitalName={hospitalName} /></div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Edit</Button>
            <Button variant="emergency" onClick={submit} disabled={submitting}>{submitting ? "Recording…" : "Submit simulated request"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-6"><DemoNotice>A real integration would connect to a state 108 service or ambulance provider with live tracking. That is a future integration.</DemoNotice></div>
    </div>
  );
}

function Summary({ data, hospitalName }: { data: FormData; hospitalName?: string | undefined }) {
  const rows = [["Pickup", data.pickup], ["Destination", hospitalName], ["Category", data.category], ["Contact", `${data.name} · ${data.phone}`], ["Notes", data.notes || "—"]];
  return (
    <dl className="divide-y">
      {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
    </dl>
  );
}
