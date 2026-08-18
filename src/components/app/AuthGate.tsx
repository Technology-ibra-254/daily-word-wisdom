import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

/** Renders children only for signed-in users; otherwise invites them to sign in. */
export function AuthGate({
  children,
  message = "Sign in to see and share real content from the community.",
}: {
  children: ReactNode;
  message?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-3 px-4 py-6">
        <div className="h-20 animate-pulse rounded-2xl bg-muted" />
        <div className="h-20 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-4 my-6 rounded-3xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)]">
        <h2 className="font-display text-2xl tracking-tight">Join the community</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <Button asChild className="mt-4 w-full rounded-full">
          <Link to="/auth">Sign in or create account</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/60 p-6 text-center">
      <p className="font-display text-xl tracking-tight">{title}</p>
      {hint ? <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
