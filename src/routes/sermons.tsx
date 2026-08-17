import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Sparkles, ListChecks, FileText, Mic } from "lucide-react";
import { useState } from "react";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { SERMONS } from "@/lib/demo";
import sermonThumb from "@/assets/sermon-thumb.jpg";

export const Route = createFileRoute("/sermons")({
  head: () => ({
    meta: [
      { title: "Sermons — Recordings, Transcripts & AI Study" },
      {
        name: "description",
        content:
          "Browse sermon recordings with transcripts, summaries, key points and AI-generated study guides.",
      },
      { property: "og:title", content: "Sermons — Recordings & Transcripts" },
      {
        property: "og:description",
        content: "Recordings, transcripts, summaries, key points and AI study.",
      },
    ],
  }),
  component: SermonsPage,
});

const TABS = ["Recordings", "Transcripts", "Summaries", "Key Points", "AI Study"] as const;
type Tab = (typeof TABS)[number];

function SermonsPage() {
  const [tab, setTab] = useState<Tab>("Recordings");
  const [activeId, setActiveId] = useState(SERMONS[0].id);
  const active = SERMONS.find((s) => s.id === activeId)!;

  return (
    <MobileShell>
      <PageHeader
        title="Sermons"
        subtitle="Listen, read and study"
        right={
          <Link
            to="/record"
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            <Mic className="h-3.5 w-3.5" /> Record
          </Link>
        }
      />
      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "Recordings" ? (
        <div className="space-y-3 px-4 pb-6">
          {SERMONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveId(s.id);
                setTab("Transcripts");
              }}
              className="flex w-full gap-3 overflow-hidden rounded-2xl bg-card p-3 text-left shadow-[var(--shadow-card)]"
            >
              <img
                src={sermonThumb}
                alt={s.title}
                loading="lazy"
                width={1024}
                height={640}
                className="h-16 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.speaker}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {s.date} · {s.duration}
                </p>
              </div>
              <span className="self-center rounded-full bg-primary p-2 text-primary-foreground">
                <Play className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 pb-6">
          <div className="mb-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold">{active.title}</p>
            <p className="text-xs text-muted-foreground">
              {active.speaker} · {active.duration}
            </p>
          </div>

          {tab === "Transcripts" && (
            <div className="space-y-2">
              {active.transcript.map((line, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-3 text-xs leading-relaxed shadow-[var(--shadow-card)] ${
                    i === 2 ? "bg-brand-soft" : "bg-card"
                  }`}
                >
                  <span className="mr-2 font-bold text-primary">{line.t}</span>
                  {line.text}
                </div>
              ))}
            </div>
          )}

          {tab === "Summaries" && (
            <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <p className="text-xs font-bold text-primary">Summary</p>
              </div>
              <p className="mt-2 font-serif text-xs leading-relaxed">{active.summary}</p>
            </div>
          )}

          {tab === "Key Points" && (
            <div className="space-y-2">
              {active.keyPoints.map((k, i) => (
                <div
                  key={k}
                  className="flex items-start gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-bold text-brand">
                    {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed">{k}</p>
                  <ListChecks className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}

          {tab === "AI Study" && (
            <div className="rounded-3xl bg-ink p-4 text-ink-foreground shadow-[var(--shadow-float)]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-flame" />
                <p className="text-sm font-bold">AI study guide</p>
              </div>
              <div className="mt-3 space-y-3 text-xs leading-relaxed">
                <p className="rounded-2xl bg-ink-foreground/10 p-3">
                  <strong>Discussion questions</strong>
                  <br />
                  1. Where is God asking you to move before you understand?
                  <br />
                  2. What has hearing God cost you this year?
                  <br />
                  3. Who needs your obedience this week?
                </p>
                <p className="rounded-2xl bg-ink-foreground/10 p-3">
                  <strong>Related scripture</strong>
                  <br />
                  Hebrews 11:1-8 · Romans 10:17 · James 2:17
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </MobileShell>
  );
}
