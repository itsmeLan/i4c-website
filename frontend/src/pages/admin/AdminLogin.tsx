import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, setAdminToken } from "@/lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiFetch<{ ok: true; token: string }>(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAdminToken(res.token);
      toast({ title: "Logged in", description: "Welcome to the admin dashboard." });
      navigate("/admin");
    } catch (err) {
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg border-border bg-card/60 backdrop-blur-sm">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              Admin <span className="gradient-text">Login</span>
            </h1>
            <p className="text-muted-foreground">Sign in to manage projects, services, testimonials, and inquiries.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            Tip: enable `ADMIN_BOOTSTRAP_ENABLED=true` in `backend/.env` to create the first admin user.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

