import { partners } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PartnersModule() {
  return (
    <div className="border-b border-border">
      <div className="px-4 sm:px-6 py-3 border-b border-border">
        <h2 className="font-display font-semibold text-sm text-foreground">Partner Contributions</h2>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{partners.length} organizations</p>
      </div>

      <div className="divide-y divide-border">
        {partners.map((p) => (
          <div key={p.id} className="px-4 sm:px-6 py-3 hover:bg-secondary/20 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-display font-semibold text-foreground">{p.name}</span>
                  <span className={cn(
                    "text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                    p.status === "active" ? "bg-status-on-track/15 text-status-on-track" :
                    p.status === "inactive" ? "bg-status-critical/15 text-status-critical" :
                    "bg-status-at-risk/15 text-status-at-risk"
                  )}>
                    {p.status}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">{p.role} · {p.contributionType}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-mono font-bold text-foreground">{p.reliability}%</div>
                <div className="text-[8px] font-mono text-muted-foreground uppercase">reliability</div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground mb-0.5">
                  <span>Deliverables</span>
                  <span>{p.fulfilled}/{p.deliverables}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(p.fulfilled / p.deliverables) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground shrink-0">{p.lastActivity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
