import { cn } from "@/lib/utils";

export interface MapPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  tone: "teal" | "primary" | "warning" | "emergency" | "success";
  size?: number;
}

const toneClass: Record<MapPoint["tone"], string> = {
  teal: "bg-teal",
  primary: "bg-primary",
  warning: "bg-warning",
  emergency: "bg-emergency",
  success: "bg-success",
};

/** Illustrative schematic map (not geographically accurate). */
export function SchematicMap({ points, activeId, onSelect, className }: { points: MapPoint[]; activeId?: string | undefined; onSelect?: (id: string) => void; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border bg-accent/50", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-border">
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} stroke="currentColor" strokeWidth="0.25">
            <line x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" />
            <line y1={(i + 1) * 10} x1="0" y2={(i + 1) * 10} x2="100" />
          </g>
        ))}
        <path d="M0 60 C 25 50, 45 75, 65 55 S 90 30, 100 40" fill="none" stroke="var(--teal)" strokeOpacity="0.35" strokeWidth="2.5" />
        <path d="M10 0 L 35 100 M 0 30 L 100 25 M 60 0 L 70 100" stroke="var(--muted-foreground)" strokeOpacity="0.25" strokeWidth="0.8" fill="none" />
      </svg>
      {points.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect?.(p.id)}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          aria-label={p.label}
        >
          <span
            className={cn("block rounded-full border-2 border-background shadow-card transition-transform group-hover:scale-125", toneClass[p.tone], activeId === p.id && "scale-125 ring-4 ring-ring/40")}
            style={{ width: p.size ?? 16, height: p.size ?? 16, opacity: 0.9 }}
          />
          <span className={cn("pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-0.5 text-[11px] font-medium shadow-card", activeId === p.id ? "block" : "hidden group-hover:block")}>
            {p.label}
          </span>
        </button>
      ))}
      <span className="absolute bottom-2 right-2 rounded bg-card/90 px-2 py-0.5 text-[10px] text-muted-foreground">Schematic map · not to scale</span>
    </div>
  );
}
