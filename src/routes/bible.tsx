import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Play,
  Pause,
  Highlighter,
  StickyNote,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { BOOKS, TRANSLATIONS, passageQuery } from "@/lib/bible";
import { useLocalState, type Highlight, type Note } from "@/lib/local-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/bible")({
  head: () => ({
    meta: [
      { title: "Bible — Read, Compare, Listen" },
      {
        name: "description",
        content:
          "Read the Bible in multiple translations, compare side by side, listen to audio, search, and keep notes and highlights.",
      },
      { property: "og:title", content: "Bible — Read, Compare, Listen" },
      {
        property: "og:description",
        content: "Multiple translations, compare view, audio, search, notes and highlights.",
      },
    ],
  }),
  component: BiblePage,
});

const TABS = ["Read", "Compare", "Audio", "Search", "Notes", "Highlights"] as const;
type Tab = (typeof TABS)[number];

const HIGHLIGHT_TONES: Record<Highlight["color"], string> = {
  yellow: "bg-flame-soft",
  green: "bg-success-soft",
  blue: "bg-info-soft",
  pink: "bg-kids-soft",
};

function BiblePage() {
  const [tab, setTab] = useState<Tab>("Read");
  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState(1);
  const [translation, setTranslation] = useState("kjv");
  const [compareWith, setCompareWith] = useState("web");
  const [selected, setSelected] = useState<{ verse: number; text: string } | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState(false);

  const [highlights, setHighlights] = useLocalState<Highlight[]>("highlights", []);
  const [notes, setNotes] = useLocalState<Note[]>("notes", []);

  const reference = `${book} ${chapter}`;
  const primary = useQuery(passageQuery(reference, translation));
  const secondary = useQuery({
    ...passageQuery(reference, compareWith),
    enabled: tab === "Compare",
  });
  const searchResults = useQuery({
    ...passageQuery(query, translation),
    enabled: tab === "Search" && query.trim().length > 2,
  });

  const chapters = useMemo(
    () => BOOKS.find((b) => b.name === book)?.chapters ?? 1,
    [book],
  );

  const highlightFor = (verse: number) =>
    highlights.find((h) => h.reference === `${reference}:${verse}`);

  return (
    <MobileShell>
      <PageHeader
        title="Bible"
        subtitle={`${reference} · ${TRANSLATIONS.find((t) => t.id === translation)?.name}`}
      />
      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      {(tab === "Read" || tab === "Compare" || tab === "Audio") && (
        <div className="flex items-center gap-2 px-4">
          <Select
            value={book}
            onValueChange={(v) => {
              setBook(v);
              setChapter(1);
            }}
          >
            <SelectTrigger className="h-9 flex-1 rounded-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOKS.map((b) => (
                <SelectItem key={b.name} value={b.name}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(chapter)} onValueChange={(v) => setChapter(Number(v))}>
            <SelectTrigger className="h-9 w-20 rounded-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: chapters }, (_, i) => i + 1).map((c) => (
                <SelectItem key={c} value={String(c)}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={translation} onValueChange={setTranslation}>
            <SelectTrigger className="h-9 w-24 rounded-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRANSLATIONS.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {tab === "Read" && (
        <div className="px-4 py-4">
          {primary.isLoading ? (
            <LoadingLines />
          ) : (
            <article className="space-y-3 font-serif text-[15px] leading-relaxed">
              {primary.data?.verses.map((v) => {
                const hl = highlightFor(v.verse);
                return (
                  <p
                    key={v.verse}
                    onClick={() => setSelected(v)}
                    className={`cursor-pointer rounded-md px-1 py-0.5 ${
                      hl ? HIGHLIGHT_TONES[hl.color] : ""
                    }`}
                  >
                    <sup className="mr-1 font-sans text-[10px] font-bold text-primary">
                      {v.verse}
                    </sup>
                    {v.text}
                  </p>
                );
              })}
            </article>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              disabled={chapter <= 1}
              onClick={() => setChapter((c) => Math.max(1, c - 1))}
              className="flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-xs font-semibold disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              disabled={chapter >= chapters}
              onClick={() => setChapter((c) => Math.min(chapters, c + 1))}
              className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {tab === "Compare" && (
        <div className="px-4 py-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Compare with</span>
            <Select value={compareWith} onValueChange={setCompareWith}>
              <SelectTrigger className="h-8 w-28 rounded-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSLATIONS.filter((t) => t.id !== translation).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            {(primary.data?.verses ?? []).map((v, i) => (
              <div key={v.verse} className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
                <p className="text-[11px] font-bold text-primary">
                  {reference}:{v.verse}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3 font-serif text-xs leading-relaxed">
                  <p>{v.text}</p>
                  <p className="text-muted-foreground">
                    {secondary.data?.verses[i]?.text ?? "…"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Audio" && (
        <div className="px-4 py-4">
          <div className="rounded-3xl bg-ink p-5 text-ink-foreground shadow-[var(--shadow-float)]">
            <p className="text-xs opacity-70">Now playing</p>
            <p className="mt-1 text-lg font-bold">{reference}</p>
            <p className="text-xs opacity-70">
              {TRANSLATIONS.find((t) => t.id === translation)?.full}
            </p>
            <div className="mt-5 flex h-16 items-end justify-between gap-[3px]">
              {Array.from({ length: 44 }).map((_, i) => (
                <span
                  key={i}
                  className="w-full rounded-full bg-ink-foreground/60"
                  style={{ height: `${20 + Math.abs(Math.sin(i * 0.7)) * 80}%` }}
                />
              ))}
            </div>
            <Slider defaultValue={[32]} max={100} className="mt-5" />
            <div className="mt-2 flex justify-between text-[11px] opacity-70">
              <span>04:12</span>
              <span>12:58</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "Search" && (
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a passage e.g. Psalm 23"
              className="h-11 rounded-full pl-9"
            />
          </div>
          <div className="mt-4 space-y-2">
            {searchResults.data?.verses.map((v) => (
              <div key={v.verse} className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
                <p className="text-[11px] font-bold text-primary">
                  {searchResults.data?.reference}:{v.verse}
                </p>
                <p className="mt-1 font-serif text-xs leading-relaxed">{v.text}</p>
              </div>
            ))}
            {query.trim().length > 2 && searchResults.isLoading ? <LoadingLines /> : null}
            {query.trim().length <= 2 ? (
              <p className="pt-6 text-center text-xs text-muted-foreground">
                Type a book and chapter to search scripture.
              </p>
            ) : null}
          </div>
        </div>
      )}

      {tab === "Notes" && (
        <ListPane
          empty="No notes yet. Tap a verse while reading to add one."
          items={notes.map((n) => ({
            id: n.id,
            title: n.reference,
            body: n.body,
            onRemove: () => setNotes((prev) => prev.filter((x) => x.id !== n.id)),
          }))}
        />
      )}

      {tab === "Highlights" && (
        <ListPane
          empty="No highlights yet. Tap a verse to highlight it."
          items={highlights.map((h) => ({
            id: h.id,
            title: h.reference,
            body: h.text,
            tone: HIGHLIGHT_TONES[h.color],
            onRemove: () => setHighlights((prev) => prev.filter((x) => x.id !== h.id)),
          }))}
        />
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {reference}:{selected?.verse}
            </DialogTitle>
          </DialogHeader>
          <p className="font-serif text-sm leading-relaxed">{selected?.text}</p>

          <div className="flex items-center gap-2">
            <Highlighter className="h-4 w-4 text-muted-foreground" />
            {(["yellow", "green", "blue", "pink"] as const).map((c) => (
              <button
                key={c}
                aria-label={`Highlight ${c}`}
                onClick={() => {
                  if (!selected) return;
                  setHighlights((prev) => [
                    {
                      id: crypto.randomUUID(),
                      reference: `${reference}:${selected.verse}`,
                      text: selected.text,
                      color: c,
                      createdAt: new Date().toISOString(),
                    },
                    ...prev.filter(
                      (h) => h.reference !== `${reference}:${selected.verse}`,
                    ),
                  ]);
                  toast.success("Verse highlighted");
                  setSelected(null);
                }}
                className={`h-7 w-7 rounded-full ${HIGHLIGHT_TONES[c]} border border-border`}
              />
            ))}
            <button
              onClick={() => toast.success("Share sheet opened")}
              className="ml-auto rounded-full bg-secondary p-2"
              aria-label="Share verse"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <Textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Write a note on this verse…"
            className="min-h-24 rounded-2xl"
          />
          <button
            onClick={() => {
              if (!selected || !noteDraft.trim()) return;
              setNotes((prev) => [
                {
                  id: crypto.randomUUID(),
                  reference: `${reference}:${selected.verse}`,
                  body: noteDraft.trim(),
                  createdAt: new Date().toISOString(),
                },
                ...prev,
              ]);
              setNoteDraft("");
              setSelected(null);
              toast.success("Note saved");
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <StickyNote className="h-4 w-4" /> Save note
          </button>
        </DialogContent>
      </Dialog>
    </MobileShell>
  );
}

function LoadingLines() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-4 w-full animate-pulse rounded bg-secondary" />
      ))}
    </div>
  );
}

function ListPane({
  items,
  empty,
}: {
  items: {
    id: string;
    title: string;
    body: string;
    tone?: string;
    onRemove: () => void;
  }[];
  empty: string;
}) {
  if (!items.length)
    return <p className="px-6 pt-10 text-center text-xs text-muted-foreground">{empty}</p>;
  return (
    <div className="space-y-2 px-4 py-2">
      {items.map((i) => (
        <div
          key={i.id}
          className={`rounded-2xl p-3 shadow-[var(--shadow-card)] ${i.tone ?? "bg-card"}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-primary">{i.title}</p>
            <button
              onClick={i.onRemove}
              className="text-[11px] font-medium text-muted-foreground"
            >
              Remove
            </button>
          </div>
          <p className="mt-1 font-serif text-xs leading-relaxed">{i.body}</p>
        </div>
      ))}
    </div>
  );
}
