import { useActivityLog, useRealtimeActivityLog, type ActivityLogEntry } from "@/hooks/useDashboardData";
import { cn } from "@/lib/utils";
import { Target, ListChecks, AlertTriangle, Clock, Plus, RefreshCw } from "lucide-react";
import { useState, useCallback } from "react";

const entityIcons: Record<string, typeof Target> = {
  mission: Target,
  milestone: ListChecks,
  blocker: AlertTriangle,
};

const actionColors: Record<string, string> = {
  created: "text-status-on-track",
  updated: "text-primary",
  deleted: "text-status-critical",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ActivityLog() {
  const { data: entries = [], refetch } = useActivityLog();
  const [realtimeEntries, setRealtimeEntries] = useState<ActivityLogEntry[]>([]);

  useRealtimeActivityLog(
    useCallback((entry: ActivityLogEntry) => {
      setRealtimeEntries((prev) => [entry, ...prev].slice(0, 10));
    }, [])
  );

  const allEntries = [...realtimeEntries.filter((e) => !entries.find((x) => x.id === e.id)), ...entries].slice(0, 30);

  return (
    <div className="border-t border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border">
        <div>
          <h2 className="font-display font-semibold text-sm text-foreground">Activity Log</h2>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Recent changes across missions, milestones & blockers
          </p>
        </div>
        <button onClick={() => refetch()} className="p-1.5 rounded hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {allEntries.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Clock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-mono">No activity recorded yet</p>
          </div>
        ) : (
          allEntries.map((entry) => {
            const Icon = entityIcons[entry.entity_type] ?? Plus;
            return (
              <div key={entry.id} className="flex items-start gap-3 px-4 sm:px-6 py-3 hover:bg-secondary/20 transition-colors">
                <div className={cn(
                  "mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0",
                  entry.action === "created" ? "bg-status-on-track/15" : "bg-primary/10"
                )}>
                  <Icon className={cn("w-3.5 h-3.5", actionColors[entry.action] ?? "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">{entry.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {entry.actor && (
                      <span className="text-[9px] font-mono text-muted-foreground">{entry.actor}</span>
                    )}
                    <span className="text-[9px] font-mono text-muted-foreground/60">{timeAgo(entry.created_at)}</span>
                  </div>
                </div>
                <span className={cn(
                  "text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0",
                  entry.entity_type === "mission" ? "bg-primary/10 text-primary" :
                  entry.entity_type === "milestone" ? "bg-status-on-track/10 text-status-on-track" :
                  "bg-status-at-risk/10 text-status-at-risk"
                )}>
                  {entry.entity_type}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}