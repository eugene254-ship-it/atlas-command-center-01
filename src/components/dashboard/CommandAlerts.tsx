import { alerts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, Zap } from "lucide-react";
import { StaggerChildren, StaggerItem } from "./AnimatedComponents";

const severityConfig = {
  critical: { icon: Zap, class: "text-status-critical", bg: "bg-status-critical/10 border-status-critical/20" },
  high: { icon: AlertTriangle, class: "text-status-at-risk", bg: "bg-status-at-risk/10 border-status-at-risk/20" },
  medium: { icon: AlertCircle, class: "text-status-delayed", bg: "bg-status-delayed/10 border-status-delayed/20" },
  low: { icon: Info, class: "text-muted-foreground", bg: "bg-secondary/50 border-border" },
};

export function CommandAlerts() {
  return (
    <div className="border-b border-border">
      <div className="px-4 sm:px-6 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-sm text-foreground">Command Feed</h2>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Strategic alerts</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-critical/10">
          <div className="w-1.5 h-1.5 rounded-full bg-status-critical animate-pulse" />
          <span className="text-[9px] font-mono text-status-critical font-bold">
            {alerts.filter((a) => a.severity === "critical").length} CRITICAL
          </span>
        </div>
      </div>

      <StaggerChildren className="divide-y divide-border max-h-[480px] overflow-y-auto" staggerDelay={0.06}>
        {alerts.map((alert) => {
          const sc = severityConfig[alert.severity];
          const Icon = sc.icon;
          return (
            <StaggerItem key={alert.id}>
              <div className="px-4 py-3 hover:bg-secondary/20 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className={cn("mt-0.5 p-1 rounded border", sc.bg)}>
                    <Icon className={cn("w-3 h-3", sc.class)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn("text-[8px] font-mono font-bold uppercase tracking-wider", sc.class)}>
                        {alert.severity}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-foreground leading-snug mb-1">{alert.message}</p>
                    <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground">
                      <span>{alert.mission}</span>
                      <span>·</span>
                      <span>{alert.region}</span>
                    </div>
                    <div className="mt-1.5 text-[9px] font-mono text-primary/80">
                      → {alert.action}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerChildren>
    </div>
  );
}
