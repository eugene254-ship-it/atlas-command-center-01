import { verificationData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function VerificationModule() {
  const funnel = [
    { label: "Claimed", value: verificationData.claimed },
    { label: "Submitted", value: verificationData.submitted },
    { label: "Reviewed", value: verificationData.reviewed },
    { label: "Verified", value: verificationData.verified },
    { label: "Audited", value: verificationData.audited },
  ];

  return (
    <div className="border-t border-border">
      <div className="px-4 sm:px-6 py-3 border-b border-border">
        <h2 className="font-display font-semibold text-sm text-foreground">Outcome Verification</h2>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Trust & evidence layer</p>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Verification funnel */}
        <div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Verification Funnel</div>
          <div className="flex items-end gap-1 h-24">
            {funnel.map((stage, i) => {
              const height = (stage.value / funnel[0].value) * 100;
              return (
                <div key={stage.label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono font-bold text-foreground">{formatNum(stage.value)}</span>
                  <div className="w-full relative" style={{ height: `${height}%` }}>
                    <div className={cn(
                      "absolute inset-0 rounded-t",
                      i === funnel.length - 1 ? "bg-status-verified/60" : "bg-primary/40"
                    )} />
                  </div>
                  <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-wider text-center leading-tight">{stage.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confidence scores */}
        <div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Outcome Confidence</div>
          <div className="space-y-2">
            {verificationData.outcomes.map((o) => (
              <div key={o.metric} className="flex items-center gap-3">
                <span className="text-[10px] font-display text-foreground w-40 shrink-0">{o.metric}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", o.confidence >= 85 ? "bg-status-on-track" : o.confidence >= 70 ? "bg-status-at-risk" : "bg-status-delayed")}
                    style={{ width: `${o.confidence}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-foreground w-10 text-right">{o.confidence}%</span>
                <div className="text-[9px] font-mono text-muted-foreground w-24 text-right hidden sm:block">
                  <span className="text-foreground">{o.verified}</span> / {o.claimed}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disputes */}
        <div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Dispute / Anomaly Log</div>
          <div className="space-y-2">
            {verificationData.disputes.map((d, i) => (
              <div key={i} className="border border-status-critical/20 bg-status-critical/5 rounded p-3">
                <div className="text-xs font-display text-foreground mb-1">{d.metric}</div>
                <div className="flex items-center gap-4 text-[10px] font-mono">
                  <span className="text-muted-foreground">Reported: <span className="text-foreground">{d.reported}</span></span>
                  <span className="text-muted-foreground">Verified: <span className="text-status-at-risk">{d.verified}</span></span>
                  <span className="text-status-critical font-bold">{d.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
