import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Pause, Play, Square, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/record")({
  head: () => ({
    meta: [
      { title: "Record Sermon — The Bible App" },
      {
        name: "description",
        content: "Record a live sermon with timing markers and automatic transcription.",
      },
      { property: "og:title", content: "Record Sermon" },
      {
        property: "og:description",
        content: "Capture live audio with markers and transcription.",
      },
    ],
  }),
  component: RecordPage,
});

function RecordPage() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [markers, setMarkers] = useState<string[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const format = (s: number) =>
    [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-ink text-ink-foreground">
      <header className="flex items-center gap-2 px-4 py-4">
        <button
          onClick={() => navigate({ to: "/sermons" })}
          aria-label="Back"
          className="rounded-full bg-ink-foreground/10 p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-bold">Record Sermon</p>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-destructive/20 px-3 py-1 text-[11px] font-semibold text-destructive">
          <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
          {running ? "Recording" : "Paused"}
        </span>
      </header>

      <div className="flex flex-1 flex-col items-center px-6">
        <p className="mt-6 font-mono text-4xl font-extrabold tracking-tight">
          {format(seconds)}
        </p>

        <div className="mt-8 flex h-28 w-full items-center justify-between gap-[3px]">
          {Array.from({ length: 56 }).map((_, i) => (
            <span
              key={i}
              className="w-full rounded-full bg-primary"
              style={{
                height: `${
                  running
                    ? 15 + Math.abs(Math.sin((i + seconds) * 0.6)) * 85
                    : 12
                }%`,
                opacity: running ? 1 : 0.4,
              }}
            />
          ))}
        </div>

        <div className="mt-8 w-full rounded-2xl bg-ink-foreground/10 p-4 text-xs">
          <p className="font-semibold">Auto transcription</p>
          <p className="mt-1 opacity-70">
            Speech is transcribed as you record. Summary and key points are generated when
            you stop.
          </p>
        </div>

        <button
          onClick={() => {
            setMarkers((m) => [format(seconds), ...m]);
            toast.success("Marker added");
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink-foreground/10 py-2.5 text-xs font-semibold"
        >
          <Tag className="h-3.5 w-3.5" /> Add marker
        </button>

        {markers.length ? (
          <div className="mt-3 flex w-full flex-wrap gap-2">
            {markers.map((m, i) => (
              <span
                key={i}
                className="rounded-full bg-ink-foreground/10 px-3 py-1 text-[11px] font-mono"
              >
                {m}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mb-10 mt-auto flex items-center gap-8 pt-10">
          <button
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause" : "Resume"}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-foreground/10"
          >
            {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            onClick={() => {
              toast.success("Recording saved to Sermons");
              navigate({ to: "/sermons" });
            }}
            aria-label="Stop and save"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-ink-foreground"
          >
            <Square className="h-6 w-6 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
