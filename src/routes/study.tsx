import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Send, BookMarked, Languages, Library, Link2 } from "lucide-react";
import { useState } from "react";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { Input } from "@/components/ui/input";
import { AI_SUGGESTIONS } from "@/lib/demo";

export const Route = createFileRoute("/study")({
  head: () => ({
    meta: [
      { title: "Study — AI Bible Assistant & Original Languages" },
      {
        name: "description",
        content:
          "Ask the AI Bible assistant, read commentary, explore Greek and Hebrew, search the concordance and follow cross references.",
      },
      { property: "og:title", content: "Study — AI Bible Assistant" },
      {
        property: "og:description",
        content: "Commentary, Greek, Hebrew, concordance and cross references.",
      },
    ],
  }),
  component: StudyPage,
});

const TABS = [
  "AI Bible Assistant",
  "Commentary",
  "Greek",
  "Hebrew",
  "Concordance",
  "Cross References",
] as const;
type Tab = (typeof TABS)[number];

type Msg = { role: "user" | "assistant"; text: string };

const CANNED: Record<string, string> = {
  default:
    "Here is what the passage teaches: God's word is the source of light and life. Read it slowly, ask what it says about God, then what it asks of you.",
};

const COMMENTARY = [
  {
    ref: "John 1:1",
    body: "The Word existed before creation, was distinct from the Father, and shares the divine nature. John deliberately echoes Genesis 1:1.",
  },
  {
    ref: "John 1:5",
    body: "Darkness cannot overpower light. The verb suggests both 'understood' and 'overcame' — neither is possible against Christ.",
  },
];

const LEXICON = {
  Greek: [
    { term: "λόγος (logos)", gloss: "word, reason, divine expression", strong: "G3056" },
    { term: "ἀγάπη (agapē)", gloss: "self-giving love", strong: "G26" },
    { term: "πίστις (pistis)", gloss: "faith, trust, faithfulness", strong: "G4102" },
  ],
  Hebrew: [
    { term: "חֶסֶד (chesed)", gloss: "steadfast covenant love", strong: "H2617" },
    { term: "שָׁלוֹם (shalom)", gloss: "wholeness, peace", strong: "H7965" },
    { term: "רוּחַ (ruach)", gloss: "spirit, breath, wind", strong: "H7307" },
  ],
};

const CROSS_REFS = [
  { from: "John 1:1", to: ["Genesis 1:1", "1 John 1:1", "Colossians 1:16"] },
  { from: "Isaiah 41:10", to: ["Joshua 1:9", "Psalm 46:1", "Romans 8:31"] },
];

function StudyPage() {
  const [tab, setTab] = useState<Tab>("AI Bible Assistant");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Ask me anything about scripture, doctrine or your study plan." },
  ]);
  const [draft, setDraft] = useState("");
  const [term, setTerm] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", text: CANNED.default },
    ]);
    setDraft("");
  };

  return (
    <MobileShell>
      <PageHeader title="Study Center" subtitle="Go deeper in the word" />
      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "AI Bible Assistant" && (
        <div className="px-4 pb-6">
          <div className="rounded-3xl bg-ink p-4 text-ink-foreground shadow-[var(--shadow-float)]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-flame" />
              <p className="text-sm font-bold">AI Bible Assistant</p>
            </div>
            <div className="mt-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-ink-foreground/10"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
              {AI_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="shrink-0 rounded-full bg-ink-foreground/10 px-3 py-1.5 text-[11px]"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="mt-4 flex items-center gap-2 rounded-full bg-ink-foreground/10 px-3 py-2"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask anything about the Bible…"
                className="flex-1 bg-transparent text-xs outline-none placeholder:text-ink-foreground/50"
              />
              <button
                type="submit"
                aria-label="Send"
                className="rounded-full bg-primary p-2 text-primary-foreground"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === "Commentary" && (
        <div className="space-y-3 px-4 pb-6">
          {COMMENTARY.map((c) => (
            <div key={c.ref} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2">
                <BookMarked className="h-4 w-4 text-primary" />
                <p className="text-xs font-bold text-primary">{c.ref}</p>
              </div>
              <p className="mt-2 font-serif text-xs leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      {(tab === "Greek" || tab === "Hebrew") && (
        <div className="space-y-3 px-4 pb-6">
          {LEXICON[tab].map((l) => (
            <div key={l.strong} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{l.term}</p>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold">
                  {l.strong}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Languages className="h-3.5 w-3.5" /> {l.gloss}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "Concordance" && (
        <div className="px-4 pb-6">
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search a word e.g. love"
            className="h-11 rounded-full"
          />
          <div className="mt-4 space-y-2">
            {(term.trim() ? ["1 Corinthians 13:4", "1 John 4:8", "John 3:16", "Romans 5:8"] : []).map(
              (r) => (
                <div key={r} className="flex items-center gap-2 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
                  <Library className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold">{r}</p>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    “{term}”
                  </span>
                </div>
              ),
            )}
            {!term.trim() ? (
              <p className="pt-8 text-center text-xs text-muted-foreground">
                Type a word to find every occurrence.
              </p>
            ) : null}
          </div>
        </div>
      )}

      {tab === "Cross References" && (
        <div className="space-y-3 px-4 pb-6">
          {CROSS_REFS.map((c) => (
            <div key={c.from} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="text-xs font-bold text-primary">{c.from}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.to.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium"
                  >
                    <Link2 className="h-3 w-3" /> {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </MobileShell>
  );
}
