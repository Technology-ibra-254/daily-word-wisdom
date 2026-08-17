import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Play, User, Plus } from "lucide-react";
import { type ReactNode } from "react";
import { CaptureSheet } from "./CaptureSheet";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/bible", label: "Bible", icon: BookOpen },
  { to: "/feed", label: "Feed", icon: Play },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function MobileShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <main className="flex-1 pb-28">{children}</main>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
        <div className="relative grid grid-cols-5 items-end px-2 pb-2 pt-2">
          {TABS.slice(0, 2).map((t) => (
            <TabLink key={t.to} {...t} active={pathname === t.to} />
          ))}

          <div className="flex justify-center">
            <CaptureSheet
              trigger={
                <button
                  aria-label="Capture"
                  className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-95"
                >
                  <Plus className="h-7 w-7" />
                </button>
              }
            />
          </div>

          {TABS.slice(2).map((t) => (
            <TabLink key={t.to} {...t} active={pathname === t.to} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function TabLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className={cn("h-5 w-5", active && "fill-primary/10")} />
      {label}
    </Link>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
      <div>
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </header>
  );
}
