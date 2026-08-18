import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  points: number;
  streak_days: number;
  last_active_date: string | null;
};

/* ---------------- profile + streak (cloud saved) ---------------- */

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, points, streak_days, last_active_date")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

/** Records daily activity in the cloud and keeps the streak counter up to date. */
export function useStreakTracker() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user || !profile) return;
    if (profile.last_active_date === today()) return;

    const next =
      profile.last_active_date === yesterday() ? profile.streak_days + 1 : 1;

    void supabase
      .from("profiles")
      .update({ streak_days: next, last_active_date: today() })
      .eq("id", user.id)
      .then(() => qc.invalidateQueries({ queryKey: ["profile", user.id] }));
  }, [user, profile, qc]);

  return profile?.streak_days ?? 0;
}

export function useAddPoints() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (points: number) => {
      if (!user || !profile) throw new Error("Sign in to earn points");
      const { error } = await supabase
        .from("profiles")
        .update({ points: profile.points + points })
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", user?.id] }),
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (patch: { display_name?: string; avatar_url?: string }) => {
      if (!user) throw new Error("Sign in first");
      const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", user?.id] }),
  });
}

/* ---------------- journal (cloud saved) ---------------- */

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  mood: string | null;
  created_at: string;
};

export function useJournal() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["journal", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<JournalEntry[]> => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, title, body, mood, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JournalEntry[];
    },
  });
}

export function useAddJournalEntry() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (entry: { title: string; body: string; mood?: string }) => {
      if (!user) throw new Error("Sign in to write in your journal");
      const { error } = await supabase
        .from("journal_entries")
        .insert({ ...entry, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal", user?.id] }),
  });
}

export function useDeleteJournalEntry() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal", user?.id] }),
  });
}

/* ---------------- notes + highlights ---------------- */

export type NoteRow = { id: string; reference: string; body: string; created_at: string };
export type HighlightRow = {
  id: string;
  reference: string;
  text: string;
  color: string;
  created_at: string;
};

export function useNotes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notes", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<NoteRow[]> => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, reference, body, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as NoteRow[];
    },
  });
}

export function useAddNote() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: { reference: string; body: string }) => {
      if (!user) throw new Error("Sign in to save notes");
      const { error } = await supabase.from("notes").insert({ ...note, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes", user?.id] }),
  });
}

export function useHighlights() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["highlights", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<HighlightRow[]> => {
      const { data, error } = await supabase
        .from("highlights")
        .select("id, reference, text, color, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as HighlightRow[];
    },
  });
}

export function useToggleHighlight() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (h: {
      existingId?: string;
      reference: string;
      text: string;
      color: string;
    }) => {
      if (!user) throw new Error("Sign in to highlight verses");
      if (h.existingId) {
        const { error } = await supabase.from("highlights").delete().eq("id", h.existingId);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("highlights").insert({
        user_id: user.id,
        reference: h.reference,
        text: h.text,
        color: h.color,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["highlights", user?.id] }),
  });
}

/* ---------------- memory verses ---------------- */

export type MemoryVerse = { id: string; reference: string; learned: boolean };

export function useMemoryVerses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["memory_verses", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<MemoryVerse[]> => {
      const { data, error } = await supabase
        .from("memory_verses")
        .select("id, reference, learned")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MemoryVerse[];
    },
  });
}

export function useMemoryVerseActions() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["memory_verses", user?.id] });

  const add = useMutation({
    mutationFn: async (reference: string) => {
      if (!user) throw new Error("Sign in first");
      const { error } = await supabase
        .from("memory_verses")
        .insert({ user_id: user.id, reference });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const toggle = useMutation({
    mutationFn: async (v: MemoryVerse) => {
      const { error } = await supabase
        .from("memory_verses")
        .update({ learned: !v.learned })
        .eq("id", v.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { add, toggle };
}

/* ---------------- posts (feed, sermons, kids, devotionals) ---------------- */

export type PostKind =
  | "video"
  | "sermon"
  | "worship"
  | "testimony"
  | "devotional"
  | "kids"
  | "study";

export type Post = {
  id: string;
  user_id: string;
  kind: string;
  title: string;
  body: string | null;
  media_url: string | null;
  duration_seconds: number | null;
  transcript: string | null;
  summary: string | null;
  key_points: string[] | null;
  created_at: string;
  profiles?: { display_name: string | null; avatar_url: string | null } | null;
  post_likes?: { count: number }[];
};

export function usePosts(kind?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["posts", kind ?? "all", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Post[]> => {
      let q = supabase
        .from("posts")
        .select(
          "id, user_id, kind, title, body, media_url, duration_seconds, transcript, summary, key_points, created_at, profiles(display_name, avatar_url), post_likes(count)",
        )
        .order("created_at", { ascending: false });
      if (kind) q = q.eq("kind", kind);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Post[];
    },
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (post: {
      kind: PostKind;
      title: string;
      body?: string;
      media_url?: string;
      duration_seconds?: number;
      transcript?: string;
      summary?: string;
      key_points?: string[];
    }) => {
      if (!user) throw new Error("Sign in to publish");
      const { error } = await supabase.from("posts").insert({ ...post, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useLikePost() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Sign in to like");
      const { error } = await supabase
        .from("post_likes")
        .insert({ post_id: postId, user_id: user.id });
      if (error && error.code !== "23505") throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

/* ---------------- prayers ---------------- */

export type PrayerRequest = {
  id: string;
  user_id: string;
  request: string;
  is_anonymous: boolean;
  created_at: string;
  profiles?: { display_name: string | null } | null;
  prayer_supports?: { count: number }[];
};

export function usePrayers() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["prayers", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<PrayerRequest[]> => {
      const { data, error } = await supabase
        .from("prayer_requests")
        .select(
          "id, user_id, request, is_anonymous, created_at, profiles(display_name), prayer_supports(count)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as PrayerRequest[];
    },
  });
}

export function usePrayerActions() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["prayers"] });

  const add = useMutation({
    mutationFn: async (p: { request: string; is_anonymous?: boolean }) => {
      if (!user) throw new Error("Sign in to share a prayer request");
      const { error } = await supabase
        .from("prayer_requests")
        .insert({ ...p, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const pray = useMutation({
    mutationFn: async (prayerId: string) => {
      if (!user) throw new Error("Sign in to pray");
      const { error } = await supabase
        .from("prayer_supports")
        .insert({ prayer_id: prayerId, user_id: user.id });
      if (error && error.code !== "23505") throw error;
    },
    onSuccess: invalidate,
  });

  return { add, pray };
}

/* ---------------- groups ---------------- */

export type Group = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  created_at: string;
  group_members?: { count: number }[];
};

export function useGroups() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["groups", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Group[]> => {
      const { data, error } = await supabase
        .from("groups")
        .select("id, owner_id, name, description, created_at, group_members(count)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Group[];
    },
  });
}

export function useGroupActions() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["groups"] });

  const create = useMutation({
    mutationFn: async (g: { name: string; description?: string }) => {
      if (!user) throw new Error("Sign in to create a group");
      const { data, error } = await supabase
        .from("groups")
        .insert({ ...g, owner_id: user.id })
        .select("id")
        .single();
      if (error) throw error;
      await supabase.from("group_members").insert({ group_id: data.id, user_id: user.id });
    },
    onSuccess: invalidate,
  });

  const join = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error("Sign in to join");
      const { error } = await supabase
        .from("group_members")
        .insert({ group_id: groupId, user_id: user.id });
      if (error && error.code !== "23505") throw error;
    },
    onSuccess: invalidate,
  });

  return { create, join };
}

/* ---------------- community members ---------------- */

export function usePeople() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["people", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, streak_days")
        .order("streak_days", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });
}
