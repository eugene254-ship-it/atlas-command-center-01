import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Mission } from "@/lib/mock-data";

const severities = ["critical", "high", "medium", "low"] as const;

interface CreateBlockerDialogProps {
  missions?: Mission[];
  blocker?: any;
  trigger?: React.ReactNode;
}

export function CreateBlockerDialog({ missions, blocker, trigger }: CreateBlockerDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: blocker?.title ?? "",
    severity: blocker?.severity ?? "medium",
    owner: blocker?.owner ?? "",
    action: blocker?.action ?? "",
    days_unresolved: blocker?.daysUnresolved?.toString() ?? "0",
    affected_milestones: blocker?.affectedMilestones?.toString() ?? "0",
    mission_id: blocker?.missionId ?? "",
  });

  const handleChange = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title,
      severity: form.severity as any,
      owner: form.owner || null,
      action: form.action || null,
      days_unresolved: parseInt(form.days_unresolved) || 0,
      affected_milestones: parseInt(form.affected_milestones) || 0,
      mission_id: form.mission_id || null,
    };

    let error;
    if (blocker?.id) {
      ({ error } = await supabase.from("blockers").update(payload).eq("id", blocker.id));
    } else {
      ({ error } = await supabase.from("blockers").insert(payload));
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(blocker?.id ? "Blocker updated" : "Blocker created");
      queryClient.invalidateQueries({ queryKey: ["blockers"] });
      setOpen(false);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/15 text-primary text-[10px] font-mono font-medium hover:bg-primary/25 transition-colors">
            <Plus className="w-3 h-3" /> Report Blocker
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {blocker?.id ? "Edit Blocker" : "Report Blocker"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => handleChange("title", e.target.value)} required
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Severity</label>
              <select value={form.severity} onChange={(e) => handleChange("severity", e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary">
                {severities.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Owner</label>
              <input type="text" value={form.owner} onChange={(e) => handleChange("owner", e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          {missions && missions.length > 0 && (
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Mission</label>
              <select value={form.mission_id} onChange={(e) => handleChange("mission_id", e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">None</option>
                {missions.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Recommended Action</label>
            <textarea value={form.action} onChange={(e) => handleChange("action", e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary h-16 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Days Unresolved</label>
              <input type="number" min="0" value={form.days_unresolved} onChange={(e) => handleChange("days_unresolved", e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Affected Milestones</label>
              <input type="number" min="0" value={form.affected_milestones} onChange={(e) => handleChange("affected_milestones", e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2 rounded bg-primary text-primary-foreground text-sm font-display font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {submitting ? "Saving..." : blocker?.id ? "Update" : "Report Blocker"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
