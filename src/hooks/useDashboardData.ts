import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Mission, Milestone, Partner, Alert, Region, Blocker, FundingSource } from "@/lib/mock-data";

function mapMission(row: any): Mission {
  return {
    id: row.id,
    title: row.title,
    objective: row.objective ?? "",
    owner: row.owner,
    status: row.status,
    phase: row.phase ?? "",
    priority: row.priority,
    confidence: row.confidence,
    progress: Number(row.progress),
    target: Number(row.target),
    unit: row.unit,
    fundingRaised: Number(row.funding_raised),
    fundingTarget: Number(row.funding_target),
    activeRegions: row.active_regions,
    activePartners: row.active_partners,
    milestonesComplete: row.milestones_complete,
    milestonesTotal: row.milestones_total,
    verificationCoverage: row.verification_coverage,
    eta: row.eta ?? "",
    etaVariance: row.eta_variance ?? "",
    topBlocker: row.top_blocker ?? "",
    trend: row.trend,
  };
}

export function useMissions() {
  return useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("missions").select("*").order("priority");
      if (error) throw error;
      return (data ?? []).map(mapMission);
    },
  });
}

export function useMilestones(missionId?: string) {
  return useQuery({
    queryKey: ["milestones", missionId],
    queryFn: async () => {
      let q = supabase.from("milestones").select("*").order("planned_start");
      if (missionId) q = q.eq("mission_id", missionId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map((r): Milestone => ({
        id: r.id,
        name: r.name,
        owner: r.owner,
        missionId: r.mission_id,
        status: r.status,
        plannedStart: r.planned_start ?? "",
        plannedEnd: r.planned_end ?? "",
        actualProgress: r.actual_progress,
        dependencies: (r.dependencies ?? []) as string[],
      }));
    },
  });
}

export function usePartners() {
  return useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*").order("reliability", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r): Partner => ({
        id: r.id,
        name: r.name,
        role: r.role ?? "",
        contributionType: r.contribution_type ?? "",
        deliverables: r.deliverables,
        fulfilled: r.fulfilled,
        reliability: r.reliability,
        lastActivity: r.last_activity ?? "",
        status: r.status,
      }));
    },
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alerts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r): Alert => ({
        id: r.id,
        timestamp: new Date(r.created_at).toLocaleString(),
        severity: r.severity,
        mission: r.mission ?? "",
        region: r.region ?? "",
        message: r.message,
        owner: r.owner ?? "",
        action: r.action ?? "",
      }));
    },
  });
}

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("regions").select("*").order("name");
      if (error) throw error;
      return (data ?? []).map((r): Region => ({
        id: r.id,
        name: r.name,
        status: r.status,
        hectaresTarget: Number(r.hectares_target),
        hectaresRestored: Number(r.hectares_restored),
        partners: r.partners,
        fundsDeployed: Number(r.funds_deployed),
        milestoneCompletion: r.milestone_completion,
      }));
    },
  });
}

export function useBlockers() {
  return useQuery({
    queryKey: ["blockers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blockers").select("*").order("severity");
      if (error) throw error;
      return (data ?? []).map((r): Blocker => ({
        id: r.id,
        title: r.title,
        severity: r.severity,
        owner: r.owner ?? "",
        daysUnresolved: r.days_unresolved,
        affectedMilestones: r.affected_milestones,
        action: r.action ?? "",
      }));
    },
  });
}

export function useFundingSources() {
  return useQuery({
    queryKey: ["funding_sources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("funding_sources").select("*");
      if (error) throw error;
      return (data ?? []).map((r): FundingSource => ({
        source: r.source,
        committed: Number(r.committed),
        disbursed: Number(r.disbursed),
        deployed: Number(r.deployed),
        verified: Number(r.verified),
      }));
    },
  });
}

export function useVerificationRecords(missionId?: string) {
  return useQuery({
    queryKey: ["verification_records", missionId],
    queryFn: async () => {
      let q = supabase.from("verification_records").select("*");
      if (missionId) q = q.eq("mission_id", missionId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useVerificationDisputes(missionId?: string) {
  return useQuery({
    queryKey: ["verification_disputes", missionId],
    queryFn: async () => {
      let q = supabase.from("verification_disputes").select("*");
      if (missionId) q = q.eq("mission_id", missionId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Realtime subscription hook for alerts
export function useRealtimeAlerts(onNewAlert: (alert: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("alerts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => onNewAlert(payload.new)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [onNewAlert]);
}

export interface ActivityLogEntry {
  id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  description: string;
  actor: string | null;
  created_at: string;
}

export function useActivityLog(limit = 30) {
  return useQuery({
    queryKey: ["activity_log", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as ActivityLogEntry[];
    },
    refetchInterval: 15000,
  });
}

export function useRealtimeActivityLog(onNew: (entry: ActivityLogEntry) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("activity-log-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log" },
        (payload) => onNew(payload.new as ActivityLogEntry)
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [onNew]);
}
