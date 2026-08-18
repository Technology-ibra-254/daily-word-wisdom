import { Link, useRouterState } from "@tanstack/react-router";
import { House, BookOpen, Clapperboard, CircleUser, Plus } from "lucide-react";
import { type ReactNode } from "react";
import { CaptureSheet } from "./CaptureSheet";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Home", icon: House },
  { to: "/bible", label: "Bible", icon: BookOpen },
  { to: "/feed", label: "Feed", icon: Clapperboard },
  { to: "/profile", label: "Profile", icon: CircleUser },
] as const;

export function MobileShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <main className="flex-1 pb-32">{children}</main>

      {/* iOS-style translucent tab bar */}
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border/60 bg-card/70 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="relative grid grid-cols-5 items-end px-1 pb-1.5 pt-1.5">
          {TABS.slice(0, 2).map((t) => (
            <TabLink key={t.to} {...t} active={pathname === t.to} />
          ))}

          <div className="flex justify-center">
            <CaptureSheet
              trigger={
                <button
                  aria-label="Capture"
                  className="-mt-7 flex h-13 w-13 items-center justify-center rounded-full bg-primary p-3.5 text-primary-foreground shadow-[var(--shadow-float)] transition-all duration-200 active:scale-90"
                >
                  <Plus className="h-6 w-6" strokeWidth={2.2} />
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
  icon: typeof House;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-[3px] rounded-xl py-1 transition-colors duration-150",
        active ? "text-primary" : "text-muted-foreground/80",
      )}
    >
      <Icon className="h-[26px] w-[26px]" strokeWidth={active ? 2.1 : 1.6} />
      <span className="text-[10px] font-medium tracking-[0.01em]">{label}</span>
    </Link>
  );
}

/** iOS-style navigation bar: centered title, optional large title below. */
export function PageHeader({
  title,
  subtitle,
  right,
  large = true,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  large?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 px-4 pb-2 pt-3 backdrop-blur-xl">
      <div className="flex min-h-7 items-center justify-between gap-3">
        <span className="text-[13px] font-semibold tracking-tight text-muted-foreground">
          {large ? "" : title}
        </span>
        {right}
      </div>
      {large ? (
        <div className="pt-0.5">
          <h1 className="font-display text-[28px] leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-[13px] text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
