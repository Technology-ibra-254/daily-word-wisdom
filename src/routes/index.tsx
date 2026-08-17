import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Progress } from "@/components/ui/progress";
import { useLocalState } from "@/lib/local-store";
import { VERSE_OF_DAY, DEVOTIONALS, PLANS } from "@/lib/demo";
import verseBg from "@/assets/verse-bg.jpg";
import logo from "@/assets/bible-logo.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — The Bible App" },
      {
        name: "description",
        content:
          "Your verse of the day, reading plans, devotionals, prayer and daily streak in one place.",
      },
      { property: "og:title", content: "Home — The Bible App" },
      {
        property: "og:description",
        content: "Verse of the day, reading plans, devotionals, prayer and streaks.",
      },
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

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function HomePage() {
  const [streak, setStreak] = useLocalState<{ count: number; days: boolean[] }>(
    "streak",
    { count: 12, days: [true, true, true, true, true, false, false] },
  );
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <MobileShell>
      <div className="px-4 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="The Bible App"
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl"
          />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Good morning</p>
            <h1 className="text-lg font-bold tracking-tight">Benjamin</h1>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-flame-soft px-3 py-1.5 text-flame">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-bold">{streak.count}</span>
          </div>
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
            <p className="mt-1 font-serif text-[15px] leading-snug">
              “{VERSE_OF_DAY.text}”
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-semibold">{VERSE_OF_DAY.reference}</span>
              <div className="flex gap-2">
                <button
                  aria-label="Save verse"
                  onClick={() => toast.success("Verse saved")}
                  className="rounded-full bg-ink-foreground/15 p-2"
                >
                  <Bookmark className="h-4 w-4" />
                </button>
                <button
                  aria-label="Share verse"
                  onClick={() => toast.success("Share sheet opened")}
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
          className="mt-2 block rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">John 1</p>
              <p className="text-xs text-muted-foreground">Gospel of John · Day 3 of 21</p>
            </div>
            <span className="text-xs font-bold text-primary">21%</span>
          </div>
          <Progress value={21} className="mt-3 h-2" />
        </Link>
      </section>

      {/* Streak */}
      <section className="px-4 pt-5">
        <SectionTitle title="Your Streak" />
        <div className="mt-2 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              <span className="text-xl font-extrabold text-flame">{streak.count}</span>{" "}
              <span className="text-muted-foreground">day streak</span>
            </p>
            <button
              onClick={() =>
                setStreak((s) => {
                  if (s.days[today]) return s;
                  const days = [...s.days];
                  days[today] = true;
                  toast.success("Today marked complete");
                  return { count: s.count + 1, days };
                })
              }
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Mark today
            </button>
          </div>
          <div className="mt-3 flex justify-between">
            {DAYS.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    streak.days[i]
                      ? "bg-flame text-ink-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {d}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Devotional */}
      <section className="pt-5">
        <div className="px-4">
          <SectionTitle title="Devotional" />
        </div>
        <div className="no-scrollbar mt-2 flex gap-3 overflow-x-auto px-4 pb-1">
          {DEVOTIONALS.map((d) => (
            <article
              key={d.id}
              className="w-60 shrink-0 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <p className="text-sm font-semibold">{d.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {d.author} · {d.minutes} min
              </p>
              <p className="mt-2 font-serif text-xs leading-relaxed text-muted-foreground">
                {d.excerpt}
              </p>
            </article>
          ))}
        </div>
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
            <p className="text-xs opacity-80">3 new requests</p>
          </Link>
          <button
            onClick={() => toast.success("Prayer added to your list")}
            className="rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-card)]"
          >
            <Flame className="h-5 w-5 text-flame" />
            <p className="mt-2 text-sm font-semibold">Add a prayer</p>
            <p className="text-xs text-muted-foreground">Keep a private list</p>
          </button>
        </div>
      </section>

      {/* Reading plans */}
      <section className="px-4 pt-5">
        <SectionTitle title="Recommended for you" />
        <div className="mt-2 space-y-2">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>{p.title}</span>
                <span className="text-xs text-muted-foreground">{p.days} days</span>
              </div>
              <Progress value={p.progress} className="mt-2 h-1.5" />
            </div>
          ))}
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
                <s.icon className="h-5 w-5" />
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
      <h2 className="text-sm font-bold tracking-tight">{title}</h2>
      {to ? (
        <Link to={to} className="flex items-center text-xs font-medium text-primary">
          See all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
