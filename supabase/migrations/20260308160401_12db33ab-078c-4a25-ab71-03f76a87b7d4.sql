
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  description text NOT NULL,
  actor text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.activity_log FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- Trigger function to log mission changes
CREATE OR REPLACE FUNCTION public.log_mission_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_log (entity_type, entity_id, action, description, actor)
    VALUES ('mission', NEW.id, 'created', 'Mission "' || NEW.title || '" created', NEW.owner);
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_log (entity_type, entity_id, action, description, actor)
    VALUES ('mission', NEW.id, 'updated', 'Mission "' || NEW.title || '" updated (status: ' || NEW.status || ')', NEW.owner);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_mission_log AFTER INSERT OR UPDATE ON public.missions
  FOR EACH ROW EXECUTE FUNCTION public.log_mission_change();

-- Trigger for milestone changes
CREATE OR REPLACE FUNCTION public.log_milestone_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_log (entity_type, entity_id, action, description, actor)
    VALUES ('milestone', NEW.id, 'created', 'Milestone "' || NEW.name || '" created', NEW.owner);
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_log (entity_type, entity_id, action, description, actor)
    VALUES ('milestone', NEW.id, 'updated', 'Milestone "' || NEW.name || '" → ' || NEW.status, NEW.owner);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_milestone_log AFTER INSERT OR UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.log_milestone_change();

-- Trigger for blocker changes
CREATE OR REPLACE FUNCTION public.log_blocker_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_log (entity_type, entity_id, action, description, actor)
    VALUES ('blocker', NEW.id, 'created', 'Blocker "' || NEW.title || '" reported (' || NEW.severity || ')', NEW.owner);
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO activity_log (entity_type, entity_id, action, description, actor)
    VALUES ('blocker', NEW.id, 'updated', 'Blocker "' || NEW.title || '" updated', NEW.owner);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_blocker_log AFTER INSERT OR UPDATE ON public.blockers
  FOR EACH ROW EXECUTE FUNCTION public.log_blocker_change();

ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
