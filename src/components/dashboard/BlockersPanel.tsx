import { cn } from "@/lib/utils";
import { AlertTriangle, Zap, AlertCircle } from "lucide-react";
import { useBlockers } from "@/hooks/useDashboardData";
import { CreateBlockerDialog } from "./CreateBlockerDialog";
import type { Mission } from "@/lib/mock-data";

const severityIcon = {
  critical: Zap,
  high: AlertTriangle,
  medium: AlertCircle,
  low: AlertCircle,
};

interface BlockersPanelProps {
  missions?: Mission[];
  canEdit?: boolean;
}

export function BlockersPanel({ missions, canEdit }: BlockersPanelProps) {
  const { data: blockers = [] } = useBlockers();

  return (
    <div className="border-b border-border">
      <div className="px-4 sm:px-6 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-sm text-foreground">Active Blockers</h2>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            {blockers.length} unresolved · {blockers.filter(b => b.severity === "critical").length} critical
          </p>
        </div>
        {canEdit && <CreateBlockerDialog missions={missions} />}
      </div>

      <div className="divide-y divide-border">
        {blockers.map((b) => {
          const Icon = severityIcon[b.severity as keyof typeof severityIcon] ?? AlertCircle;
          return (
            <div key={b.id} className="px-4 py-3 hover:bg-secondary/20 transition-colors">
              <div className="flex items-start gap-2.5">
                <Icon className={cn(
                  "w-3.5 h-3.5 mt-0.5 shrink-0",
                  b.severity === "critical" ? "text-status-critical" :
                  b.severity === "high" ? "text-status-at-risk" : "text-status-delayed"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-display text-foreground mb-0.5">{b.title}</div>
                  <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground">
                    <span>{b.owner}</span>
                    <span className="text-status-at-risk">{b.daysUnresolved}d unresolved</span>
                    <span>{b.affectedMilestones} milestones affected</span>
                  </div>
                  {b.action && <div className="mt-1 text-[9px] font-mono text-primary/80">→ {b.action}</div>}
                </div>
              </div>
            </div>
          );
        })}
        {blockers.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground font-mono">No active blockers</div>
        )}
      </div>
    </div>
  );
}
