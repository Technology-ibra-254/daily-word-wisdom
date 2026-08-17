import { createFileRoute } from "@tanstack/react-router";
import {
  StickyNote,
  NotebookPen,
  Bookmark,
  Wallet,
  Trophy,
  Settings,
  Flame,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ACHIEVEMENTS } from "@/lib/demo";
import { useLocalState, type Note, type Highlight } from "@/lib/local-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Notes, Journal & Achievements" },
      {
        name: "description",
        content:
          "Your notes, journal entries, saved verses, earnings, achievements and app settings.",
      },
      { property: "og:title", content: "Profile — The Bible App" },
      {
        property: "og:description",
        content: "Notes, journal, saved items, earnings, achievements and settings.",
      },
    ],
  }),
  component: ProfilePage,
});

const TABS = ["Notes", "Journal", "Saved", "Earnings", "Achievements", "Settings"] as const;
type Tab = (typeof TABS)[number];

function ProfilePage() {
  const [tab, setTab] = useState<Tab>("Notes");
  const [notes] = useLocalState<Note[]>("notes", []);
  const [highlights] = useLocalState<Highlight[]>("highlights", []);
  const [points] = useLocalState<number>("points", 1250);
  const [journal, setJournal] = useLocalState<{ id: string; body: string; date: string }[]>(
    "journal",
    [],
  );
  const [draft, setDraft] = useState("");
  const [prefs, setPrefs] = useLocalState<{ reminders: boolean; audioAutoplay: boolean }>(
    "prefs",
    { reminders: true, audioAutoplay: false },
  );

  return (
    <MobileShell>
      <PageHeader title="Profile" />

      <div className="px-4">
        <div className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-sm font-bold">BE</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-bold">Benjamin Edicha</p>
              <p className="text-xs text-muted-foreground">Grace Light Church · Lagos</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Streak", value: "12" },
              { label: "Notes", value: String(notes.length) },
              { label: "Saved", value: String(highlights.length) },
              { label: "Points", value: points.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary py-2">
                <p className="text-sm font-extrabold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      <div className="space-y-3 px-4 pb-6">
        {tab === "Notes" &&
          (notes.length ? (
            notes.map((n) => (
              <div key={n.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
                  <StickyNote className="h-3.5 w-3.5" /> {n.reference}
                </p>
                <p className="mt-1 font-serif text-xs leading-relaxed">{n.body}</p>
              </div>
            ))
          ) : (
            <Empty text="Notes you take while reading show up here." />
          ))}

        {tab === "Journal" && (
          <>
            <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="flex items-center gap-1.5 text-xs font-bold">
                <NotebookPen className="h-4 w-4 text-primary" /> New entry
              </p>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="What is God saying to you today?"
                className="mt-2 min-h-24 rounded-2xl"
              />
              <button
                onClick={() => {
                  if (!draft.trim()) return;
                  setJournal((j) => [
                    {
                      id: crypto.randomUUID(),
                      body: draft.trim(),
                      date: new Date().toLocaleDateString(),
                    },
                    ...j,
                  ]);
                  setDraft("");
                  toast.success("Journal entry saved");
                }}
                className="mt-2 w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground"
              >
                Save entry
              </button>
            </div>
            {journal.map((j) => (
              <div key={j.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <p className="text-[11px] font-bold text-primary">{j.date}</p>
                <p className="mt-1 font-serif text-xs leading-relaxed">{j.body}</p>
              </div>
            ))}
          </>
        )}

        {tab === "Saved" &&
          (highlights.length ? (
            highlights.map((h) => (
              <div key={h.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
                  <Bookmark className="h-3.5 w-3.5" /> {h.reference}
                </p>
                <p className="mt-1 font-serif text-xs leading-relaxed">{h.text}</p>
              </div>
            ))
          ) : (
            <Empty text="Highlight a verse to save it here." />
          ))}

        {tab === "Earnings" && (
          <>
            <div className="rounded-3xl bg-success p-5 text-ink-foreground shadow-[var(--shadow-card)]">
              <p className="flex items-center gap-2 text-xs opacity-90">
                <Wallet className="h-4 w-4" /> Available balance
              </p>
              <p className="mt-1 text-3xl font-extrabold">{points.toLocaleString()} pts</p>
            </div>
            {[
              { t: "Watch & Earn", v: "+620 pts" },
              { t: "Daily reading", v: "+400 pts" },
              { t: "Affiliate", v: "+230 pts" },
            ].map((r) => (
              <div
                key={r.t}
                className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <span className="text-sm font-medium">{r.t}</span>
                <span className="text-xs font-bold text-success">{r.v}</span>
              </div>
            ))}
          </>
        )}

        {tab === "Achievements" && (
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.id}
                className={`flex flex-col items-center gap-2 rounded-2xl p-3 text-center shadow-[var(--shadow-card)] ${
                  a.earned ? "bg-card" : "bg-secondary opacity-60"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    a.earned ? "bg-flame-soft text-flame" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {a.earned ? <Trophy className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
                </span>
                <p className="text-[11px] font-semibold leading-tight">{a.title}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Settings" && (
          <>
            <SettingRow
              label="Daily reading reminder"
              checked={prefs.reminders}
              onChange={(v) => setPrefs((p) => ({ ...p, reminders: v }))}
            />
            <SettingRow
              label="Autoplay audio Bible"
              checked={prefs.audioAutoplay}
              onChange={(v) => setPrefs((p) => ({ ...p, audioAutoplay: v }))}
            />
            <button
              onClick={() => toast("Settings", { description: "Account settings opened." })}
              className="flex w-full items-center gap-2 rounded-2xl bg-card p-4 text-left text-sm font-medium shadow-[var(--shadow-card)]"
            >
              <Settings className="h-4 w-4 text-muted-foreground" /> Account & privacy
            </button>
          </>
        )}
      </div>
    </MobileShell>
  );
}

function SettingRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
      <span className="text-sm font-medium">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="pt-10 text-center text-xs text-muted-foreground">{text}</p>;
}
