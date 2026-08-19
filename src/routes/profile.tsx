import { createFileRoute } from "@tanstack/react-router";
import {
  StickyNote,
  NotebookPen,
  Bookmark,
  Wallet,
  Trophy,
  Settings,
  Flame,
  LogOut,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { AuthGate, EmptyState } from "@/components/app/AuthGate";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocalState } from "@/lib/local-store";
import {
  useProfile,
  useUpdateProfile,
  useJournal,
  useAddJournalEntry,
  useDeleteJournalEntry,
  useNotes,
  useHighlights,
} from "@/lib/cloud";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const TABS = ["Notes", "Journal", "Saved", "Earnings", "Achievements", "Settings"] as const;
type Tab = (typeof TABS)[number];

function ProfilePage() {
  return (
    <MobileShell>
      <PageHeader title="Profile" />
      <AuthGate message="Sign in to keep your journal, notes and streak saved to your account.">
        <ProfileContent />
      </AuthGate>
    </MobileShell>
  );
}

function ProfileContent() {
  const [tab, setTab] = useState<Tab>("Notes");
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: journal = [], isLoading: journalLoading } = useJournal();
  const addEntry = useAddJournalEntry();
  const deleteEntry = useDeleteJournalEntry();
  const { data: notes = [] } = useNotes();
  const { data: highlights = [] } = useHighlights();

  const [draft, setDraft] = useState("");
  const [title, setTitle] = useState("");
  const [prefs, setPrefs] = useLocalState<{ reminders: boolean; audioAutoplay: boolean }>(
    "prefs",
    { reminders: true, audioAutoplay: false },
  );

  const name = profile?.display_name?.trim() || user?.email?.split("@")[0] || "Friend";
  const initials = name.slice(0, 2).toUpperCase();
  const points = profile?.points ?? 0;
  const streak = profile?.streak_days ?? 0;

  const achievements = [
    { id: "first-note", title: "First note", earned: notes.length > 0 },
    { id: "highlighter", title: "Highlighter", earned: highlights.length > 0 },
    { id: "journalist", title: "Journalist", earned: journal.length > 0 },
    { id: "week-streak", title: "7 day streak", earned: streak >= 7 },
    { id: "month-streak", title: "30 day streak", earned: streak >= 30 },
    { id: "point-1000", title: "1,000 points", earned: points >= 1000 },
  ];

  return (
    <>
      <div className="px-4">
        <div className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-sm font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-base font-bold">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Streak", value: String(streak) },
              { label: "Notes", value: String(notes.length) },
              { label: "Saved", value: String(highlights.length) },
              { label: "Points", value: points.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary py-2">
                <p className="font-stat text-sm font-extrabold">{s.value}</p>
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
            <EmptyState
              title="No notes yet"
              hint="Notes you take while reading the Bible are saved here."
            />
          ))}

        {tab === "Journal" && (
          <>
            <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="flex items-center gap-1.5 text-xs font-bold">
                <NotebookPen className="h-4 w-4 text-primary" /> New entry
              </p>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="mt-2 h-10 rounded-2xl"
              />
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="What is God saying to you today?"
                className="mt-2 min-h-24 rounded-2xl font-hand text-lg"
              />
              <button
                disabled={addEntry.isPending}
                onClick={() => {
                  if (!draft.trim()) return;
                  addEntry.mutate(
                    { title: title.trim(), body: draft.trim() },
                    {
                      onSuccess: () => {
                        setDraft("");
                        setTitle("");
                        toast.success("Journal entry saved to your account");
                      },
                      onError: (e) =>
                        toast.error(e instanceof Error ? e.message : "Could not save"),
                    },
                  );
                }}
                className="mt-2 w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
              >
                {addEntry.isPending ? "Saving…" : "Save entry"}
              </button>
            </div>

            {journalLoading ? (
              <div className="h-20 animate-pulse rounded-2xl bg-muted" />
            ) : journal.length ? (
              journal.map((j) => (
                <div key={j.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold text-primary">
                        {new Date(j.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {j.title ? (
                        <p className="text-sm font-semibold">{j.title}</p>
                      ) : null}
                    </div>
                    <button
                      aria-label="Delete entry"
                      onClick={() => deleteEntry.mutate(j.id)}
                      className="rounded-full p-1.5 text-muted-foreground"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 font-hand text-lg leading-snug">{j.body}</p>
                </div>
              ))
            ) : (
              <EmptyState title="Your journal is empty" hint="Write your first entry above." />
            )}
          </>
        )}

        {tab === "Saved" &&
          (highlights.length ? (
            highlights.map((h) => (
              <div key={h.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
                  <Bookmark className="h-3.5 w-3.5" /> {h.reference}
                </p>
                <p className="mt-1 font-scripture text-sm leading-relaxed">{h.text}</p>
              </div>
            ))
          ) : (
            <EmptyState title="Nothing saved yet" hint="Highlight a verse to save it here." />
          ))}

        {tab === "Earnings" && (
          <>
            <div className="rounded-3xl bg-success p-5 text-ink-foreground shadow-[var(--shadow-card)]">
              <p className="flex items-center gap-2 text-xs opacity-90">
                <Wallet className="h-4 w-4" /> Available balance
              </p>
              <p className="mt-1 font-stat text-3xl font-extrabold">
                {points.toLocaleString()} pts
              </p>
            </div>
            <EmptyState
              title="No payouts yet"
              hint="Points you earn from reading, streaks and creating content appear here."
            />
          </>
        )}

        {tab === "Achievements" && (
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((a) => (
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
            <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="text-xs font-bold">Display name</p>
              <Input
                defaultValue={profile?.display_name ?? ""}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== profile?.display_name) {
                    updateProfile.mutate(
                      { display_name: v },
                      { onSuccess: () => toast.success("Profile updated") },
                    );
                  }
                }}
                placeholder="Your name"
                className="mt-2 h-10 rounded-2xl"
              />
            </div>
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
              onClick={() => toast("Account & privacy", { description: "Coming soon." })}
              className="flex w-full items-center gap-2 rounded-2xl bg-card p-4 text-left text-sm font-medium shadow-[var(--shadow-card)]"
            >
              <Settings className="h-4 w-4 text-muted-foreground" /> Account & privacy
            </button>
            <button
              onClick={() => void signOut()}
              className="flex w-full items-center gap-2 rounded-2xl bg-card p-4 text-left text-sm font-medium text-destructive shadow-[var(--shadow-card)]"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </>
        )}
      </div>
    </>
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
