import { regions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusMap: Record<string, { label: string; color: string }> = {
  "not-started": { label: "NOT STARTED", color: "bg-muted-foreground/40 text-muted-foreground" },
  "planning": { label: "PLANNING", color: "bg-primary/20 text-primary" },
  "mobilizing": { label: "MOBILIZING", color: "bg-status-at-risk/20 text-status-at-risk" },
  "active": { label: "ACTIVE", color: "bg-status-on-track/20 text-status-on-track" },
  "blocked": { label: "BLOCKED", color: "bg-status-critical/20 text-status-critical" },
  "verified": { label: "VERIFIED", color: "bg-status-verified/20 text-status-verified" },
};

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function RegionsModule() {
  return (
    <div className="border-b border-border">
      <div className="px-4 sm:px-6 py-3 border-b border-border">
        <h2 className="font-display font-semibold text-sm text-foreground">Geographic Activation</h2>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{regions.length} regions tracked</p>
      </div>

      <div className="p-4 sm:p-6">
        {/* Region status overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
          {["active", "mobilizing", "planning", "blocked", "not-started", "verified"].map((status) => {
            const count = regions.filter((r) => r.status === status).length;
            const sm = statusMap[status];
            return (
              <div key={status} className={cn("px-3 py-2 rounded border border-border", count > 0 ? "bg-secondary/30" : "opacity-50")}>
                <div className="text-lg font-mono font-bold text-foreground">{count}</div>
                <div className={cn("text-[8px] font-mono font-bold uppercase tracking-wider", sm.color.split(" ")[1])}>{sm.label}</div>
              </div>
            );
          })}
        </div>

        {/* Region cards */}
        <div className="space-y-2">
          {regions.map((r) => {
            const sm = statusMap[r.status];
            const pct = r.hectaresTarget > 0 ? (r.hectaresRestored / r.hectaresTarget) * 100 : 0;
            return (
              <div key={r.id} className="border border-border rounded p-3 hover:bg-secondary/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-display font-semibold text-foreground">{r.name}</span>
                  <span className={cn("text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider", sm.color)}>
                    {sm.label}
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px] font-mono">
                  <div><span className="text-muted-foreground">Restored</span><div className="text-foreground">{formatNum(r.hectaresRestored)} ha</div></div>
                  <div><span className="text-muted-foreground">Target</span><div className="text-foreground">{formatNum(r.hectaresTarget)} ha</div></div>
                  <div><span className="text-muted-foreground">Partners</span><div className="text-foreground">{r.partners}</div></div>
                  <div><span className="text-muted-foreground">Milestones</span><div className="text-foreground">{r.milestoneCompletion}%</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
