import { useState } from "react";
import { cn } from "@/lib/utils";
import { Filter, X, ChevronDown } from "lucide-react";
import { missions, regions, partners } from "@/lib/mock-data";

export interface FilterState {
  mission: string;
  region: string;
  partner: string;
  fundingSource: string;
  timeRange: string;
}

const defaultFilters: FilterState = {
  mission: "all",
  region: "all",
  partner: "all",
  fundingSource: "all",
  timeRange: "all",
};

const fundingSourceOptions = [
  "Philanthropic Capital",
  "Government Grants",
  "Development Finance",
  "Carbon Markets",
  "Private Investors",
  "Climate Funds",
];

const timeRangeOptions = [
  { label: "All Time", value: "all" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "This Year", value: "1y" },
  { label: "Last 2 Years", value: "2y" },
];

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="relative">
      <label className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest block mb-0.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-secondary/50 border border-border rounded px-2.5 py-1.5 pr-6 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-full cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-card text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = Object.values(filters).filter((v) => v !== "all").length;

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAll = () => onFiltersChange(defaultFilters);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 sm:px-6 py-2 w-full hover:bg-secondary/20 transition-colors"
      >
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Filters</span>
        {activeCount > 0 && (
          <span className="text-[9px] font-mono font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded">
            {activeCount}
          </span>
        )}
        <ChevronDown className={cn("w-3 h-3 text-muted-foreground ml-auto transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="px-4 sm:px-6 pb-3 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <FilterSelect
              label="Mission"
              value={filters.mission}
              onChange={(v) => updateFilter("mission", v)}
              options={[
                { label: "All Missions", value: "all" },
                ...missions.map((m) => ({ label: m.title.slice(0, 30) + (m.title.length > 30 ? "…" : ""), value: m.id })),
              ]}
            />
            <FilterSelect
              label="Region"
              value={filters.region}
              onChange={(v) => updateFilter("region", v)}
              options={[
                { label: "All Regions", value: "all" },
                ...regions.map((r) => ({ label: r.name, value: r.id })),
              ]}
            />
            <FilterSelect
              label="Partner"
              value={filters.partner}
              onChange={(v) => updateFilter("partner", v)}
              options={[
                { label: "All Partners", value: "all" },
                ...partners.map((p) => ({ label: p.name, value: p.id })),
              ]}
            />
            <FilterSelect
              label="Funding Source"
              value={filters.fundingSource}
              onChange={(v) => updateFilter("fundingSource", v)}
              options={[
                { label: "All Sources", value: "all" },
                ...fundingSourceOptions.map((s) => ({ label: s, value: s })),
              ]}
            />
            <FilterSelect
              label="Time Range"
              value={filters.timeRange}
              onChange={(v) => updateFilter("timeRange", v)}
              options={timeRangeOptions}
            />
          </div>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="mt-2 flex items-center gap-1 text-[9px] font-mono text-primary hover:text-primary/80 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { defaultFilters };
