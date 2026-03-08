import type { Mission } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MissionOverviewProps {
  mission: Mission;
}

const statusConfig = {
  "on-track": { label: "ON TRACK", class: "bg-status-on-track/15 text-status-on-track border-status-on-track/25" },
  "at-risk": { label: "AT RISK", class: "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/25" },
  "delayed": { label: "DELAYED", class: "bg-status-delayed/15 text-status-delayed border-status-delayed/25" },
  "critical": { label: "CRITICAL", class: "bg-status-critical/15 text-status-critical border-status-critical/25 animate-pulse-glow" },
};

export function MissionOverview({ mission }: MissionOverviewProps) {
  const sc = statusConfig[mission.status];
  const progressPct = (mission.progress / mission.target) * 100;
  const TrendIcon = mission.trend === "up" ? TrendingUp : mission.trend === "down" ? TrendingDown : Minus;

  return (
    <div className="command-ribbon px-4 sm:px-6 py-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-2 min-w-0 flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            <span>Mission Control</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">{mission.priority}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{mission.phase}</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-xl sm:text-2xl text-foreground leading-tight">
            {mission.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Owner: <span className="text-foreground">{mission.owner}</span></span>
            <span>ETA: <span className="text-foreground font-mono">{mission.eta}</span></span>
            <span className={cn("font-mono", mission.etaVariance.startsWith("+") ? "text-status-at-risk" : "text-status-on-track")}>
              {mission.etaVariance}
            </span>
          </div>
        </div>

        {/* Status & Confidence */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={cn("px-3 py-1.5 rounded border text-[11px] font-bold tracking-widest font-mono", sc.class)}>
            {sc.label}
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-foreground leading-none">
              {mission.confidence}%
            </div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5 flex items-center gap-1 justify-center">
              Confidence
              <TrendIcon className={cn("w-3 h-3", mission.trend === "up" ? "text-status-on-track" : mission.trend === "down" ? "text-status-critical" : "text-muted-foreground")} />
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
          <span>MISSION PROGRESS</span>
          <span className="text-foreground">{progressPct.toFixed(1)}% — {(mission.progress / 1000000).toFixed(1)}M / {(mission.target / 1000000).toFixed(0)}M {mission.unit}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 relative"
            style={{ width: `${progressPct}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
