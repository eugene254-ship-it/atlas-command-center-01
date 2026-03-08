import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Target, ListChecks, DollarSign, Users, Globe, 
  ShieldCheck, AlertTriangle, Radio
} from "lucide-react";
import { ViewModeToggle } from "./ViewModeToggle";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "missions", label: "Missions", icon: Target },
  { id: "milestones", label: "Milestones", icon: ListChecks },
  { id: "funding", label: "Funding", icon: DollarSign },
  { id: "partners", label: "Partners", icon: Users },
  { id: "regions", label: "Regions", icon: Globe },
  { id: "verification", label: "Verification", icon: ShieldCheck },
  { id: "risks", label: "Risks", icon: AlertTriangle },
] as const;

interface DashboardNavProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
  viewMode: "executive" | "operator";
  onViewModeChange: (mode: "executive" | "operator") => void;
  onSignOut?: () => void;
  userEmail?: string | null;
  role?: string | null;
}

export function DashboardNav({ activeSection, onSectionChange, viewMode, onViewModeChange, onSignOut, userEmail, role }: DashboardNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center h-full px-4 gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-6 shrink-0">
          <div className="w-7 h-7 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-bold text-sm text-foreground tracking-wide">ATLAS</span>
            <span className="font-display text-xs text-primary ml-1 tracking-widest">SANCTUM</span>
          </div>
        </div>

        <div className="w-px h-6 bg-border mr-2 shrink-0" />

        <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap",
                activeSection === item.id
                  ? "bg-primary/15 text-primary border border-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 shrink-0">
          <ViewModeToggle mode={viewMode} onToggle={onViewModeChange} />
          <div className="w-px h-5 bg-border hidden lg:block" />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-status-on-track/10 border border-status-on-track/20">
            <div className="w-1.5 h-1.5 rounded-full bg-status-on-track animate-pulse" />
            <span className="text-[10px] font-mono text-status-on-track uppercase tracking-wider">Live</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground hidden lg:block">
            {new Date().toISOString().slice(0, 16).replace("T", " · ")} UTC
          </span>
        </div>
      </div>
    </header>
  );
}
