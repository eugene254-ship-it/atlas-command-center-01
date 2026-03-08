import type { Mission } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { FadeIn } from "./AnimatedComponents";

interface ExecutiveSummaryProps {
  missions: Mission[];
}

const statusConfig = {
  "on-track": { label: "ON TRACK", class: "bg-status-on-track/15 text-status-on-track border-status-on-track/25" },
  "at-risk": { label: "AT RISK", class: "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/25" },
  "delayed": { label: "DELAYED", class: "bg-status-delayed/15 text-status-delayed border-status-delayed/25" },
  "critical": { label: "CRITICAL", class: "bg-status-critical/15 text-status-critical border-status-critical/25" },
};

function formatNum(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function ExecutiveSummary({ missions }: ExecutiveSummaryProps) {
  const totalFundingRaised = missions.reduce((s, m) => s + m.fundingRaised, 0);
  const totalFundingTarget = missions.reduce((s, m) => s + m.fundingTarget, 0);
  const totalRegions = missions.reduce((s, m) => s + m.activeRegions, 0);
  const totalPartners = missions.reduce((s, m) => s + m.activePartners, 0);
  const avgVerification = Math.round(missions.reduce((s, m) => s + m.verificationCoverage, 0) / missions.length);
  const avgConfidence = Math.round(missions.reduce((s, m) => s + m.confidence, 0) / missions.length);

  const byStatus = {
    "on-track": missions.filter(m => m.status === "on-track").length,
    "at-risk": missions.filter(m => m.status === "at-risk").length,
    "delayed": missions.filter(m => m.status === "delayed").length,
    "critical": missions.filter(m => m.status === "critical").length,
  };

  const summaryKPIs = [
    { label: "Total Missions", value: missions.length.toString() },
    { label: "Total Funding", value: `$${formatNum(totalFundingRaised)}`, sub: `of $${formatNum(totalFundingTarget)}` },
    { label: "Active Regions", value: totalRegions.toString() },
    { label: "Partners", value: totalPartners.toString() },
    { label: "Avg Confidence", value: `${avgConfidence}%` },
    { label: "Avg Verification", value: `${avgVerification}%` },
  ];

  return (
    <div className="space-y-0">
      {/* Executive header */}
      <FadeIn>
        <div className="command-ribbon px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">Atlas Sanctum — Executive View</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">
                Portfolio health at a glance · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-foreground">{avgConfidence}%</div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Portfolio Confidence</div>
            </div>
          </div>

          {/* Status distribution */}
          <div className="flex items-center gap-4">
            {(Object.entries(byStatus) as [keyof typeof statusConfig, number][]).map(([status, count]) => {
              const sc = statusConfig[status];
              return (
                <div key={status} className="flex items-center gap-1.5">
                  <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border", sc.class)}>
                    {sc.label}
                  </span>
                  <span className="text-sm font-mono font-bold text-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-border">
        {summaryKPIs.map((kpi, i) => (
          <FadeIn key={kpi.label} delay={i * 0.05}>
            <div className="px-4 py-3 border-r border-b border-border hover:bg-secondary/30 transition-colors">
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
              <div className="text-lg font-mono font-bold text-foreground leading-none mb-0.5">{kpi.value}</div>
              {kpi.sub && <div className="text-[10px] font-mono text-muted-foreground">{kpi.sub}</div>}
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Mission summary cards */}
      <div className="p-4 sm:p-6">
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Mission Health Summary</div>
        <div className="space-y-3">
          {missions.map((m, i) => {
            const sc = statusConfig[m.status];
            const progressPct = (m.progress / m.target) * 100;
            const fundingPct = (m.fundingRaised / m.fundingTarget) * 100;
            const TrendIcon = m.trend === "up" ? TrendingUp : m.trend === "down" ? TrendingDown : Minus;

            return (
              <FadeIn key={m.id} delay={i * 0.08}>
                <div className="border border-border rounded p-4 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-foreground">{m.title}</h3>
                      <span className="text-[10px] font-mono text-muted-foreground">{m.owner} · ETA {m.eta}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border", sc.class)}>
                        {sc.label}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-foreground">{m.confidence}%</span>
                        <TrendIcon className={cn("w-3 h-3 inline ml-1", m.trend === "up" ? "text-status-on-track" : m.trend === "down" ? "text-status-critical" : "text-muted-foreground")} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-[8px] font-mono text-muted-foreground uppercase mb-1">Progress</div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                      <div className="text-[10px] font-mono text-foreground mt-0.5">{progressPct.toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-[8px] font-mono text-muted-foreground uppercase mb-1">Funding</div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary/70 rounded-full" style={{ width: `${fundingPct}%` }} />
                      </div>
                      <div className="text-[10px] font-mono text-foreground mt-0.5">{fundingPct.toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-[8px] font-mono text-muted-foreground uppercase mb-1">Milestones</div>
                      <div className="text-[10px] font-mono text-foreground">{m.milestonesComplete}/{m.milestonesTotal}</div>
                    </div>
                    <div>
                      <div className="text-[8px] font-mono text-muted-foreground uppercase mb-1">Verification</div>
                      <div className="text-[10px] font-mono text-foreground">{m.verificationCoverage}%</div>
                    </div>
                  </div>

                  {m.topBlocker !== "None critical" && (
                    <div className="mt-2 text-[9px] font-mono text-status-at-risk">
                      ⚠ {m.topBlocker}
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
