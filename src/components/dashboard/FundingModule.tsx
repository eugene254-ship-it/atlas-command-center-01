import { fundingSources, fundingFlow } from "@/lib/mock-data";

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

export function FundingModule() {
  const totalCommitted = fundingSources.reduce((s, f) => s + f.committed, 0);
  const totalDisbursed = fundingSources.reduce((s, f) => s + f.disbursed, 0);
  const totalDeployed = fundingSources.reduce((s, f) => s + f.deployed, 0);
  const totalVerified = fundingSources.reduce((s, f) => s + f.verified, 0);
  const target = 500_000_000;

  return (
    <div className="border-b border-border">
      <div className="px-4 sm:px-6 py-3 border-b border-border">
        <h2 className="font-display font-semibold text-sm text-foreground">Funding Progress</h2>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Capital flow tracking</p>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Thermometer */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
            <span>TOTAL RAISED</span>
            <span className="text-foreground">{formatUSD(totalCommitted)} / {formatUSD(target)}</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden relative">
            <div className="h-full bg-primary/70 rounded-full transition-all" style={{ width: `${(totalCommitted / target) * 100}%` }} />
            <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all" style={{ width: `${(totalDisbursed / target) * 100}%` }} />
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-[9px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Disbursed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary/50" /> Committed</span>
            <span className="ml-auto text-status-at-risk">Gap: {formatUSD(target - totalCommitted)}</span>
          </div>
        </div>

        {/* Flow stages */}
        <div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Capital Flow Pipeline</div>
          <div className="flex items-center gap-1">
            {fundingFlow.map((stage, i) => {
              const pct = (stage.amount / fundingFlow[0].amount) * 100;
              return (
                <div key={stage.stage} className="flex-1 text-center">
                  <div className="h-8 bg-secondary/50 rounded relative overflow-hidden mb-1">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary/60 rounded transition-all"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[8px] font-mono text-muted-foreground leading-tight">{stage.stage}</div>
                  <div className="text-[10px] font-mono font-bold text-foreground">{formatUSD(stage.amount)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sources breakdown */}
        <div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">By Source</div>
          <div className="space-y-1.5">
            {fundingSources.map((f) => (
              <div key={f.source} className="flex items-center gap-3">
                <span className="text-[10px] font-display text-foreground w-36 truncate shrink-0">{f.source}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary/70 rounded-full" style={{ width: `${(f.disbursed / f.committed) * 100}%` }} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-16 text-right shrink-0">{formatUSD(f.committed)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
