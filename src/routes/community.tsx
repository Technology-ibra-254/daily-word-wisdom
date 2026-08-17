import { createFileRoute } from "@tanstack/react-router";
import { Users, HeartHandshake, UserPlus, Church, Flame } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { GROUPS, PRAYERS, FRIENDS } from "@/lib/demo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Groups, Prayer & Church" },
      {
        name: "description",
        content:
          "Join groups, share and answer prayer requests, connect with friends and stay close to your church.",
      },
      { property: "og:title", content: "Community — Groups & Prayer" },
      {
        property: "og:description",
        content: "Groups, prayer wall, friends and church updates.",
      },
    ],
  }),
  component: CommunityPage,
});

const TABS = ["Groups", "Prayer", "Friends", "Church"] as const;
type Tab = (typeof TABS)[number];

function CommunityPage() {
  const [tab, setTab] = useState<Tab>("Groups");
  const [prayed, setPrayed] = useState<Record<string, boolean>>({});

  return (
    <MobileShell>
      <PageHeader title="Community" subtitle="Grow together" />
      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      <div className="space-y-3 px-4 pb-6">
        {tab === "Groups" &&
          GROUPS.map((g) => (
            <div
              key={g.id}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Users className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{g.name}</p>
                <p className="text-xs text-muted-foreground">
                  {g.members} members · {g.activity}
                </p>
              </div>
              <button
                onClick={() => toast.success(`Joined ${g.name}`)}
                className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Join
              </button>
            </div>
          ))}

        {tab === "Prayer" && (
          <>
            <button
              onClick={() => toast("Share a request", { description: "Composer opened." })}
              className="w-full rounded-2xl bg-primary p-4 text-left text-primary-foreground shadow-[var(--shadow-card)]"
            >
              <HeartHandshake className="h-5 w-5" />
              <p className="mt-2 text-sm font-semibold">Share a prayer request</p>
              <p className="text-xs opacity-80">Your church family is listening</p>
            </button>
            {PRAYERS.map((p) => (
              <div key={p.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px]">
                      {p.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.time} ago</p>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed">{p.request}</p>
                <button
                  onClick={() => setPrayed((x) => ({ ...x, [p.id]: true }))}
                  className={`mt-3 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    prayed[p.id]
                      ? "bg-success-soft text-success"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {prayed[p.id] ? "You prayed" : `I prayed · ${p.prayers}`}
                </button>
              </div>
            ))}
          </>
        )}

        {tab === "Friends" &&
          FRIENDS.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-xs">
                  {f.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">{f.name}</p>
                <p className="flex items-center gap-1 text-xs text-flame">
                  <Flame className="h-3.5 w-3.5" /> {f.streak} day streak
                </p>
              </div>
              <button
                onClick={() => toast.success("Friend request sent")}
                className="rounded-full bg-secondary p-2"
                aria-label="Add friend"
              >
                <UserPlus className="h-4 w-4" />
              </button>
            </div>
          ))}

        {tab === "Church" && (
          <>
            <div className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Church className="h-5 w-5" />
              </span>
              <p className="mt-2 text-sm font-bold">Grace Light Church</p>
              <p className="text-xs text-muted-foreground">Lagos, Nigeria · 2,430 members</p>
              <button
                onClick={() => toast.success("Giving page opened")}
                className="mt-3 w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground"
              >
                Give
              </button>
            </div>
            {[
              { t: "Sunday Service", d: "Sun · 9:00 AM" },
              { t: "Midweek Bible Study", d: "Wed · 6:00 PM" },
              { t: "Youth Night", d: "Fri · 5:30 PM" },
            ].map((e) => (
              <div key={e.t} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <p className="text-sm font-semibold">{e.t}</p>
                <p className="text-xs text-muted-foreground">{e.d}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </MobileShell>
  );
}
