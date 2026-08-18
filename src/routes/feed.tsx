import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Share2, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/app/MobileShell";
import { PillTabs } from "@/components/app/PillTabs";
import { AuthGate, EmptyState } from "@/components/app/AuthGate";
import { Button } from "@/components/ui/button";
import { usePosts, useLikePost, type Post } from "@/lib/cloud";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed — Videos, Sermons & Worship" },
      {
        name: "description",
        content:
          "Watch videos, sermons, worship sessions and testimonies posted by members of the community.",
      },
      { property: "og:title", content: "Feed — Videos, Sermons & Worship" },
      {
        property: "og:description",
        content: "Videos, sermons, worship, testimonies and Christian creators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeedPage,
});

const TABS = ["Videos", "Sermons", "Worship", "Testimonies"] as const;
type Tab = (typeof TABS)[number];
const KIND: Record<Tab, string> = {
  Videos: "video",
  Sermons: "sermon",
  Worship: "worship",
  Testimonies: "testimony",
};

function FeedPage() {
  const [tab, setTab] = useState<Tab>("Videos");

  return (
    <MobileShell>
      <PageHeader title="Feed" subtitle="Fresh from the community" />
      <PillTabs tabs={TABS} value={tab} onChange={setTab} />
      <AuthGate message="Sign in to watch and share videos, sermons, worship and testimonies.">
        <FeedList kind={KIND[tab]} />
      </AuthGate>
    </MobileShell>
  );
}

function FeedList({ kind }: { kind: string }) {
  const { data: items = [], isLoading } = usePosts(kind);
  const like = useLikePost();

  if (isLoading) {
    return (
      <div className="space-y-4 px-4 pb-6">
        {[0, 1].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="px-4 pb-6">
        <EmptyState
          title="Nothing posted yet"
          hint="Everything in the feed comes from members. Record or upload something to start it off."
          action={
            <Button asChild className="rounded-full">
              <Link to="/record">Create a post</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-6">
      {items.map((item) => (
        <FeedCard key={item.id} item={item} onLike={() => like.mutate(item.id)} />
      ))}
    </div>
  );
}

function FeedCard({ item, onLike }: { item: Post; onLike: () => void }) {
  const likes = item.post_likes?.[0]?.count ?? 0;

  return (
    <article className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]">
      {item.media_url ? (
        <video
          src={item.media_url}
          controls
          preload="metadata"
          className="h-64 w-full bg-ink object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-brand-soft text-brand">
          <Play className="h-8 w-8" />
        </div>
      )}
      <div className="p-4">
        <p className="text-sm font-semibold leading-snug">{item.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {item.profiles?.display_name ?? "Member"} ·{" "}
          {new Date(item.created_at).toLocaleDateString()}
        </p>
        {item.body ? (
          <p className="mt-2 font-serif text-xs leading-relaxed text-muted-foreground">
            {item.body}
          </p>
        ) : null}
        <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
          <button onClick={onLike} className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" />
            <span className="font-stat">{likes}</span>
          </button>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
          </span>
          <button
            onClick={() => {
              void navigator.clipboard.writeText(item.title);
              toast.success("Copied");
            }}
            className="ml-auto flex items-center gap-1.5"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </article>
  );
}
