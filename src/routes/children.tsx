import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Play, Headphones, Gamepad2, Star, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { KIDS_CONTENT, MEMORY_VERSES } from "@/lib/demo";
import { useLocalState } from "@/lib/local-store";
import kidsArt from "@/assets/kids-story.jpg";

export const Route = createFileRoute("/children")({
  head: () => ({
    meta: [
      { title: "Children's Bible — Stories, Videos & Games" },
      {
        name: "description",
        content:
          "Bible stories, videos, audio, games and memory verses made for kids to learn and enjoy.",
      },
      { property: "og:title", content: "Children's Bible" },
      {
        property: "og:description",
        content: "Stories, videos, audio, games and memory verses for kids.",
      },
    ],
  }),
  component: ChildrenPage,
});

const TABS = ["Stories", "Videos", "Audio", "Games", "Memory Verses"] as const;
type Tab = (typeof TABS)[number];

const ICONS = { Stories: BookOpen, Videos: Play, Audio: Headphones, Games: Gamepad2 };

function ChildrenPage() {
  const [tab, setTab] = useState<Tab>("Stories");
  const [learned, setLearned] = useLocalState<string[]>("memory-verses", ["m1", "m2"]);
  const items = KIDS_CONTENT.filter((k) => k.type === tab);

  return (
    <MobileShell>
      <PageHeader title="Children's Bible" subtitle="Learn, play and grow" />

      <div className="px-4">
        <div className="overflow-hidden rounded-3xl bg-kids-soft shadow-[var(--shadow-card)]">
          <img
            src={kidsArt}
            alt="Noah's ark illustration"
            width={768}
            height={768}
            className="h-40 w-full object-cover"
          />
          <div className="p-4">
            <p className="text-sm font-extrabold text-kids">God Made Everything</p>
            <p className="text-xs text-muted-foreground">
              Today's story · 6 min · ages 4-8
            </p>
          </div>
        </div>
      </div>

      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      <div className="px-4 pb-6">
        {tab === "Memory Verses" ? (
          <div className="space-y-2">
            {MEMORY_VERSES.map((v) => {
              const isLearned = learned.includes(v.id);
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setLearned((l) =>
                      isLearned ? l.filter((x) => x !== v.id) : [...l, v.id],
                    );
                    if (!isLearned) toast.success("Verse memorised! ⭐");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-card)]"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isLearned ? "bg-success text-ink-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isLearned ? <Check className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  </span>
                  <span className="text-sm font-semibold">{v.reference}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {isLearned ? "Learned" : "Practise"}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((k) => {
              const Icon = ICONS[k.type as keyof typeof ICONS] ?? BookOpen;
              return (
                <button
                  key={k.id}
                  onClick={() => toast(k.title, { description: `${k.minutes} min` })}
                  className="rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-card)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-kids-soft text-kids">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-2 text-sm font-semibold leading-snug">{k.title}</p>
                  <p className="text-xs text-muted-foreground">{k.minutes} min</p>
                </button>
              );
            })}
            {!items.length ? (
              <p className="col-span-2 pt-10 text-center text-xs text-muted-foreground">
                More coming soon.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </MobileShell>
  );
}
