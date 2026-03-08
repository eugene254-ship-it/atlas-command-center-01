import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const milestoneStatuses = ["not-started", "in-progress", "blocked", "delayed", "completed", "verified"] as const;

interface CreateMilestoneDialogProps {
  missionId: string;
  milestone?: any;
  trigger?: React.ReactNode;
}

export function CreateMilestoneDialog({ missionId, milestone, trigger }: CreateMilestoneDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: milestone?.name ?? "",
    owner: milestone?.owner ?? "",
    status: milestone?.status ?? "not-started",
    planned_start: milestone?.plannedStart ?? "",
    planned_end: milestone?.plannedEnd ?? "",
    actual_progress: milestone?.actualProgress?.toString() ?? "0",
  });

  const handleChange = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      mission_id: missionId,
      name: form.name,
      owner: form.owner,
      status: form.status as any,
      planned_start: form.planned_start || null,
      planned_end: form.planned_end || null,
      actual_progress: parseInt(form.actual_progress) || 0,
    };

    let error;
    if (milestone?.id) {
      ({ error } = await supabase.from("milestones").update(payload).eq("id", milestone.id));
    } else {
      ({ error } = await supabase.from("milestones").insert(payload));
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(milestone?.id ? "Milestone updated" : "Milestone created");
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      setOpen(false);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/15 text-primary text-[10px] font-mono font-medium hover:bg-primary/25 transition-colors">
            <Plus className="w-3 h-3" /> Add Milestone
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {milestone?.id ? "Edit Milestone" : "New Milestone"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Owner</label>
              <input type="text" value={form.owner} onChange={(e) => handleChange("owner", e.target.value)} required
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Status</label>
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary">
                {milestoneStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Planned Start</label>
              <input type="text" value={form.planned_start} onChange={(e) => handleChange("planned_start", e.target.value)} placeholder="Q1 2025"
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Planned End</label>
              <input type="text" value={form.planned_end} onChange={(e) => handleChange("planned_end", e.target.value)} placeholder="Q4 2026"
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Progress (%)</label>
            <input type="number" min="0" max="100" value={form.actual_progress} onChange={(e) => handleChange("actual_progress", e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2 rounded bg-primary text-primary-foreground text-sm font-display font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {submitting ? "Saving..." : milestone?.id ? "Update" : "Create Milestone"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
