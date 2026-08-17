import { queryOptions } from "@tanstack/react-query";

export const TRANSLATIONS = [
  { id: "kjv", name: "KJV", full: "King James Version" },
  { id: "web", name: "WEB", full: "World English Bible" },
  { id: "bbe", name: "BBE", full: "Bible in Basic English" },
  { id: "oeb-us", name: "OEB", full: "Open English Bible" },
  { id: "clementine", name: "VUL", full: "Clementine Latin Vulgate" },
] as const;

export const BOOKS = [
  { name: "Genesis", chapters: 50 },
  { name: "Exodus", chapters: 40 },
  { name: "Psalms", chapters: 150 },
  { name: "Proverbs", chapters: 31 },
  { name: "Isaiah", chapters: 66 },
  { name: "Matthew", chapters: 28 },
  { name: "Mark", chapters: 16 },
  { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 },
  { name: "Acts", chapters: 28 },
  { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 },
  { name: "Ephesians", chapters: 6 },
  { name: "Philippians", chapters: 4 },
  { name: "Hebrews", chapters: 13 },
  { name: "James", chapters: 5 },
  { name: "1 John", chapters: 5 },
  { name: "Revelation", chapters: 22 },
];

export type Verse = { verse: number; text: string };
export type Passage = { reference: string; translation: string; verses: Verse[] };

const FALLBACK: Verse[] = [
  { verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
  { verse: 2, text: "The same was in the beginning with God." },
  { verse: 3, text: "All things were made by him; and without him was not any thing made that was made." },
  { verse: 4, text: "In him was life; and the life was the light of men." },
  { verse: 5, text: "And the light shineth in darkness; and the darkness comprehended it not." },
];

export async function fetchPassage(
  reference: string,
  translation: string,
): Promise<Passage> {
  try {
    const res = await fetch(
      `https://bible-api.com/${encodeURIComponent(reference)}?translation=${translation}`,
    );
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {
      reference: string;
      translation_name?: string;
      verses?: { verse: number; text: string }[];
    };
    const verses = (data.verses ?? []).map((v) => ({
      verse: v.verse,
      text: v.text.replace(/\s+/g, " ").trim(),
    }));
    if (!verses.length) throw new Error("empty");
    return {
      reference: data.reference ?? reference,
      translation: data.translation_name ?? translation.toUpperCase(),
      verses,
    };
  } catch {
    return { reference, translation: translation.toUpperCase(), verses: FALLBACK };
  }
}

export const passageQuery = (reference: string, translation: string) =>
  queryOptions({
    queryKey: ["passage", reference, translation],
    queryFn: () => fetchPassage(reference, translation),
    staleTime: 1000 * 60 * 60,
  });
