import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  Phone,
  FileHeart,
  Ambulance,
  Stethoscope,
  Pill,
  Building2,
  LogOut,
  ShieldCheck,
  FlaskConical,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DemoBadge, PageHeader } from "@/components/common";
import { useDemoSession } from "@/lib/demo-auth";
import { samplePatient as p } from "@/data/health";

export const Route = createFileRoute("/patient-dashboard")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard (Prototype) — MediResQ" },
      {
        name: "description",
        content:
          "Simulated patient dashboard for MediResQ prototype demonstration.",
      },
      { property: "og:title", content: "Patient Dashboard (Prototype) — MediResQ" },
      {
        property: "og:description",
        content: "Simulated patient dashboard in prototype mode.",
      },
    ],
  }),
  component: PatientDashboardPage,
});

function PatientDashboardPage() {
  const navigate = useNavigate();
  const { session, isLoggedIn, logout } = useDemoSession();

  const handleLogout = () => {
    logout();
    toast.info("Prototype session ended", {
      description: "You have signed out of the prototype demo session.",
    });
    navigate({ to: "/login" });
  };

  const currentPhone = session?.phone || p.phone;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Patient Portal"
        subtitle="Simulated patient dashboard for demonstration and evaluation."
        icon={<User />}
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge>Simulated Demo Session</DemoBadge>
            {isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1 text-destructive" />
                End Demo Session
              </Button>
            ) : (
              <Button asChild size="sm" variant="teal">
                <Link to="/login">Sign In (Demo OTP)</Link>
              </Button>
            )}
          </div>
        }
      />

      {/* Prominent Prototype Status Banner (Requirement 6 & 9) */}
      <div
        role="note"
        className="rounded-2xl border-2 border-teal/40 bg-teal-soft/30 p-4 sm:p-5 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-primary">
                  {isLoggedIn
                    ? "Active Prototype Session: Verified"
                    : "Browsing in Guest Demo Mode"}
                </p>
                <span className="rounded-full bg-success-soft text-success text-xs font-semibold px-2 py-0.5">
                  Demo OTP 123456
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground max-w-2xl">
                This session was verified using the simulated demo OTP (123456).
                No real SMS, real phone verification, or persistent medical database
                is attached. All patient profiles and records shown are fictional
                sample data.
              </p>
            </div>
          </div>
          {!isLoggedIn && (
            <Button asChild variant="teal" size="sm" className="shrink-0">
              <Link to="/login">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Login with Demo OTP
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Patient Profile Card & Vitals */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground font-display text-xl font-bold">
                RS
              </div>
              <div>
                <h2 className="font-bold text-primary">{p.name}</h2>
                <p className="text-xs font-mono text-muted-foreground">{p.id}</p>
                <p className="text-xs text-teal font-medium mt-0.5">
                  Mobile: {currentPhone}
                </p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["Age", p.age],
                ["Sex", p.gender],
                ["Blood", p.bloodGroup],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-muted p-2.5">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-bold text-foreground text-sm">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 space-y-2 border-t pt-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Emergency Contact:</span>
                <span className="font-medium text-foreground">
                  {p.emergencyContact}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Session Type:</span>
                <span className="font-medium text-teal">Prototype Frontend</span>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full mt-4 text-xs">
              <Link to="/records">
                <FileHeart className="h-3.5 w-3.5 mr-1.5 text-teal" />
                Manage Consent & Records
              </Link>
            </Button>
          </div>

          {/* Quick Notice */}
          <div className="rounded-2xl border border-warning/40 bg-warning-soft/60 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
            <FlaskConical className="h-4 w-4 shrink-0 text-warning mt-0.5" />
            <div>
              <p className="font-semibold text-warning">Privacy Guarantee</p>
              <p className="mt-0.5">
                No sensitive health information or private records are uploaded.
                This demonstration illustrates prospective consent-driven access.
              </p>
            </div>
          </div>
        </aside>

        {/* Action Grid & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Services Navigation */}
          <div>
            <h3 className="text-base font-bold text-primary mb-3">
              Prototype Services
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/records"
                className="group rounded-2xl border bg-card p-4 shadow-card hover:border-teal transition-all hover:-translate-y-0.5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground group-hover:bg-teal group-hover:text-primary-foreground transition-colors">
                  <FileHeart className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-sm">Medical Records</p>
                <p className="text-xs text-muted-foreground">Consent & history</p>
              </Link>

              <Link
                to="/ambulance"
                className="group rounded-2xl border bg-card p-4 shadow-card hover:border-emergency transition-all hover:-translate-y-0.5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emergency-soft text-emergency group-hover:bg-emergency group-hover:text-primary-foreground transition-colors">
                  <Ambulance className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-sm">Ambulance</p>
                <p className="text-xs text-muted-foreground">Simulated request</p>
              </Link>

              <Link
                to="/doctors"
                className="group rounded-2xl border bg-card p-4 shadow-card hover:border-teal transition-all hover:-translate-y-0.5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground group-hover:bg-teal group-hover:text-primary-foreground transition-colors">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-sm">Doctor Directory</p>
                <p className="text-xs text-muted-foreground">Specialist search</p>
              </Link>

              <Link
                to="/medicines"
                className="group rounded-2xl border bg-card p-4 shadow-card hover:border-teal transition-all hover:-translate-y-0.5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground group-hover:bg-teal group-hover:text-primary-foreground transition-colors">
                  <Pill className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-sm">Medicines</p>
                <p className="text-xs text-muted-foreground">Pharmacy availability</p>
              </Link>
            </div>
          </div>

          {/* Recent Visits & Active Prescriptions Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Recent Visits */}
            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-primary flex items-center gap-1.5 text-sm">
                  <Clock className="h-4 w-4 text-teal" /> Recent Consultations
                </h4>
                <Link
                  to="/records"
                  className="text-xs text-teal hover:underline font-medium"
                >
                  View all
                </Link>
              </div>
              <ul className="space-y-3 text-sm">
                {p.visits.slice(0, 2).map((v) => (
                  <li key={v.date} className="rounded-xl border p-3 bg-muted/30">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-foreground">{v.reason}</p>
                      <span className="text-xs text-muted-foreground">
                        {v.date}
                      </span>
                    </div>
                    <p className="text-xs text-teal mt-0.5">{v.doctor}</p>
                    <p className="text-xs text-muted-foreground mt-1">{v.notes}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active Prescriptions */}
            <div className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-primary flex items-center gap-1.5 text-sm">
                  <Pill className="h-4 w-4 text-teal" /> Prescriptions
                </h4>
                <Link
                  to="/medicines"
                  className="text-xs text-teal hover:underline font-medium"
                >
                  Find pharmacies
                </Link>
              </div>
              <ul className="space-y-3 text-sm">
                {p.prescriptions.map((rx) => (
                  <li
                    key={rx.drug}
                    className="rounded-xl border p-3 bg-muted/30 flex items-start justify-between"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{rx.drug}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {rx.dose}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By {rx.prescribedBy}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        rx.active
                          ? "bg-success-soft text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {rx.active ? "Active" : "Completed"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Known Allergies */}
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <h4 className="font-bold text-primary flex items-center gap-1.5 text-sm mb-3">
              <AlertTriangle className="h-4 w-4 text-warning" /> Known Allergies
              & Adverse Reactions
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {p.allergies.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center justify-between rounded-xl border p-3 bg-muted/20"
                >
                  <div>
                    <p className="font-semibold text-sm">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.reaction}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      a.severity === "High"
                        ? "bg-emergency-soft text-emergency"
                        : "bg-warning-soft text-warning"
                    }`}
                  >
                    {a.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
