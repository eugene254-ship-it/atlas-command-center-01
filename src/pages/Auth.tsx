import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Radio, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"operator" | "donor">("operator");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) toast.error(error.message);
      else toast.success("Check your email for a password reset link.");
      setSubmitting(false);
      return;
    }

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
    } else {
      const { error } = await signUp(email, password, displayName, role);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to verify your account before signing in.");
        setMode("login");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-secondary/50 rounded p-0.5">
            <button
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 py-2 text-xs font-mono font-medium rounded transition-colors",
                mode === "login" || mode === "forgot" ? "bg-primary/15 text-primary" : "text-muted-foreground"
              )}
            >
              SIGN IN
            </button>
            <button
              onClick={() => setMode("signup")}
              className={cn(
                "flex-1 py-2 text-xs font-mono font-medium rounded transition-colors",
                mode === "signup" ? "bg-primary/15 text-primary" : "text-muted-foreground"
              )}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {mode === "forgot" && (
            <div className="mb-4">
              <h3 className="font-display font-semibold text-foreground text-sm mb-1">Reset Password</h3>
              <p className="text-[10px] font-mono text-muted-foreground">Enter your email and we'll send a reset link.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && mode !== "forgot" && (
              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === "login" && (
                  <button type="button" onClick={() => setMode("forgot")} className="text-[10px] font-mono text-primary hover:text-primary/80 mt-1">
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("operator")}
                    className={cn(
                      "px-3 py-3 rounded border text-left transition-colors",
                      role === "operator"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-secondary/30"
                    )}
                  >
                    <div className="text-xs font-display font-semibold text-foreground">Operator</div>
                    <div className="text-[9px] font-mono text-muted-foreground mt-0.5">
                      Full access · manage missions
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("donor")}
                    className={cn(
                      "px-3 py-3 rounded border text-left transition-colors",
                      role === "donor"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-secondary/30"
                    )}
                  >
                    <div className="text-xs font-display font-semibold text-foreground">Donor</div>
                    <div className="text-[9px] font-mono text-muted-foreground mt-0.5">
                      Read-only · executive view
                    </div>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded bg-primary text-primary-foreground text-sm font-display font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Processing..." : mode === "forgot" ? "Send Reset Link" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-mono text-muted-foreground mt-4">
          Mission Control · Secure Access
        </p>
      </div>
    </div>
  );
}
