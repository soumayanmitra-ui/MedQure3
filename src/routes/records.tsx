import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, FileHeart, History, Pill, Share2, ShieldCheck, User, XCircle, Sparkles, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState, PageHeader } from "@/components/common";
import { samplePatient as p } from "@/data/health";
import { doctors } from "@/data/doctors";
import { useDemoSession } from "@/lib/demo-auth";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Medical Records (Demo) — MediResQ" },
      { name: "description", content: "Demo of a fictional patient record with a consent-based sharing interface. No real health data is stored." },
      { property: "og:title", content: "Medical Records (Demo) — MediResQ" },
      { property: "og:description", content: "Consent-based medical record sharing demo with a fictional patient." },
    ],
  }),
  component: RecordsPage,
});

const scopes = ["Allergies", "Conditions", "Prescriptions", "Visit history"] as const;
interface Grant { id: string; doctorId: string; scopes: string[]; duration: string; }

function RecordsPage() {
  const { session, isLoggedIn } = useDemoSession();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [open, setOpen] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [sel, setSel] = useState<string[]>(["Allergies"]);
  const [duration, setDuration] = useState("24 hours");
  const [err, setErr] = useState("");

  const grant = () => {
    if (!doctorId) return setErr("Choose a doctor");
    if (sel.length === 0) return setErr("Select at least one record type");
    setGrants((g) => [...g, { id: crypto.randomUUID(), doctorId, scopes: sel, duration }]);
    setOpen(false); setDoctorId(""); setSel(["Allergies"]); setErr("");
    toast.success("Simulated consent granted", { description: "Stored only in this browser tab; nothing is shared." });
  };

  return (
    <div>
      <PageHeader title="Patient Medical Records" subtitle="Fictional patient profile for demonstration." icon={<FileHeart />} />
      <div role="note" className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border-2 border-warning/40 bg-warning-soft p-4 text-sm">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
          <div>
            <p><strong>DEMO ONLY.</strong> This page shows a fictional patient profile. There is no real database or persistent storage.</p>
            {isLoggedIn ? (
              <p className="mt-1 text-xs text-teal font-medium flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5" /> Active prototype session for {session?.phone} (Verified via Demo OTP 123456).
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Want to test patient authentication? Try our Demo OTP Verification flow (Demo OTP: 123456).
              </p>
            )}
          </div>
        </div>
        {!isLoggedIn && (
          <Button asChild size="sm" variant="teal" className="shrink-0">
            <Link to="/login"><Sparkles className="h-3.5 w-3.5 mr-1" /> Test Demo Login</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground"><User /></div>
              <div><h2 className="font-bold text-primary">{p.name}</h2><p className="text-xs text-muted-foreground">{p.id}</p></div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[["Age", p.age], ["Sex", p.gender], ["Blood", p.bloodGroup]].map(([k, v]) => <div key={k} className="rounded-lg bg-muted p-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">Emergency contact</p>
            <p className="text-sm">{p.emergencyContact}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-primary"><ShieldCheck className="h-5 w-5 text-teal" /> Access consents</h2>
            </div>
            {grants.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No doctor currently has access. You control who sees your records.</p> : (
              <ul className="mt-3 space-y-2">
                {grants.map((g) => {
                  const d = doctors.find((x) => x.id === g.doctorId)!;
                  return (
                    <li key={g.id} className="rounded-lg border p-3 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div><p className="font-semibold">{d.name}</p><p className="text-xs text-muted-foreground">{g.scopes.join(", ")} · {g.duration}</p></div>
                        <button onClick={() => { setGrants((x) => x.filter((y) => y.id !== g.id)); toast("Consent revoked (simulated)"); }} aria-label={`Revoke ${d.name}`} className="text-destructive"><XCircle className="h-5 w-5" /></button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button variant="teal" className="mt-4 w-full"><Share2 /> Share with a doctor</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Grant record access (simulated)</DialogTitle>
                  <DialogDescription>Choose who can view which parts of your record and for how long. No data actually leaves this page.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Doctor</Label>
                    <Select value={doctorId} onValueChange={(v) => { setDoctorId(v); setErr(""); }}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a doctor (sample profiles)" /></SelectTrigger>
                      <SelectContent>{doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.name} — {d.speciality}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <fieldset>
                    <legend className="text-sm font-medium">Records to share</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {scopes.map((s) => (
                        <label key={s} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                          <Checkbox checked={sel.includes(s)} onCheckedChange={(c) => { setErr(""); setSel((x) => c ? [...x, s] : x.filter((y) => y !== s)); }} />{s}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div>
                    <Label>Access duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>{["1 hour", "24 hours", "7 days", "30 days"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {err && <p className="text-sm text-destructive">{err}</p>}
                </div>
                <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={grant}>Grant access</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </aside>

        <Tabs defaultValue="visits" className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
          <TabsList className="flex h-auto w-full flex-wrap">
            <TabsTrigger value="visits"><History className="mr-1 h-4 w-4" />Visits</TabsTrigger>
            <TabsTrigger value="allergies"><AlertTriangle className="mr-1 h-4 w-4" />Allergies</TabsTrigger>
            <TabsTrigger value="rx"><Pill className="mr-1 h-4 w-4" />Prescriptions</TabsTrigger>
            <TabsTrigger value="history"><FileHeart className="mr-1 h-4 w-4" />History</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="visits" className="mt-4">
            <ol className="relative space-y-4 border-l-2 border-accent pl-5">
              {p.visits.map((v) => (
                <li key={v.date} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-teal" />
                  <p className="text-xs text-muted-foreground">{new Date(v.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                  <p className="font-semibold">{v.reason}</p>
                  <p className="text-sm text-muted-foreground">{v.doctor} · {v.hospital}</p>
                  <p className="mt-1 text-sm">{v.notes}</p>
                </li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent value="allergies" className="mt-4 space-y-3">
            {p.allergies.map((a) => (
              <div key={a.name} className="flex items-center justify-between rounded-xl border p-4">
                <div><p className="font-semibold">{a.name}</p><p className="text-sm text-muted-foreground">{a.reaction}</p></div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${a.severity === "High" ? "bg-emergency-soft text-emergency" : "bg-warning-soft text-warning"}`}>{a.severity}</span>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="rx" className="mt-4 space-y-3">
            {p.prescriptions.map((r) => (
              <div key={r.drug} className="rounded-xl border p-4">
                <div className="flex justify-between gap-2"><p className="font-semibold">{r.drug}</p><span className={`text-xs font-semibold ${r.active ? "text-success" : "text-muted-foreground"}`}>{r.active ? "Active" : "Completed"}</span></div>
                <p className="text-sm">{r.dose}</p>
                <p className="text-xs text-muted-foreground">{r.prescribedBy} · {r.date}</p>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="history" className="mt-4 space-y-3">
            {p.conditions.map((c) => (
              <div key={c.name} className="flex justify-between rounded-xl border p-4"><div><p className="font-semibold">{c.name}</p><p className="text-sm text-muted-foreground">Since {c.since}</p></div><span className="text-sm">{c.status}</span></div>
            ))}
          </TabsContent>
          <TabsContent value="reports" className="mt-4">
            <EmptyState title="No lab reports yet" body="Uploading reports requires secure storage, which is a future integration." action={<Button variant="outline" onClick={() => toast.info("Report upload is a future integration")}>Upload report</Button>} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
