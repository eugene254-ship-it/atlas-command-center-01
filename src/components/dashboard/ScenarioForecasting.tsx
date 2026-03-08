import { missions, type Mission } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { FadeIn } from "./AnimatedComponents";
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from "lucide-react";

function calculateForecasts(mission: Mission) {
  const progressPct = (mission.progress / mission.target) * 100;
  
  // Parse ETA
  const etaMatch = mission.eta.match(/(\d{4})-Q(\d)/);
  const etaYear = etaMatch ? parseInt(etaMatch[1]) : 2030;
  const etaQuarter = etaMatch ? parseInt(etaMatch[2]) : 4;
  const plannedEndMonth = (etaQuarter - 1) * 3 + 2; // middle of quarter
  const plannedEnd = new Date(etaYear, plannedEndMonth, 15);
  
  // Assume mission started ~2 years ago for calculation
  const missionStart = new Date(2024, 0, 1);
  const now = new Date();
  const elapsedMonths = (now.getFullYear() - missionStart.getFullYear()) * 12 + (now.getMonth() - missionStart.getMonth());
  
  // Rate of progress per month
  const monthlyRate = progressPct > 0 && elapsedMonths > 0 ? progressPct / elapsedMonths : 0.5;
  const remainingPct = 100 - progressPct;
  const monthsToComplete = monthlyRate > 0 ? remainingPct / monthlyRate : Infinity;
  
  const projectedEnd = new Date(now);
  projectedEnd.setMonth(projectedEnd.getMonth() + Math.round(monthsToComplete));
  
  // Planned total months
  const plannedTotalMonths = (plannedEnd.getFullYear() - missionStart.getFullYear()) * 12 + (plannedEnd.getMonth() - missionStart.getMonth());
  const projectedTotalMonths = elapsedMonths + Math.round(monthsToComplete);
  
  const varianceMonths = projectedTotalMonths - plannedTotalMonths;
  
  // Optimistic scenario (20% faster)
  const optimisticMonths = Math.round(monthsToComplete * 0.8);
  const optimisticEnd = new Date(now);
  optimisticEnd.setMonth(optimisticEnd.getMonth() + optimisticMonths);
  
  // Pessimistic scenario (30% slower)
  const pessimisticMonths = Math.round(monthsToComplete * 1.3);
  const pessimisticEnd = new Date(now);
  pessimisticEnd.setMonth(pessimisticEnd.getMonth() + pessimisticMonths);
  
  return {
    progressPct,
    monthlyRate: monthlyRate.toFixed(1),
    plannedEnd,
    projectedEnd: isFinite(monthsToComplete) ? projectedEnd : null,
    optimisticEnd: isFinite(monthsToComplete) ? optimisticEnd : null,
    pessimisticEnd: isFinite(monthsToComplete) ? pessimisticEnd : null,
    varianceMonths: isFinite(varianceMonths) ? varianceMonths : null,
    elapsedMonths,
    monthsToComplete: isFinite(monthsToComplete) ? Math.round(monthsToComplete) : null,
  };
}

function formatDate(d: Date | null): string {
  if (!d) return "N/A";
  return `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
}

export function ScenarioForecasting() {
  return (
    <div className="border-t border-border">
      <div className="px-4 sm:px-6 py-3 border-b border-border">
        <h2 className="font-display font-semibold text-sm text-foreground">Scenario Forecasting</h2>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Projected completion at current pace</p>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {missions.map((m, i) => {
          const f = calculateForecasts(m);
          const isLate = f.varianceMonths !== null && f.varianceMonths > 0;
          const isEarly = f.varianceMonths !== null && f.varianceMonths < 0;

          return (
            <FadeIn key={m.id} delay={i * 0.08}>
              <div className="border border-border rounded p-4 hover:bg-secondary/10 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-sm text-foreground truncate">{m.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[9px] font-mono text-muted-foreground">
                      <span>Rate: <span className="text-foreground">{f.monthlyRate}%/mo</span></span>
                      <span>Elapsed: <span className="text-foreground">{f.elapsedMonths}mo</span></span>
                      <span>Remaining: <span className="text-foreground">{f.monthsToComplete !== null ? `${f.monthsToComplete}mo` : "∞"}</span></span>
                    </div>
                  </div>
                  {f.varianceMonths !== null && (
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono font-bold shrink-0",
                      isLate ? "bg-status-critical/10 text-status-critical" :
                      isEarly ? "bg-status-on-track/10 text-status-on-track" :
                      "bg-primary/10 text-primary"
                    )}>
                      {isLate ? <TrendingDown className="w-3 h-3" /> : isEarly ? <TrendingUp className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isLate ? `+${f.varianceMonths}mo` : isEarly ? `${f.varianceMonths}mo` : "On time"}
                    </div>
                  )}
                </div>

                {/* Timeline visualization */}
                <div className="relative">
                  {/* Progress bar */}
                  <div className="h-6 bg-secondary/30 rounded overflow-hidden relative mb-2">
                    {/* Current progress */}
                    <div
                      className="absolute top-0 left-0 h-full bg-primary/50 rounded-l"
                      style={{ width: `${f.progressPct}%` }}
                    />
                    {/* Planned end marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-foreground/60"
                      style={{ left: "70%" }}
                      title="Planned End"
                    />
                    {/* Labels inside bar */}
                    <div className="absolute inset-0 flex items-center px-3 justify-between">
                      <span className="text-[8px] font-mono font-bold text-foreground">{f.progressPct.toFixed(0)}% complete</span>
                    </div>
                  </div>

                  {/* Scenario dates */}
                  <div className="grid grid-cols-4 gap-3 text-[9px] font-mono">
                    <div className="border-l-2 border-foreground/40 pl-2">
                      <div className="text-muted-foreground uppercase text-[7px] tracking-wider">Planned</div>
                      <div className="text-foreground font-medium">{formatDate(f.plannedEnd)}</div>
                    </div>
                    <div className={cn("border-l-2 pl-2", isEarly ? "border-status-on-track" : "border-status-on-track/40")}>
                      <div className="text-muted-foreground uppercase text-[7px] tracking-wider flex items-center gap-1">
                        Optimistic
                        <TrendingUp className="w-2.5 h-2.5 text-status-on-track" />
                      </div>
                      <div className="text-status-on-track font-medium">{formatDate(f.optimisticEnd)}</div>
                    </div>
                    <div className={cn("border-l-2 pl-2", isLate ? "border-status-at-risk" : "border-primary")}>
                      <div className="text-muted-foreground uppercase text-[7px] tracking-wider flex items-center gap-1">
                        Current Pace
                        <Clock className="w-2.5 h-2.5" />
                      </div>
                      <div className={cn("font-medium", isLate ? "text-status-at-risk" : "text-primary")}>{formatDate(f.projectedEnd)}</div>
                    </div>
                    <div className="border-l-2 border-status-critical/40 pl-2">
                      <div className="text-muted-foreground uppercase text-[7px] tracking-wider flex items-center gap-1">
                        Pessimistic
                        <AlertTriangle className="w-2.5 h-2.5 text-status-critical/60" />
                      </div>
                      <div className="text-status-critical/80 font-medium">{formatDate(f.pessimisticEnd)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
