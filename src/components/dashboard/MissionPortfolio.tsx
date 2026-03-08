import type { Mission } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { CreateMissionDialog } from "./CreateMissionDialog";

interface MissionPortfolioProps {
  missions: Mission[];
  selectedId: string;
  onSelect: (m: Mission) => void;
  onDrillDown?: (m: Mission) => void;
  canEdit?: boolean;
}

const statusBadge = {
  "on-track": "bg-status-on-track/15 text-status-on-track",
  "at-risk": "bg-status-at-risk/15 text-status-at-risk",
  "delayed": "bg-status-delayed/15 text-status-delayed",
  "critical": "bg-status-critical/15 text-status-critical",
};

export function MissionPortfolio({ missions, selectedId, onSelect, onDrillDown, canEdit }: MissionPortfolioProps) {
  const [view, setView] = useState<"grid" | "table">("grid");

  return (
    <div className="border-t border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border">
        <div>
          <h2 className="font-display font-semibold text-sm text-foreground">Mission Portfolio</h2>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{missions.length} active missions</p>
        </div>
        <div className="flex items-center gap-1 bg-secondary/50 rounded p-0.5">
          <button onClick={() => setView("grid")} className={cn("p-1.5 rounded", view === "grid" ? "bg-primary/15 text-primary" : "text-muted-foreground")}>
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setView("table")} className={cn("p-1.5 rounded", view === "table" ? "bg-primary/15 text-primary" : "text-muted-foreground")}>
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-0">
          {missions.map((m) => {
            const TrendIcon = m.trend === "up" ? TrendingUp : m.trend === "down" ? TrendingDown : Minus;
            return (
              <div
                key={m.id}
                onClick={() => onSelect(m)}
                className={cn(
                  "text-left p-4 border-r border-b border-border hover:bg-secondary/30 transition-all cursor-pointer",
                  selectedId === m.id && "bg-primary/5 border-l-2 border-l-primary"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-sm text-foreground leading-tight line-clamp-2">{m.title}</h3>
                  <TrendIcon className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", m.trend === "up" ? "text-status-on-track" : m.trend === "down" ? "text-status-critical" : "text-muted-foreground")} />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider", statusBadge[m.status])}>
                    {m.status.replace("-", " ")}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">{m.owner}</span>
                </div>

                {/* Mini progress */}
                <div className="h-1 bg-secondary rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(m.progress / m.target) * 100}%` }} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono mb-2">
                  <div>
                    <span className="text-muted-foreground">Progress</span>
                    <div className="text-foreground font-medium">{((m.progress / m.target) * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Funding</span>
                    <div className="text-foreground font-medium">{((m.fundingRaised / m.fundingTarget) * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Verified</span>
                    <div className="text-foreground font-medium">{m.verificationCoverage}%</div>
                  </div>
                </div>

                {onDrillDown && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDrillDown(m); }}
                    className="text-[9px] font-mono text-primary hover:text-primary/80 transition-colors"
                  >
                    View Details →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-4 py-2 font-medium">Mission</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
                <th className="text-right px-3 py-2 font-medium">Progress</th>
                <th className="text-right px-3 py-2 font-medium">Funding</th>
                <th className="text-right px-3 py-2 font-medium">Regions</th>
                <th className="text-right px-3 py-2 font-medium">Milestones</th>
                <th className="text-right px-3 py-2 font-medium">Verified</th>
                <th className="text-left px-3 py-2 font-medium">Risk</th>
                <th className="text-left px-4 py-2 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => onSelect(m)}
                  className={cn(
                    "border-b border-border cursor-pointer hover:bg-secondary/30 transition-colors",
                    selectedId === m.id && "bg-primary/5"
                  )}
                >
                  <td className="px-4 py-2.5 font-display font-medium text-foreground max-w-[200px] truncate">{m.title}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider", statusBadge[m.status])}>
                      {m.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-foreground">{((m.progress / m.target) * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2.5 text-right font-mono text-foreground">{((m.fundingRaised / m.fundingTarget) * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2.5 text-right font-mono text-foreground">{m.activeRegions}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-foreground">{m.milestonesComplete}/{m.milestonesTotal}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-foreground">{m.verificationCoverage}%</td>
                  <td className="px-3 py-2.5">{m.topBlocker !== "None critical" ? <span className="text-status-at-risk">⚠</span> : <span className="text-status-on-track">✓</span>}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{m.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
