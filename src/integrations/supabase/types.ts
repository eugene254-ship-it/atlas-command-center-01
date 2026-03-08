export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          action: string | null
          created_at: string
          id: string
          message: string
          mission: string | null
          owner: string | null
          region: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
        }
        Insert: {
          action?: string | null
          created_at?: string
          id?: string
          message: string
          mission?: string | null
          owner?: string | null
          region?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
        }
        Update: {
          action?: string | null
          created_at?: string
          id?: string
          message?: string
          mission?: string | null
          owner?: string | null
          region?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
        }
        Relationships: []
      }
      blockers: {
        Row: {
          action: string | null
          affected_milestones: number
          created_at: string
          days_unresolved: number
          id: string
          mission_id: string | null
          owner: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          updated_at: string
        }
        Insert: {
          action?: string | null
          affected_milestones?: number
          created_at?: string
          days_unresolved?: number
          id?: string
          mission_id?: string | null
          owner?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title: string
          updated_at?: string
        }
        Update: {
          action?: string | null
          affected_milestones?: number
          created_at?: string
          days_unresolved?: number
          id?: string
          mission_id?: string | null
          owner?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blockers_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_sources: {
        Row: {
          committed: number
          created_at: string
          deployed: number
          disbursed: number
          id: string
          mission_id: string | null
          source: string
          verified: number
        }
        Insert: {
          committed?: number
          created_at?: string
          deployed?: number
          disbursed?: number
          id?: string
          mission_id?: string | null
          source: string
          verified?: number
        }
        Update: {
          committed?: number
          created_at?: string
          deployed?: number
          disbursed?: number
          id?: string
          mission_id?: string | null
          source?: string
          verified?: number
        }
        Relationships: [
          {
            foreignKeyName: "funding_sources_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          actual_progress: number
          created_at: string
          dependencies: string[] | null
          id: string
          mission_id: string
          name: string
          owner: string
          planned_end: string | null
          planned_start: string | null
          status: Database["public"]["Enums"]["milestone_status"]
          updated_at: string
        }
        Insert: {
          actual_progress?: number
          created_at?: string
          dependencies?: string[] | null
          id?: string
          mission_id: string
          name: string
          owner: string
          planned_end?: string | null
          planned_start?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          updated_at?: string
        }
        Update: {
          actual_progress?: number
          created_at?: string
          dependencies?: string[] | null
          id?: string
          mission_id?: string
          name?: string
          owner?: string
          planned_end?: string | null
          planned_start?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          active_partners: number
          active_regions: number
          confidence: number
          created_at: string
          eta: string | null
          eta_variance: string | null
          funding_raised: number
          funding_target: number
          id: string
          milestones_complete: number
          milestones_total: number
          objective: string | null
          owner: string
          phase: string | null
          priority: Database["public"]["Enums"]["mission_priority"]
          progress: number
          status: Database["public"]["Enums"]["mission_status"]
          target: number
          title: string
          top_blocker: string | null
          trend: Database["public"]["Enums"]["trend_direction"]
          unit: string
          updated_at: string
          verification_coverage: number
        }
        Insert: {
          active_partners?: number
          active_regions?: number
          confidence?: number
          created_at?: string
          eta?: string | null
          eta_variance?: string | null
          funding_raised?: number
          funding_target?: number
          id?: string
          milestones_complete?: number
          milestones_total?: number
          objective?: string | null
          owner: string
          phase?: string | null
          priority?: Database["public"]["Enums"]["mission_priority"]
          progress?: number
          status?: Database["public"]["Enums"]["mission_status"]
          target?: number
          title: string
          top_blocker?: string | null
          trend?: Database["public"]["Enums"]["trend_direction"]
          unit?: string
          updated_at?: string
          verification_coverage?: number
        }
        Update: {
          active_partners?: number
          active_regions?: number
          confidence?: number
          created_at?: string
          eta?: string | null
          eta_variance?: string | null
          funding_raised?: number
          funding_target?: number
          id?: string
          milestones_complete?: number
          milestones_total?: number
          objective?: string | null
          owner?: string
          phase?: string | null
          priority?: Database["public"]["Enums"]["mission_priority"]
          progress?: number
          status?: Database["public"]["Enums"]["mission_status"]
          target?: number
          title?: string
          top_blocker?: string | null
          trend?: Database["public"]["Enums"]["trend_direction"]
          unit?: string
          updated_at?: string
          verification_coverage?: number
        }
        Relationships: []
      }
      partners: {
        Row: {
          contribution_type: string | null
          created_at: string
          deliverables: number
          fulfilled: number
          id: string
          last_activity: string | null
          name: string
          reliability: number
          role: string | null
          status: Database["public"]["Enums"]["partner_status"]
          updated_at: string
        }
        Insert: {
          contribution_type?: string | null
          created_at?: string
          deliverables?: number
          fulfilled?: number
          id?: string
          last_activity?: string | null
          name: string
          reliability?: number
          role?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
        }
        Update: {
          contribution_type?: string | null
          created_at?: string
          deliverables?: number
          fulfilled?: number
          id?: string
          last_activity?: string | null
          name?: string
          reliability?: number
          role?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          created_at: string
          funds_deployed: number
          hectares_restored: number
          hectares_target: number
          id: string
          milestone_completion: number
          name: string
          partners: number
          status: Database["public"]["Enums"]["region_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          funds_deployed?: number
          hectares_restored?: number
          hectares_target?: number
          id?: string
          milestone_completion?: number
          name: string
          partners?: number
          status?: Database["public"]["Enums"]["region_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          funds_deployed?: number
          hectares_restored?: number
          hectares_target?: number
          id?: string
          milestone_completion?: number
          name?: string
          partners?: number
          status?: Database["public"]["Enums"]["region_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_disputes: {
        Row: {
          created_at: string
          id: string
          metric: string
          mission_id: string | null
          reported: string | null
          status: string
          verified: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metric: string
          mission_id?: string | null
          reported?: string | null
          status?: string
          verified?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metric?: string
          mission_id?: string | null
          reported?: string | null
          status?: string
          verified?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_disputes_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_records: {
        Row: {
          claimed: string | null
          confidence: number
          created_at: string
          id: string
          metric: string
          mission_id: string | null
          verified: string | null
        }
        Insert: {
          claimed?: string | null
          confidence?: number
          created_at?: string
          id?: string
          metric: string
          mission_id?: string | null
          verified?: string | null
        }
        Update: {
          claimed?: string | null
          confidence?: number
          created_at?: string
          id?: string
          metric?: string
          mission_id?: string | null
          verified?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_records_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_severity: "critical" | "high" | "medium" | "low"
      app_role: "operator" | "donor"
      milestone_status:
        | "not-started"
        | "in-progress"
        | "blocked"
        | "delayed"
        | "completed"
        | "verified"
      mission_priority: "P0" | "P1" | "P2"
      mission_status: "on-track" | "at-risk" | "delayed" | "critical"
      partner_status: "active" | "inactive" | "pending"
      region_status:
        | "not-started"
        | "planning"
        | "mobilizing"
        | "active"
        | "blocked"
        | "verified"
      trend_direction: "up" | "down" | "flat"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["critical", "high", "medium", "low"],
      app_role: ["operator", "donor"],
      milestone_status: [
        "not-started",
        "in-progress",
        "blocked",
        "delayed",
        "completed",
        "verified",
      ],
      mission_priority: ["P0", "P1", "P2"],
      mission_status: ["on-track", "at-risk", "delayed", "critical"],
      partner_status: ["active", "inactive", "pending"],
      region_status: [
        "not-started",
        "planning",
        "mobilizing",
        "active",
        "blocked",
        "verified",
      ],
      trend_direction: ["up", "down", "flat"],
    },
  },
} as const
