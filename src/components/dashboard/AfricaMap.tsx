import { regions, type Region } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FadeIn } from "./AnimatedComponents";

const statusColors: Record<string, string> = {
  "not-started": "fill-muted-foreground/20 stroke-muted-foreground/40",
  "planning": "fill-primary/20 stroke-primary/50",
  "mobilizing": "fill-status-at-risk/20 stroke-status-at-risk/50",
  "active": "fill-status-on-track/20 stroke-status-on-track/50",
  "blocked": "fill-status-critical/20 stroke-status-critical/50",
  "verified": "fill-status-verified/20 stroke-status-verified/50",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  "not-started": { label: "NOT STARTED", color: "text-muted-foreground" },
  "planning": { label: "PLANNING", color: "text-primary" },
  "mobilizing": { label: "MOBILIZING", color: "text-status-at-risk" },
  "active": { label: "ACTIVE", color: "text-status-on-track" },
  "blocked": { label: "BLOCKED", color: "text-status-critical" },
  "verified": { label: "VERIFIED", color: "text-status-verified" },
};

// Simplified Africa region polygons (SVG paths)
const regionPaths: Record<string, { path: string; labelX: number; labelY: number }> = {
  "East Africa": {
    path: "M 320 180 L 360 160 L 390 180 L 400 220 L 390 270 L 370 300 L 340 310 L 310 280 L 300 240 L 310 200 Z",
    labelX: 345, labelY: 240,
  },
  "West Africa": {
    path: "M 100 180 L 150 160 L 200 170 L 230 190 L 240 230 L 220 260 L 180 270 L 140 260 L 110 240 L 90 210 Z",
    labelX: 165, labelY: 220,
  },
  "Southern Africa": {
    path: "M 240 320 L 290 300 L 340 310 L 360 340 L 350 380 L 320 410 L 280 420 L 240 400 L 220 370 L 230 340 Z",
    labelX: 290, labelY: 365,
  },
  "Sahel Belt": {
    path: "M 120 120 L 180 100 L 260 105 L 330 115 L 350 140 L 320 160 L 260 165 L 200 160 L 140 155 L 110 140 Z",
    labelX: 235, labelY: 135,
  },
  "Horn of Africa": {
    path: "M 390 150 L 430 130 L 460 145 L 470 180 L 450 210 L 420 220 L 400 200 L 390 175 Z",
    labelX: 430, labelY: 175,
  },
  "Central Africa": {
    path: "M 230 200 L 280 190 L 310 210 L 320 250 L 300 280 L 270 290 L 240 280 L 225 250 L 220 225 Z",
    labelX: 270, labelY: 245,
  },
};

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function AfricaMap() {
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const activeRegion = selectedRegion || hoveredRegion;

  return (
    <div className="border-b border-border">
      <div className="px-4 sm:px-6 py-3 border-b border-border">
        <h2 className="font-display font-semibold text-sm text-foreground">Geographic Activation Map</h2>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Interactive operations map</p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <FadeIn className="lg:col-span-2">
            <div className="relative bg-secondary/20 rounded border border-border overflow-hidden">
              <svg
                viewBox="60 80 440 370"
                className="w-full h-auto"
                style={{ maxHeight: "420px" }}
              >
                {/* Grid pattern */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.3" />
                  </pattern>
                </defs>
                <rect x="60" y="80" width="440" height="370" fill="url(#grid)" />

                {/* Region shapes */}
                {regions.map((region) => {
                  const geo = regionPaths[region.name];
                  if (!geo) return null;
                  const isHovered = activeRegion?.id === region.id;
                  const sc = statusColors[region.status];

                  return (
                    <g
                      key={region.id}
                      onMouseEnter={() => setHoveredRegion(region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(selectedRegion?.id === region.id ? null : region)}
                      className="cursor-pointer transition-all"
                    >
                      <path
                        d={geo.path}
                        className={cn(sc, "transition-all duration-200")}
                        strokeWidth={isHovered ? 2 : 1}
                        opacity={isHovered ? 1 : 0.8}
                      />
                      {/* Pulse dot for active regions */}
                      {(region.status === "active" || region.status === "mobilizing") && (
                        <circle
                          cx={geo.labelX}
                          cy={geo.labelY - 15}
                          r="3"
                          className={region.status === "active" ? "fill-status-on-track" : "fill-status-at-risk"}
                          opacity="0.8"
                        >
                          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {/* Label */}
                      <text
                        x={geo.labelX}
                        y={geo.labelY}
                        textAnchor="middle"
                        className="fill-foreground text-[9px] font-mono pointer-events-none"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {region.name}
                      </text>
                      <text
                        x={geo.labelX}
                        y={geo.labelY + 12}
                        textAnchor="middle"
                        className={cn("text-[7px] font-mono pointer-events-none", statusLabels[region.status]?.color)}
                        style={{ fontFamily: "var(--font-mono)" }}
                        fill="currentColor"
                      >
                        {statusLabels[region.status]?.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
                {Object.entries(statusLabels).map(([key, { label, color }]) => (
                  <div key={key} className="flex items-center gap-1">
                    <div className={cn("w-2 h-2 rounded-full", 
                      key === "active" ? "bg-status-on-track" :
                      key === "mobilizing" ? "bg-status-at-risk" :
                      key === "blocked" ? "bg-status-critical" :
                      key === "planning" ? "bg-primary" :
                      key === "verified" ? "bg-status-verified" :
                      "bg-muted-foreground/40"
                    )} />
                    <span className={cn("text-[7px] font-mono uppercase tracking-wider", color)}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Detail panel */}
          <div className="space-y-3">
            {activeRegion ? (
              <FadeIn key={activeRegion.id}>
                <div className="border border-border rounded p-4 bg-secondary/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-sm text-foreground">{activeRegion.name}</h3>
                    <span className={cn(
                      "text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                      activeRegion.status === "active" ? "bg-status-on-track/20 text-status-on-track" :
                      activeRegion.status === "blocked" ? "bg-status-critical/20 text-status-critical" :
                      activeRegion.status === "mobilizing" ? "bg-status-at-risk/20 text-status-at-risk" :
                      "bg-primary/20 text-primary"
                    )}>
                      {statusLabels[activeRegion.status]?.label}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-[8px] font-mono text-muted-foreground uppercase mb-1">Restoration Progress</div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${activeRegion.hectaresTarget > 0 ? (activeRegion.hectaresRestored / activeRegion.hectaresTarget) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono text-foreground">
                        {formatNum(activeRegion.hectaresRestored)} / {formatNum(activeRegion.hectaresTarget)} ha
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[8px] font-mono text-muted-foreground uppercase">Partners</div>
                        <div className="text-lg font-mono font-bold text-foreground">{activeRegion.partners}</div>
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-muted-foreground uppercase">Funds Deployed</div>
                        <div className="text-lg font-mono font-bold text-foreground">${formatNum(activeRegion.fundsDeployed)}</div>
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-muted-foreground uppercase">Milestones</div>
                        <div className="text-lg font-mono font-bold text-foreground">{activeRegion.milestoneCompletion}%</div>
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-muted-foreground uppercase">Coverage</div>
                        <div className="text-lg font-mono font-bold text-foreground">
                          {activeRegion.hectaresTarget > 0 ? ((activeRegion.hectaresRestored / activeRegion.hectaresTarget) * 100).toFixed(0) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ) : (
              <div className="border border-border/50 rounded p-4 text-center">
                <p className="text-[10px] font-mono text-muted-foreground">Hover or click a region to see details</p>
              </div>
            )}

            {/* Quick stats */}
            <div className="space-y-2">
              {regions.map((r) => {
                const pct = r.hectaresTarget > 0 ? (r.hectaresRestored / r.hectaresTarget) * 100 : 0;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRegion(selectedRegion?.id === r.id ? null : r)}
                    className={cn(
                      "w-full text-left flex items-center gap-2 px-3 py-2 rounded border border-border hover:bg-secondary/30 transition-colors",
                      selectedRegion?.id === r.id && "bg-primary/5 border-primary/25"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full shrink-0",
                      r.status === "active" ? "bg-status-on-track" :
                      r.status === "blocked" ? "bg-status-critical" :
                      r.status === "mobilizing" ? "bg-status-at-risk" :
                      r.status === "planning" ? "bg-primary" :
                      "bg-muted-foreground/40"
                    )} />
                    <span className="text-[10px] font-display text-foreground flex-1 truncate">{r.name}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">{pct.toFixed(0)}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
