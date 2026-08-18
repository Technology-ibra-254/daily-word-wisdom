import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Flame,
  BookOpen,
  Headphones,
  HeartHandshake,
  Gift,
  Baby,
  GraduationCap,
  Mic,
  Users,
  ChevronRight,
  Share2,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/app/MobileShell";
import { EmptyState } from "@/components/app/AuthGate";
import { Button } from "@/components/ui/button";
import { passageQuery } from "@/lib/bible";
import { useAuth } from "@/lib/auth";
import { useProfile, useStreakTracker, usePosts, usePrayers, useAddNote } from "@/lib/cloud";
import verseBg from "@/assets/verse-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — The Bible App" },
      {
        name: "description",
        content:
          "Your verse of the day, continue reading, community devotionals, prayer and your cloud-saved daily streak.",
      },
      { property: "og:title", content: "Home — The Bible App" },
      {
        property: "og:description",
        content: "Verse of the day, devotionals, prayer and streaks saved to your account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const SECTIONS = [
  { to: "/bible", label: "Bible", icon: BookOpen, tone: "bg-brand-soft text-brand" },
  { to: "/sermons", label: "Sermons", icon: Mic, tone: "bg-flame-soft text-flame" },
  { to: "/study", label: "Study", icon: GraduationCap, tone: "bg-info-soft text-info" },
  { to: "/feed", label: "Feed", icon: Headphones, tone: "bg-accent text-accent-foreground" },
  { to: "/earn", label: "Earn", icon: Gift, tone: "bg-success-soft text-success" },
  { to: "/children", label: "Children", icon: Baby, tone: "bg-kids-soft text-kids" },
  { to: "/community", label: "Community", icon: Users, tone: "bg-secondary text-secondary-foreground" },
  { to: "/profile", label: "Profile", icon: HeartHandshake, tone: "bg-muted text-muted-foreground" },
] as const;

const DAILY_VERSES = [
  "Isaiah 41:10",
  "Psalm 23:1-3",
  "John 14:27",
  "Philippians 4:6-7",
  "Proverbs 3:5-6",
  "Romans 8:28",
  "Joshua 1:9",
];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function HomePage() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const streak = useStreakTracker();
  const { data: devotionals = [] } = usePosts("devotional");
  const { data: prayers = [] } = usePrayers();
  const addNote = useAddNote();

  const dayIndex = Math.floor(Date.now() / 86_400_000) % DAILY_VERSES.length;
  const reference = DAILY_VERSES[dayIndex]!;
  const { data: passage } = useQuery(passageQuery(reference, "kjv"));
  const verseText = passage?.verses.map((v) => v.text).join(" ") ?? "";

  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <MobileShell>
      <div className="px-4 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="The Bible App"
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl"
          />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{greeting}</p>
            <h1 className="font-display text-2xl leading-tight tracking-tight">
              {profile?.display_name ?? (user ? "Friend" : "Welcome")}
            </h1>
          </div>
          {user ? (
            <div className="flex items-center gap-1 rounded-full bg-flame-soft px-3 py-1.5 text-flame">
              <Flame className="h-4 w-4" />
              <span className="font-stat text-sm font-bold">{streak}</span>
            </div>
          ) : (
            <Button asChild size="sm" className="rounded-full">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Verse of the day */}
      <section className="px-4">
        <div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
          <img
            src={verseBg}
            alt="Sunrise over the ocean"
            width={1024}
            height={640}
            className="h-52 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-ink-foreground">
            <p className="text-[11px] font-semibold uppercase tracking-widest opacity-80">
              Verse of the Day
            </p>
            <p className="mt-1 font-scripture text-[15px] leading-snug">
              {verseText ? `“${verseText}”` : "Loading today's verse…"}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-stat text-xs font-semibold">{reference}</span>
              <div className="flex gap-2">
                <button
                  aria-label="Save verse"
                  onClick={() => {
                    if (!user) return toast.error("Sign in to save verses");
                    addNote.mutate(
                      { reference, body: verseText },
                      { onSuccess: () => toast.success("Saved to your notes") },
                    );
                  }}
                  className="rounded-full bg-ink-foreground/15 p-2"
                >
                  <Bookmark className="h-4 w-4" />
                </button>
                <button
                  aria-label="Share verse"
                  onClick={() => {
                    const text = `“${verseText}” — ${reference}`;
                    if (navigator.share) void navigator.share({ text });
                    else {
                      void navigator.clipboard.writeText(text);
                      toast.success("Verse copied");
                    }
                  }}
                  className="rounded-full bg-ink-foreground/15 p-2"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue reading */}
      <section className="px-4 pt-5">
        <SectionTitle title="Continue Reading" to="/bible" />
        <Link
          to="/bible"
          className="mt-2 flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
        >
          <div>
            <p className="text-sm font-semibold">Open your Bible</p>
            <p className="text-xs text-muted-foreground">
              Read, compare translations, highlight and take notes
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </section>

      {/* Streak */}
      <section className="px-4 pt-5">
        <SectionTitle title="Your Streak" />
        <div className="mt-2 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          {user ? (
            <>
              <p className="text-sm">
                <span className="font-stat text-xl font-bold text-flame">{streak}</span>{" "}
                <span className="text-muted-foreground">day streak · saved to your account</span>
              </p>
              <div className="mt-3 flex justify-between">
                {DAYS.map((d, i) => (
                  <span
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-stat text-xs font-bold ${
                      i <= todayIdx && streak > todayIdx - i
                        ? "bg-flame text-ink-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sign in and your streak is tracked and stored in the cloud automatically.
            </p>
          )}
        </div>
      </section>

      {/* Devotional */}
      <section className="pt-5">
        <div className="px-4">
          <SectionTitle title="Devotional" to="/community" />
        </div>
        {devotionals.length ? (
          <div className="no-scrollbar mt-2 flex gap-3 overflow-x-auto px-4 pb-1">
            {devotionals.map((d) => (
              <article
                key={d.id}
                className="w-60 shrink-0 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <p className="text-sm font-semibold">{d.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {d.profiles?.display_name ?? "Member"} ·{" "}
                  {new Date(d.created_at).toLocaleDateString()}
                </p>
                <p className="mt-2 line-clamp-4 font-serif text-xs leading-relaxed text-muted-foreground">
                  {d.body}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-4 pt-2">
            <EmptyState
              title="No devotionals yet"
              hint="Devotionals written by members appear here. Be the first to publish one."
              action={
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/community">Write a devotional</Link>
                </Button>
              }
            />
          </div>
        )}
      </section>

      {/* Prayer */}
      <section className="px-4 pt-5">
        <SectionTitle title="Prayer" to="/community" />
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Link
            to="/community"
            className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-[var(--shadow-card)]"
          >
            <HeartHandshake className="h-5 w-5" />
            <p className="mt-2 text-sm font-semibold">Prayer Wall</p>
            <p className="font-stat text-xs opacity-80">{prayers.length} requests</p>
          </Link>
          <Link
            to="/community"
            className="rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-card)]"
          >
            <Flame className="h-5 w-5 text-flame" />
            <p className="mt-2 text-sm font-semibold">Share a request</p>
            <p className="text-xs text-muted-foreground">The community prays with you</p>
          </Link>
        </div>
      </section>

      {/* All sections */}
      <section className="px-4 pt-5">
        <SectionTitle title="Explore" />
        <div className="mt-2 grid grid-cols-4 gap-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]"
            >
              <span className={`rounded-xl p-2 ${s.tone}`}>
                <s.icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <span className="text-[11px] font-medium">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </MobileShell>
  );
}

function SectionTitle({ title, to }: { title: string; to?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-xl tracking-tight">{title}</h2>
      {to ? (
        <Link to={to} className="flex items-center text-xs font-medium text-primary">
          See all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
