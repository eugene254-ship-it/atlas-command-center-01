import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Radio } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    } else {
      // Listen for PASSWORD_RECOVERY event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      navigate("/");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Radio className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-foreground tracking-wide">ATLAS</span>
            <span className="font-display text-sm text-primary ml-1 tracking-widest">SANCTUM</span>
          </div>
        </div>

        <div className="border border-border rounded-lg bg-card p-6">
          <h2 className="font-display font-semibold text-foreground text-lg mb-1">Reset Password</h2>
          <p className="text-xs text-muted-foreground font-mono mb-4">Enter your new password below.</p>

          {!ready ? (
            <div className="text-center py-8 text-xs text-muted-foreground font-mono">
              Verifying recovery link...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded bg-primary text-primary-foreground text-sm font-display font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
