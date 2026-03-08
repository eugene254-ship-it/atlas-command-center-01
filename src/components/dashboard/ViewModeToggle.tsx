import { cn } from "@/lib/utils";
import { Eye, Telescope } from "lucide-react";

interface ViewModeToggleProps {
  mode: "executive" | "operator";
  onToggle: (mode: "executive" | "operator") => void;
}

export function ViewModeToggle({ mode, onToggle }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-0.5 bg-secondary/50 rounded p-0.5">
      <button
        onClick={() => onToggle("executive")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all",
          mode === "executive"
            ? "bg-primary/15 text-primary border border-primary/25"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Eye className="w-3 h-3" />
        Exec
      </button>
      <button
        onClick={() => onToggle("operator")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all",
          mode === "operator"
            ? "bg-primary/15 text-primary border border-primary/25"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Telescope className="w-3 h-3" />
        Ops
      </button>
    </div>
  );
}
