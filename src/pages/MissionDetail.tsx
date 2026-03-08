import { useParams, Link } from "react-router-dom";
import { useMissions, useMilestones, useFundingSources, useVerificationRecords, useVerificationDisputes, useBlockers } from "@/hooks/useDashboardData";
import { cn } from "@/lib/utils";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { FadeIn, AnimatedProgress } from "@/components/dashboard/AnimatedComponents";

const statusConfig: Record<string, { label: string; class: string }> = {
  "on-track": { label: "ON TRACK", class: "bg-status-on-track/15 text-status-on-track border-status-on-track/25" },
  "at-risk": { label: "AT RISK", class: "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/25" },
  "delayed": { label: "DELAYED", class: "bg-status-delayed/15 text-status-delayed border-status-delayed/25" },
  "critical": { label: "CRITICAL", class: "bg-status-critical/15 text-status-critical border-status-critical/25" },
};

const msStatusConfig: Record<string, { label: string; class: string; bg: string }> = {
  "not-started": { label: "NOT STARTED", class: "text-muted-foreground", bg: "bg-muted-foreground/40" },
  "in-progress": { label: "IN PROGRESS", class: "text-primary", bg: "bg-primary" },
  "blocked": { label: "BLOCKED", class: "text-status-critical", bg: "bg-status-critical" },
  "delayed": { label: "DELAYED", class: "text-status-delayed", bg: "bg-status-delayed" },
  "completed": { label: "COMPLETED", class: "text-status-on-track", bg: "bg-status-on-track" },
  "verified": { label: "VERIFIED", class: "text-status-verified", bg: "bg-status-verified" },
};

function formatNum(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export default function MissionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: missions, isLoading: loadingMissions } = useMissions();
  const { data: milestones } = useMilestones(id);
  const { data: funding } = useFundingSources();
  const { data: verRecords } = useVerificationRecords(id);
  const { data: disputes } = useVerificationDisputes(id);
  const { data: blockers } = useBlockers();

  const mission = missions?.find((m) => m.id === id);

  if (loadingMissions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm font-mono text-muted-foreground animate-pulse">Loading mission...</div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <div className="text-sm font-mono text-muted-foreground">Mission not found</div>
        <Link to="/" className="text-xs font-mono text-primary hover:underline">← Back to dashboard</Link>
      </div>
    );
  }

  const sc = statusConfig[mission.status] ?? statusConfig["on-track"];
  const progressPct = (mission.progress / mission.target) * 100;
  const TrendIcon = mission.trend === "up" ? TrendingUp : mission.trend === "down" ? TrendingDown : Minus;
  const _missionBlockers = blockers?.filter((b) => b.action) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            <span>Mission Control</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">{mission.priority}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[200px]">{mission.title}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Mission overview */}
        <FadeIn>
          <div className="command-ribbon px-4 sm:px-6 py-5">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <h1 className="font-display font-bold text-xl sm:text-2xl text-foreground leading-tight">{mission.title}</h1>
                <p className="text-xs text-muted-foreground">{mission.objective}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Owner: <span className="text-foreground">{mission.owner}</span></span>
                  <span>Phase: <span className="text-foreground">{mission.phase}</span></span>
                  <span>ETA: <span className="text-foreground font-mono">{mission.eta}</span></span>
                  <span className={cn("font-mono", mission.etaVariance.startsWith("+") ? "text-status-at-risk" : "text-status-on-track")}>
                    {mission.etaVariance}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={cn("px-3 py-1.5 rounded border text-[11px] font-bold tracking-widest font-mono", sc.class)}>{sc.label}</span>
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-foreground leading-none">{mission.confidence}%</div>
                  <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5 flex items-center gap-1 justify-center">
                    Confidence
                    <TrendIcon className={cn("w-3 h-3", mission.trend === "up" ? "text-status-on-track" : mission.trend === "down" ? "text-status-critical" : "text-muted-foreground")} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                <span>MISSION PROGRESS</span>
                <span className="text-foreground">{progressPct.toFixed(1)}% — {formatNum(mission.progress)} / {formatNum(mission.target)} {mission.unit}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <AnimatedProgress value={progressPct} className="h-full rounded-full bg-primary" delay={0.3} />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-border">
          {[
            { label: "Progress", value: `${progressPct.toFixed(0)}%` },
            { label: "Funding", value: `$${formatNum(mission.fundingRaised)}`, sub: `of $${formatNum(mission.fundingTarget)}` },
            { label: "Regions", value: mission.activeRegions.toString() },
            { label: "Partners", value: mission.activePartners.toString() },
            { label: "Milestones", value: `${mission.milestonesComplete}/${mission.milestonesTotal}` },
            { label: "Verification", value: `${mission.verificationCoverage}%` },
          ].map((kpi) => (
            <div key={kpi.label} className="px-4 py-3 border-r border-b border-border">
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
              <div className="text-lg font-mono font-bold text-foreground leading-none">{kpi.value}</div>
              {kpi.sub && <div className="text-[10px] font-mono text-muted-foreground">{kpi.sub}</div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-0">
          {/* Milestones */}
          <div className="xl:col-span-2 border-r border-border">
            <div className="px-4 sm:px-6 py-3 border-b border-border">
              <h2 className="font-display font-semibold text-sm text-foreground">Milestones</h2>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{milestones?.length ?? 0} tracked</p>
            </div>
            <div className="p-4 sm:p-6 space-y-2">
              {milestones?.map((ms) => {
                const msc = msStatusConfig[ms.status] ?? msStatusConfig["not-started"];
                return (
                  <div key={ms.id} className="border border-border rounded p-3 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-display font-semibold text-foreground">{ms.name}</span>
                      <span className={cn("text-[8px] font-mono font-bold uppercase tracking-wider", msc.class)}>{msc.label}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-1.5">
                      <div className={cn("h-full rounded-full", msc.bg)} style={{ width: `${ms.actualProgress}%`, opacity: 0.7 }} />
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground">
                      <span>{ms.owner}</span>
                      <span>{ms.plannedStart} → {ms.plannedEnd}</span>
                      <span className="text-foreground font-bold">{ms.actualProgress}%</span>
                    </div>
                  </div>
                );
              })}
              {(!milestones || milestones.length === 0) && (
                <div className="text-center py-8 text-xs text-muted-foreground font-mono">No milestones for this mission</div>
              )}
            </div>
          </div>

          {/* Sidebar: blockers + verification */}
          <div>
            {/* Top blocker */}
            {mission.topBlocker && mission.topBlocker !== "None critical" && (
              <div className="px-4 py-3 border-b border-border bg-status-critical/5">
                <div className="text-[8px] font-mono text-status-critical uppercase tracking-widest mb-1">Top Blocker</div>
                <div className="text-xs text-foreground">{mission.topBlocker}</div>
              </div>
            )}

            {/* Verification records */}
            <div className="px-4 sm:px-6 py-3 border-b border-border">
              <h2 className="font-display font-semibold text-sm text-foreground">Verification Evidence</h2>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{verRecords?.length ?? 0} records</p>
            </div>
            <div className="p-4 space-y-2">
              {verRecords?.map((r) => (
                <div key={r.id} className="border border-border rounded p-3">
                  <div className="text-xs font-display text-foreground mb-1">{r.metric}</div>
                  <div className="flex items-center gap-3 text-[9px] font-mono">
                    <span className="text-muted-foreground">Claimed: <span className="text-foreground">{r.claimed}</span></span>
                    <span className="text-muted-foreground">Verified: <span className="text-status-on-track">{r.verified}</span></span>
                    <span className="text-foreground font-bold">{r.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Disputes */}
            {disputes && disputes.length > 0 && (
              <>
                <div className="px-4 sm:px-6 py-3 border-b border-border">
                  <h2 className="font-display font-semibold text-sm text-foreground">Disputes</h2>
                </div>
                <div className="p-4 space-y-2">
                  {disputes.map((d) => (
                    <div key={d.id} className="border border-status-critical/20 bg-status-critical/5 rounded p-3">
                      <div className="text-xs font-display text-foreground mb-1">{d.metric}</div>
                      <div className="flex items-center gap-3 text-[10px] font-mono">
                        <span className="text-muted-foreground">Reported: <span className="text-foreground">{d.reported}</span></span>
                        <span className="text-muted-foreground">Verified: <span className="text-status-at-risk">{d.verified}</span></span>
                        <span className="text-status-critical font-bold">{d.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Funding for this mission */}
            <div className="px-4 sm:px-6 py-3 border-b border-border">
              <h2 className="font-display font-semibold text-sm text-foreground">Funding Sources</h2>
            </div>
            <div className="p-4 space-y-2">
              {funding?.map((f) => (
                <div key={f.source} className="flex items-center gap-3">
                  <span className="text-[10px] font-display text-foreground w-32 truncate shrink-0">{f.source}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary/70 rounded-full" style={{ width: `${f.committed > 0 ? (f.disbursed / f.committed) * 100 : 0}%` }} />
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground w-14 text-right">${formatNum(f.committed)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
