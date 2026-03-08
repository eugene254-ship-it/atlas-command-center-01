import { milestones } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface MilestoneTrackerProps {
  missionId: string;
}

const statusConfig: Record<string, { label: string; class: string; bg: string }> = {
  "not-started": { label: "NOT STARTED", class: "text-muted-foreground", bg: "bg-status-not-started" },
  "in-progress": { label: "IN PROGRESS", class: "text-primary", bg: "bg-primary" },
  "blocked": { label: "BLOCKED", class: "text-status-critical", bg: "bg-status-critical" },
  "delayed": { label: "DELAYED", class: "text-status-delayed", bg: "bg-status-delayed" },
  "completed": { label: "COMPLETED", class: "text-status-on-track", bg: "bg-status-on-track" },
  "verified": { label: "VERIFIED", class: "text-status-verified", bg: "bg-status-verified" },
};

export function MilestoneTracker({ missionId }: MilestoneTrackerProps) {
  const missionMilestones = milestones.filter((m) => m.missionId === missionId);

  return (
    <div className="border-b border-border">
      <div className="px-4 sm:px-6 py-3 border-b border-border">
        <h2 className="font-display font-semibold text-sm text-foreground">Milestone Execution Tracker</h2>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          {missionMilestones.length} milestones · Gantt timeline
        </p>
      </div>

      <div className="p-4 sm:p-6 space-y-2 overflow-x-auto">
        {/* Timeline header */}
        <div className="flex items-center gap-3 text-[8px] font-mono text-muted-foreground uppercase tracking-widest mb-3 pl-[200px] sm:pl-[280px]">
          <span className="w-20 text-center">2024</span>
          <span className="w-20 text-center">2025</span>
          <span className="w-20 text-center">2026</span>
          <span className="w-20 text-center">2027</span>
          <span className="w-20 text-center">2028+</span>
        </div>

        {missionMilestones.map((ms) => {
          const sc = statusConfig[ms.status];
          return (
            <div key={ms.id} className="flex items-center gap-3 group">
              {/* Name & status */}
              <div className="w-[200px] sm:w-[280px] shrink-0 pr-3">
                <div className="text-xs font-display text-foreground leading-tight truncate">{ms.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn("text-[8px] font-mono font-bold uppercase tracking-wider", sc.class)}>
                    {sc.label}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">{ms.owner}</span>
                </div>
              </div>

              {/* Gantt bar */}
              <div className="flex-1 min-w-[400px]">
                <div className="relative h-6 bg-secondary/30 rounded overflow-hidden">
                  {/* Background bar (planned) */}
                  <div
                    className="absolute top-0 left-0 h-full bg-secondary/50 rounded"
                    style={{ width: "100%" }}
                  />
                  {/* Progress bar */}
                  <div
                    className={cn("absolute top-0 left-0 h-full rounded transition-all duration-700", sc.bg)}
                    style={{ width: `${ms.actualProgress}%`, opacity: 0.7 }}
                  />
                  {/* Progress text */}
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-[9px] font-mono font-bold text-foreground">
                      {ms.actualProgress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {missionMilestones.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground font-mono">
            No milestones found for this mission
          </div>
        )}
      </div>
    </div>
  );
}
