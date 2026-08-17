import { useNavigate } from "@tanstack/react-router";
import { Mic, FileAudio, Video, PenLine, BookMarked } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CaptureSheet({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: "Record Sermon",
      hint: "Capture live audio with transcription",
      icon: Mic,
      tone: "bg-primary/10 text-primary",
      run: () => navigate({ to: "/record" }),
    },
    {
      label: "Upload Audio",
      hint: "MP3, M4A up to 500MB",
      icon: FileAudio,
      tone: "bg-info-soft text-info",
      run: () => toast("Audio upload", { description: "Pick a file from your device." }),
    },
    {
      label: "Upload Video",
      hint: "MP4, MOV up to 2GB",
      icon: Video,
      tone: "bg-flame-soft text-flame",
      run: () => toast("Video upload", { description: "Pick a file from your device." }),
    },
    {
      label: "Create Post",
      hint: "Share a verse, photo or testimony",
      icon: PenLine,
      tone: "bg-success-soft text-success",
      run: () => toast("New post", { description: "Composer opened." }),
    },
    {
      label: "Create Study",
      hint: "Build a plan for your group",
      icon: BookMarked,
      tone: "bg-kids-soft text-kids",
      run: () => navigate({ to: "/study" }),
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-w-md rounded-t-3xl">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Capture</SheetTitle>
        </SheetHeader>
        <div className="space-y-2 px-4 pb-8">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={() => {
                setOpen(false);
                a.run();
              }}
              className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-[var(--shadow-card)] transition-colors hover:bg-secondary"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.tone}`}
              >
                <a.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{a.label}</span>
                <span className="block text-xs text-muted-foreground">{a.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
