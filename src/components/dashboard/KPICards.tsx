import type { Mission } from "@/lib/mock-data";

interface KPICardsProps {
  mission: Mission;
}

function formatNum(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return n >= 10_000_000 ? `${(n / 1_000_000).toFixed(0)}M` : `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

const kpiDefs = (m: Mission) => [
  { label: "Total Progress", value: `${((m.progress / m.target) * 100).toFixed(1)}%`, sub: `${formatNum(m.progress)} / ${formatNum(m.target)} ${m.unit}` },
  { label: "Funding Raised", value: `$${formatNum(m.fundingRaised)}`, sub: `of $${formatNum(m.fundingTarget)} target` },
  { label: "Active Regions", value: m.activeRegions.toString(), sub: "operational zones" },
  { label: "Active Partners", value: m.activePartners.toString(), sub: "organizations" },
  { label: "Milestones", value: `${m.milestonesComplete}/${m.milestonesTotal}`, sub: `${((m.milestonesComplete / m.milestonesTotal) * 100).toFixed(0)}% complete` },
  { label: "Verification", value: `${m.verificationCoverage}%`, sub: "coverage" },
];

export function KPICards({ mission }: KPICardsProps) {
  const kpis = kpiDefs(mission);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-border">
      {kpis.map((kpi, i) => (
        <div
          key={kpi.label}
          className="px-4 py-3 border-r border-b border-border last:border-r-0 hover:bg-secondary/30 transition-colors"
        >
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
            {kpi.label}
          </div>
          <div className="text-lg font-mono font-bold text-foreground leading-none mb-0.5">
            {kpi.value}
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">
            {kpi.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
