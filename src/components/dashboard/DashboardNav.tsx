import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Target, ListChecks, DollarSign, Users, Globe, 
  ShieldCheck, AlertTriangle, Radio, Bell
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { ViewModeToggle } from "./ViewModeToggle";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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

interface AlertItem {
  id: string;
  message: string;
  severity: string;
  created_at: string;
}

export function DashboardNav({ activeSection, onSectionChange, viewMode, onViewModeChange, onSignOut, userEmail, role }: DashboardNavProps) {
  const [unreadAlerts, setUnreadAlerts] = useState<AlertItem[]>([]);
  const [lastSeenAt, setLastSeenAt] = useState<string>(() => localStorage.getItem("alerts_last_seen") ?? new Date(0).toISOString());

  const fetchUnread = useCallback(async () => {
    const { data } = await supabase
      .from("alerts")
      .select("id, message, severity, created_at")
      .gt("created_at", lastSeenAt)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setUnreadAlerts(data);
  }, [lastSeenAt]);

  useEffect(() => { fetchUnread(); }, [fetchUnread]);

  // Realtime: push new alerts into unread list
  useEffect(() => {
    const channel = supabase
      .channel("nav-alerts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) => {
        const a = payload.new as AlertItem;
        if (a.created_at > lastSeenAt) {
          setUnreadAlerts((prev) => [a, ...prev].slice(0, 20));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [lastSeenAt]);

  const markSeen = () => {
    const now = new Date().toISOString();
    setLastSeenAt(now);
    localStorage.setItem("alerts_last_seen", now);
    setUnreadAlerts([]);
  };

  const severityColor: Record<string, string> = {
    critical: "text-status-critical",
    high: "text-status-at-risk",
    medium: "text-status-delayed",
    low: "text-muted-foreground",
  };

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
          {/* Alert bell with badge */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-1.5 rounded hover:bg-secondary/50 transition-colors" onClick={() => { if (unreadAlerts.length > 0) markSeen(); }}>
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-status-critical text-[9px] font-mono font-bold text-white px-1">
                    {unreadAlerts.length > 9 ? "9+" : unreadAlerts.length}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 max-h-80 overflow-y-auto">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-xs font-display font-semibold text-foreground">Recent Alerts</span>
              </div>
              {unreadAlerts.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-muted-foreground font-mono">No new alerts</div>
              ) : (
                unreadAlerts.map((a) => (
                  <div key={a.id} className="px-3 py-2 border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={cn("text-[9px] font-mono font-bold uppercase tracking-wider", severityColor[a.severity] ?? "text-muted-foreground")}>
                        {a.severity}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground ml-auto">
                        {new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground leading-snug">{a.message}</p>
                  </div>
                ))
              )}
            </PopoverContent>
          </Popover>

          <ViewModeToggle mode={viewMode} onToggle={onViewModeChange} />
          <div className="w-px h-5 bg-border hidden lg:block" />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-status-on-track/10 border border-status-on-track/20">
            <div className="w-1.5 h-1.5 rounded-full bg-status-on-track animate-pulse" />
            <span className="text-[10px] font-mono text-status-on-track uppercase tracking-wider">Live</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground hidden lg:block">
            {new Date().toISOString().slice(0, 16).replace("T", " · ")} UTC
          </span>
          {userEmail && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-muted-foreground hidden xl:block truncate max-w-[120px]">{userEmail}</span>
              {role && <span className="text-[8px] font-mono text-primary/70 uppercase">{role}</span>}
              {onSignOut && (
                <button onClick={onSignOut} className="text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors">
                  Sign out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}