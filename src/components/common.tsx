import { useEffect, useState, type ReactNode } from "react";
import { FlaskConical, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background bg-teal" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-primary">
        Medi<span className="text-teal">ResQ</span>
      </span>
    </span>
  );
}

export function DemoBadge({ children = "Sample data" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning">
      <FlaskConical className="h-3 w-3" /> {children}
    </span>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="flex gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm text-foreground">
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <div>{children}</div>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon, actions }: { title: string; subtitle?: string; icon?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-muted/50 px-6 py-12 text-center">
      <SearchX className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function CardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-2xl border bg-muted" />
      ))}
    </div>
  );
}

/** Short simulated delay to show loading states when filters change (no network involved). */
export function useSimulatedLoading(deps: unknown[], ms = 350) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return loading;
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold">
      <span className="text-warning">★</span>
      {value.toFixed(1)}
    </span>
  );
}

export function directionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
