
-- Enum types
CREATE TYPE public.mission_status AS ENUM ('on-track', 'at-risk', 'delayed', 'critical');
CREATE TYPE public.milestone_status AS ENUM ('not-started', 'in-progress', 'blocked', 'delayed', 'completed', 'verified');
CREATE TYPE public.alert_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE public.region_status AS ENUM ('not-started', 'planning', 'mobilizing', 'active', 'blocked', 'verified');
CREATE TYPE public.partner_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE public.mission_priority AS ENUM ('P0', 'P1', 'P2');
CREATE TYPE public.trend_direction AS ENUM ('up', 'down', 'flat');

-- Missions table
CREATE TABLE public.missions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  objective TEXT,
  owner TEXT NOT NULL,
  status mission_status NOT NULL DEFAULT 'on-track',
  phase TEXT,
  priority mission_priority NOT NULL DEFAULT 'P1',
  confidence INTEGER NOT NULL DEFAULT 50,
  progress BIGINT NOT NULL DEFAULT 0,
  target BIGINT NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'units',
  funding_raised BIGINT NOT NULL DEFAULT 0,
  funding_target BIGINT NOT NULL DEFAULT 0,
  active_regions INTEGER NOT NULL DEFAULT 0,
  active_partners INTEGER NOT NULL DEFAULT 0,
  milestones_complete INTEGER NOT NULL DEFAULT 0,
  milestones_total INTEGER NOT NULL DEFAULT 0,
  verification_coverage INTEGER NOT NULL DEFAULT 0,
  eta TEXT,
  eta_variance TEXT,
  top_blocker TEXT,
  trend trend_direction NOT NULL DEFAULT 'flat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Milestones table
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  status milestone_status NOT NULL DEFAULT 'not-started',
  planned_start TEXT,
  planned_end TEXT,
  actual_progress INTEGER NOT NULL DEFAULT 0,
  dependencies UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  contribution_type TEXT,
  deliverables INTEGER NOT NULL DEFAULT 0,
  fulfilled INTEGER NOT NULL DEFAULT 0,
  reliability INTEGER NOT NULL DEFAULT 0,
  last_activity TEXT,
  status partner_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Regions table
CREATE TABLE public.regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status region_status NOT NULL DEFAULT 'not-started',
  hectares_target BIGINT NOT NULL DEFAULT 0,
  hectares_restored BIGINT NOT NULL DEFAULT 0,
  partners INTEGER NOT NULL DEFAULT 0,
  funds_deployed BIGINT NOT NULL DEFAULT 0,
  milestone_completion INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  severity alert_severity NOT NULL DEFAULT 'medium',
  mission TEXT,
  region TEXT,
  message TEXT NOT NULL,
  owner TEXT,
  action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blockers table
CREATE TABLE public.blockers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'medium',
  owner TEXT,
  days_unresolved INTEGER NOT NULL DEFAULT 0,
  affected_milestones INTEGER NOT NULL DEFAULT 0,
  action TEXT,
  mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Funding sources table
CREATE TABLE public.funding_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  committed BIGINT NOT NULL DEFAULT 0,
  disbursed BIGINT NOT NULL DEFAULT 0,
  deployed BIGINT NOT NULL DEFAULT 0,
  verified BIGINT NOT NULL DEFAULT 0,
  mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verification records table
CREATE TABLE public.verification_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric TEXT NOT NULL,
  confidence INTEGER NOT NULL DEFAULT 0,
  claimed TEXT,
  verified TEXT,
  mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verification disputes table
CREATE TABLE public.verification_disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric TEXT NOT NULL,
  reported TEXT,
  verified TEXT,
  status TEXT NOT NULL DEFAULT 'Under review',
  mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_disputes ENABLE ROW LEVEL SECURITY;

-- Public read access policies (dashboard is read-accessible)
CREATE POLICY "Public read access" ON public.missions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.blockers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.funding_sources FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.verification_records FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.verification_disputes FOR SELECT USING (true);

-- Authenticated write policies
CREATE POLICY "Authenticated users can insert" ON public.missions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON public.missions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert" ON public.milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON public.milestones FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert" ON public.partners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON public.partners FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert" ON public.regions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON public.regions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert" ON public.blockers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON public.blockers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert" ON public.funding_sources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert" ON public.verification_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert" ON public.verification_disputes FOR INSERT TO authenticated WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON public.missions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON public.regions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blockers_updated_at BEFORE UPDATE ON public.blockers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_milestones_mission_id ON public.milestones(mission_id);
CREATE INDEX idx_blockers_mission_id ON public.blockers(mission_id);
CREATE INDEX idx_funding_sources_mission_id ON public.funding_sources(mission_id);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
