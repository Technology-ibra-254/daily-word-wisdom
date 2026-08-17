import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Play, CheckCircle2, ClipboardList, Users, Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { Progress } from "@/components/ui/progress";
import { EARN_TASKS, REWARDS } from "@/lib/demo";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/earn")({
  head: () => ({
    meta: [
      { title: "Earn — Rewards for Faithful Habits" },
      {
        name: "description",
        content:
          "Watch and earn, complete tasks and surveys, track creator earnings and affiliate income, and redeem rewards.",
      },
      { property: "og:title", content: "Earn — Rewards for Faithful Habits" },
      {
        property: "og:description",
        content: "Watch & earn, tasks, surveys, creator earnings, affiliate and rewards.",
      },
    ],
  }),
  component: EarnPage,
});

const TABS = [
  "Watch & Earn",
  "Tasks",
  "Surveys",
  "Creator Earnings",
  "Affiliate",
  "Rewards",
] as const;
type Tab = (typeof TABS)[number];

function EarnPage() {
  const [tab, setTab] = useState<Tab>("Watch & Earn");
  const [points, setPoints] = useLocalState<number>("points", 1250);
  const [done, setDone] = useLocalState<string[]>("earn-done", ["e2"]);

  const claim = (id: string, value: number) => {
    if (done.includes(id)) return;
    setDone((d) => [...d, id]);
    setPoints((p) => p + value);
    toast.success(`+${value} points earned`);
  };

  const listFor = (category: Tab) => EARN_TASKS.filter((t) => t.category === category);

  return (
    <MobileShell>
      <PageHeader title="Earn Rewards" subtitle="Grow while you give" />

      <div className="px-4">
        <div className="rounded-3xl bg-success p-5 text-ink-foreground shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 text-xs opacity-90">
            <Wallet className="h-4 w-4" /> Total balance
          </div>
          <p className="mt-1 text-3xl font-extrabold">
            {points.toLocaleString()}
            <span className="ml-1 text-sm font-semibold opacity-80">pts</span>
          </p>
          <button
            onClick={() => toast("Cash out", { description: "Minimum 5,000 pts." })}
            className="mt-3 rounded-full bg-ink-foreground/20 px-4 py-1.5 text-xs font-semibold"
          >
            Cash out
          </button>
        </div>
      </div>

      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      <div className="space-y-3 px-4 pb-6">
        {tab === "Creator Earnings" ? (
          <div className="space-y-3">
            <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="text-xs text-muted-foreground">This month</p>
              <p className="text-2xl font-extrabold">₦48,750.50</p>
              <p className="mt-1 text-xs text-success">+16.8% vs last month</p>
            </div>
            {[
              { label: "Sermon views", value: 62 },
              { label: "Video ads", value: 24 },
              { label: "Tips & gifts", value: 14 },
            ].map((r) => (
              <div key={r.label} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex justify-between text-sm font-medium">
                  <span>{r.label}</span>
                  <span className="text-muted-foreground">{r.value}%</span>
                </div>
                <Progress value={r.value} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>
        ) : tab === "Rewards" ? (
          REWARDS.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame-soft text-flame">
                <Gift className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {r.cost.toLocaleString()} pts
                </p>
              </div>
              <button
                disabled={points < r.cost}
                onClick={() => {
                  setPoints((p) => p - r.cost);
                  toast.success("Reward redeemed");
                }}
                className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-40"
              >
                Redeem
              </button>
            </div>
          ))
        ) : tab === "Affiliate" ? (
          <div className="space-y-3">
            <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="text-sm font-semibold">Your invite link</p>
              <p className="mt-1 truncate rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">
                bibleapp.link/r/benjamin
              </p>
              <button
                onClick={() => toast.success("Link copied")}
                className="mt-3 w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground"
              >
                Copy link
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">14 friends joined</p>
                <p className="text-xs text-muted-foreground">11,200 pts earned</p>
              </div>
            </div>
            {listFor("Affiliate").map((t) => (
              <TaskRow key={t.id} task={t} done={done.includes(t.id)} onClaim={claim} />
            ))}
          </div>
        ) : (
          <>
            {listFor(tab).map((t) => (
              <TaskRow key={t.id} task={t} done={done.includes(t.id)} onClaim={claim} />
            ))}
            {!listFor(tab).length ? (
              <p className="pt-10 text-center text-xs text-muted-foreground">
                New opportunities drop daily.
              </p>
            ) : null}
          </>
        )}
      </div>
    </MobileShell>
  );
}

function TaskRow({
  task,
  done,
  onClaim,
}: {
  task: (typeof EARN_TASKS)[number];
  done: boolean;
  onClaim: (id: string, points: number) => void;
}) {
  const Icon =
    task.category === "Watch & Earn"
      ? Play
      : task.category === "Surveys"
        ? ClipboardList
        : CheckCircle2;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold leading-snug">{task.title}</p>
        <p className="text-xs text-success">+{task.points} pts</p>
      </div>
      <button
        disabled={done}
        onClick={() => onClaim(task.id, task.points)}
        className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground"
      >
        {done ? "Done" : "Start"}
      </button>
    </div>
  );
}
