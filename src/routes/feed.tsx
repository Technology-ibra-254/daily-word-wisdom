import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Share2, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { FEED_ITEMS } from "@/lib/demo";
import worship from "@/assets/worship.jpg";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed — Videos, Sermons & Worship" },
      {
        name: "description",
        content:
          "Watch short videos, full sermons, worship sessions, testimonies and content from Christian creators.",
      },
      { property: "og:title", content: "Feed — Videos, Sermons & Worship" },
      {
        property: "og:description",
        content: "Videos, sermons, worship, testimonies and Christian creators.",
      },
    ],
  }),
  component: FeedPage,
});

const TABS = ["Videos", "Sermons", "Worship", "Testimonies", "Christian Creators"] as const;
type Tab = (typeof TABS)[number];

function FeedPage() {
  const [tab, setTab] = useState<Tab>("Videos");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const items = FEED_ITEMS.filter((f) => f.kind === tab);

  return (
    <MobileShell>
      <PageHeader title="Feed" subtitle="Fresh from the community" />
      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      <div className="space-y-4 px-4 pb-6">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]"
          >
            <div className="relative">
              <img
                src={worship}
                alt={item.title}
                loading="lazy"
                width={768}
                height={1024}
                className="h-64 w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/50 text-ink-foreground backdrop-blur">
                  <Play className="h-6 w-6" />
                </span>
              </div>
              <span className="absolute left-3 top-3 rounded-full bg-ink/60 px-2 py-1 text-[10px] font-semibold text-ink-foreground">
                {item.kind}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold leading-snug">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.creator}</p>
              <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
                <button
                  onClick={() => setLiked((l) => ({ ...l, [item.id]: !l[item.id] }))}
                  className="flex items-center gap-1.5"
                >
                  <Heart
                    className={`h-4 w-4 ${liked[item.id] ? "fill-destructive text-destructive" : ""}`}
                  />
                  {item.likes}
                </button>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" />
                  {item.comments}
                </span>
                <button
                  onClick={() => toast.success("Shared")}
                  className="ml-auto flex items-center gap-1.5"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </article>
        ))}
        {!items.length ? (
          <p className="pt-10 text-center text-xs text-muted-foreground">
            Nothing here yet — check back soon.
          </p>
        ) : null}
      </div>
    </MobileShell>
  );
}
