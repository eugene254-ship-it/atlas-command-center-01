import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const priorities = ["P0", "P1", "P2"] as const;
const statuses = ["on-track", "at-risk", "delayed", "critical"] as const;

interface CreateMissionDialogProps {
  mission?: any; // for editing
  trigger?: React.ReactNode;
}

export function CreateMissionDialog({ mission, trigger }: CreateMissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: mission?.title ?? "",
    objective: mission?.objective ?? "",
    owner: mission?.owner ?? "",
    priority: mission?.priority ?? "P1",
    status: mission?.status ?? "on-track",
    phase: mission?.phase ?? "",
    unit: mission?.unit ?? "hectares",
    target: (mission?.target)?.toString() ?? "1000",
    progress: (mission?.progress)?.toString() ?? "0",
    funding_target: (mission?.funding_target ?? mission?.fundingTarget)?.toString() ?? "0",
    funding_raised: (mission?.funding_raised ?? mission?.fundingRaised)?.toString() ?? "0",
    eta: mission?.eta ?? "",
  });

  const handleChange = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title,
      objective: form.objective,
      owner: form.owner,
      priority: form.priority as any,
      status: form.status as any,
      phase: form.phase,
      unit: form.unit,
      target: parseInt(form.target) || 1,
      progress: parseInt(form.progress) || 0,
      funding_target: parseInt(form.funding_target) || 0,
      funding_raised: parseInt(form.funding_raised) || 0,
      eta: form.eta,
    };

    let error;
    if (mission?.id) {
      ({ error } = await supabase.from("missions").update(payload).eq("id", mission.id));
    } else {
      ({ error } = await supabase.from("missions").insert(payload));
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(mission?.id ? "Mission updated" : "Mission created");
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      setOpen(false);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary/15 text-primary text-[10px] font-mono font-medium hover:bg-primary/25 transition-colors">
            <Plus className="w-3 h-3" /> New Mission
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {mission?.id ? "Edit Mission" : "Create Mission"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <Field label="Title" value={form.title} onChange={(v) => handleChange("title", v)} required />
          <Field label="Objective" value={form.objective} onChange={(v) => handleChange("objective", v)} textarea />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Owner" value={form.owner} onChange={(v) => handleChange("owner", v)} required />
            <Field label="Phase" value={form.phase} onChange={(v) => handleChange("phase", v)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <SelectField label="Priority" value={form.priority} options={priorities} onChange={(v) => handleChange("priority", v)} />
            <SelectField label="Status" value={form.status} options={statuses} onChange={(v) => handleChange("status", v)} />
            <Field label="Unit" value={form.unit} onChange={(v) => handleChange("unit", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target" value={form.target} onChange={(v) => handleChange("target", v)} type="number" />
            <Field label="Progress" value={form.progress} onChange={(v) => handleChange("progress", v)} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Funding Target" value={form.funding_target} onChange={(v) => handleChange("funding_target", v)} type="number" />
            <Field label="Funding Raised" value={form.funding_raised} onChange={(v) => handleChange("funding_raised", v)} type="number" />
          </div>
          <Field label="ETA" value={form.eta} onChange={(v) => handleChange("eta", v)} placeholder="e.g. Q3 2027" />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 rounded bg-primary text-primary-foreground text-sm font-display font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : mission?.id ? "Update Mission" : "Create Mission"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, required, textarea, type, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; textarea?: boolean; type?: string; placeholder?: string;
}) {
  const cls = "w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary";
  return (
    <div>
      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={cn(cls, "h-16 resize-none")} placeholder={placeholder} />
      ) : (
        <input type={type ?? "text"} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: readonly string[]; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
