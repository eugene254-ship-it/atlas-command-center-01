import { useActivityLog, useRealtimeActivityLog, type ActivityLogEntry } from "@/hooks/useDashboardData";
import { cn } from "@/lib/utils";
import { Target, ListChecks, AlertTriangle, Clock, Plus, RefreshCw, Filter } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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

const ENTITY_TYPES = ["mission", "milestone", "blocker"] as const;

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
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(ENTITY_TYPES));
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  useRealtimeActivityLog(
    useCallback((entry: ActivityLogEntry) => {
      setRealtimeEntries((prev) => [entry, ...prev].slice(0, 10));
    }, [])
  );

  const allEntries = useMemo(() => {
    const merged = [...realtimeEntries.filter((e) => !entries.find((x) => x.id === e.id)), ...entries].slice(0, 30);
    return merged.filter((e) => {
      if (!activeTypes.has(e.entity_type)) return false;
      if (dateFrom && new Date(e.created_at) < dateFrom) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (new Date(e.created_at) > end) return false;
      }
      return true;
    });
  }, [realtimeEntries, entries, activeTypes, dateFrom, dateTo]);

  const toggleType = (t: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) { if (next.size > 1) next.delete(t); } else next.add(t);
      return next;
    });
  };

  const hasFilters = activeTypes.size < ENTITY_TYPES.length || dateFrom || dateTo;

  return (
    <div className="border-t border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border">
        <div>
          <h2 className="font-display font-semibold text-sm text-foreground">Activity Log</h2>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Recent changes across missions, milestones & blockers
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => refetch()} className="p-1.5 rounded hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 py-2 border-b border-border bg-secondary/20">
        <Filter className="w-3 h-3 text-muted-foreground shrink-0" />
        {ENTITY_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => toggleType(t)}
            className={cn(
              "text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-colors",
              activeTypes.has(t)
                ? t === "mission" ? "bg-primary/15 text-primary" : t === "milestone" ? "bg-status-on-track/15 text-status-on-track" : "bg-status-at-risk/15 text-status-at-risk"
                : "bg-secondary/50 text-muted-foreground"
            )}
          >
            {t}s
          </button>
        ))}
        <span className="text-muted-foreground/40 text-[9px]">|</span>
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors">
              {dateFrom ? format(dateFrom, "MMM d") : "From"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground/40 text-[9px]">–</span>
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors">
              {dateTo ? format(dateTo, "MMM d") : "To"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
        {hasFilters && (
          <button
            onClick={() => { setActiveTypes(new Set(ENTITY_TYPES)); setDateFrom(undefined); setDateTo(undefined); }}
            className="text-[9px] font-mono text-destructive hover:underline ml-auto"
          >
            Clear
          </button>
        )}
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