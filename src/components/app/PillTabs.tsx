import { cn } from "@/lib/utils";

export function PillTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (t: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "no-scrollbar flex gap-2 overflow-x-auto px-4 py-3",
        className,
      )}
    >
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
            value === t
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
