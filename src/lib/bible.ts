import { queryOptions } from "@tanstack/react-query";

export type Translation = { id: string; name: string; full: string };
export type TranslationGroup = { label: string; items: Translation[] };

export const TRANSLATION_GROUPS: TranslationGroup[] = [
  {
    label: "Popular English",
    items: [
      { id: "NIV", name: "NIV", full: "New International Version" },
      { id: "KJV", name: "KJV", full: "King James Version" },
      { id: "NKJV", name: "NKJV", full: "New King James Version" },
      { id: "ESV", name: "ESV", full: "English Standard Version" },
      { id: "NLT", name: "NLT", full: "New Living Translation" },
      { id: "MSG", name: "MSG", full: "The Message" },
      { id: "AMP", name: "AMP", full: "Amplified Bible" },
      { id: "NASB", name: "NASB", full: "New American Standard Bible" },
      { id: "CSB17", name: "CSB", full: "Christian Standard Bible" },
      { id: "NRSVCE", name: "NRSV", full: "New Revised Standard Version" },
      { id: "GNTD", name: "GNT", full: "Good News Translation" },
      { id: "CEVD", name: "CEV", full: "Contemporary English Version" },
      { id: "NET", name: "NET", full: "New English Translation" },
      { id: "WEB", name: "WEB", full: "World English Bible" },
      { id: "ASV", name: "ASV", full: "American Standard Version" },
    ],
  },
  {
    label: "More English",
    items: [
      { id: "BSB", name: "BSB", full: "Berean Standard Bible" },
      { id: "NIVUK", name: "NIVUK", full: "New International Version (UK)" },
      { id: "NIRV", name: "NIRV", full: "New International Reader's Version" },
      { id: "RSV", name: "RSV", full: "Revised Standard Version" },
      { id: "LSB", name: "LSB", full: "Legacy Standard Bible" },
      { id: "ERV", name: "ERV", full: "Easy-to-Read Version" },
      { id: "MEV", name: "MEV", full: "Modern English Version" },
      { id: "ISV", name: "ISV", full: "International Standard Version" },
      { id: "NLV", name: "NLV", full: "New Life Version" },
      { id: "CJB", name: "CJB", full: "Complete Jewish Bible" },
      { id: "TLV", name: "TLV", full: "Tree of Life Version" },
      { id: "NABRE", name: "NABRE", full: "New American Bible, Revised" },
      { id: "DRB", name: "DRB", full: "Douay-Rheims Bible" },
      { id: "GNV", name: "GNV", full: "Geneva Bible" },
      { id: "YLT", name: "YLT", full: "Young's Literal Translation" },
    ],
  },
  {
    label: "African",
    items: [{ id: "SUV", name: "SUV", full: "Swahili Union Version" }],
  },
  {
    label: "International",
    items: [
      { id: "NVI", name: "NVI", full: "Nueva Versión Internacional (Spanish)" },
      { id: "RV1960", name: "RVR", full: "Reina Valera 1960 (Spanish)" },
      { id: "NTV", name: "NTV", full: "Nueva Traducción Viviente (Spanish)" },
      { id: "BDS", name: "BDS", full: "Bible du Semeur (French)" },
      { id: "FRLSG", name: "LSG", full: "Louis Segond (French)" },
      { id: "HFA", name: "HFA", full: "Hoffnung für Alle (German)" },
      { id: "LUT", name: "LUT", full: "Lutherbibel (German)" },
      { id: "NVIPT", name: "NVI-PT", full: "Nova Versão Internacional (Portuguese)" },
      { id: "ARA", name: "ARA", full: "Almeida Revista e Atualizada (Portuguese)" },
      { id: "CUNPS", name: "CUV", full: "和合本 Chinese Union Version (Simplified)" },
      { id: "CUNP", name: "CUVT", full: "和合本 Chinese Union Version (Traditional)" },
      { id: "NAV", name: "NAV", full: "كتاب الحياة New Arabic Version" },
      { id: "SVD", name: "SVD", full: "Smith & Van Dyke (Arabic)" },
      { id: "KRV", name: "KRV", full: "개역한글 Korean Revised Version" },
      { id: "RNKSV", name: "RNKSV", full: "새번역 Korean New Standard Version" },
      { id: "NBV07", name: "NBV", full: "Nieuwe Bijbelvertaling (Dutch)" },
      { id: "HUNK", name: "HUN", full: "Károli (Hungarian)" },
      { id: "SPE", name: "SPE", full: "Septuagint in English" },
    ],
  },
];

/** Requested but not yet licensed for in-app reading. */
export const PENDING_TRANSLATIONS = [
  { name: "TPT", full: "The Passion Translation" },
  { name: "Yoruba", full: "Bibeli Mimo (Yoruba)" },
  { name: "Igbo", full: "Baibulu Nsọ (Igbo)" },
  { name: "Hausa", full: "Littafi Mai Tsarki (Hausa)" },
  { name: "Pidgin", full: "Nigerian Pidgin Bible" },
];

export const TRANSLATIONS: Translation[] = TRANSLATION_GROUPS.flatMap((g) => g.items);

export const findTranslation = (id: string) =>
  TRANSLATIONS.find((t) => t.id.toLowerCase() === id.toLowerCase());

export const BOOKS = [
  { id: 1, name: "Genesis", chapters: 50 },
  { id: 2, name: "Exodus", chapters: 40 },
  { id: 3, name: "Leviticus", chapters: 27 },
  { id: 4, name: "Numbers", chapters: 36 },
  { id: 5, name: "Deuteronomy", chapters: 34 },
  { id: 6, name: "Joshua", chapters: 24 },
  { id: 7, name: "Judges", chapters: 21 },
  { id: 8, name: "Ruth", chapters: 4 },
  { id: 9, name: "1 Samuel", chapters: 31 },
  { id: 10, name: "2 Samuel", chapters: 24 },
  { id: 11, name: "1 Kings", chapters: 22 },
  { id: 12, name: "2 Kings", chapters: 25 },
  { id: 13, name: "1 Chronicles", chapters: 29 },
  { id: 14, name: "2 Chronicles", chapters: 36 },
  { id: 15, name: "Ezra", chapters: 10 },
  { id: 16, name: "Nehemiah", chapters: 13 },
  { id: 17, name: "Esther", chapters: 10 },
  { id: 18, name: "Job", chapters: 42 },
  { id: 19, name: "Psalms", chapters: 150 },
  { id: 20, name: "Proverbs", chapters: 31 },
  { id: 21, name: "Ecclesiastes", chapters: 12 },
  { id: 22, name: "Song of Solomon", chapters: 8 },
  { id: 23, name: "Isaiah", chapters: 66 },
  { id: 24, name: "Jeremiah", chapters: 52 },
  { id: 25, name: "Lamentations", chapters: 5 },
  { id: 26, name: "Ezekiel", chapters: 48 },
  { id: 27, name: "Daniel", chapters: 12 },
  { id: 28, name: "Hosea", chapters: 14 },
  { id: 29, name: "Joel", chapters: 3 },
  { id: 30, name: "Amos", chapters: 9 },
  { id: 31, name: "Obadiah", chapters: 1 },
  { id: 32, name: "Jonah", chapters: 4 },
  { id: 33, name: "Micah", chapters: 7 },
  { id: 34, name: "Nahum", chapters: 3 },
  { id: 35, name: "Habakkuk", chapters: 3 },
  { id: 36, name: "Zephaniah", chapters: 3 },
  { id: 37, name: "Haggai", chapters: 2 },
  { id: 38, name: "Zechariah", chapters: 14 },
  { id: 39, name: "Malachi", chapters: 4 },
  { id: 40, name: "Matthew", chapters: 28 },
  { id: 41, name: "Mark", chapters: 16 },
  { id: 42, name: "Luke", chapters: 24 },
  { id: 43, name: "John", chapters: 21 },
  { id: 44, name: "Acts", chapters: 28 },
  { id: 45, name: "Romans", chapters: 16 },
  { id: 46, name: "1 Corinthians", chapters: 16 },
  { id: 47, name: "2 Corinthians", chapters: 13 },
  { id: 48, name: "Galatians", chapters: 6 },
  { id: 49, name: "Ephesians", chapters: 6 },
  { id: 50, name: "Philippians", chapters: 4 },
  { id: 51, name: "Colossians", chapters: 4 },
  { id: 52, name: "1 Thessalonians", chapters: 5 },
  { id: 53, name: "2 Thessalonians", chapters: 3 },
  { id: 54, name: "1 Timothy", chapters: 6 },
  { id: 55, name: "2 Timothy", chapters: 4 },
  { id: 56, name: "Titus", chapters: 3 },
  { id: 57, name: "Philemon", chapters: 1 },
  { id: 58, name: "Hebrews", chapters: 13 },
  { id: 59, name: "James", chapters: 5 },
  { id: 60, name: "1 Peter", chapters: 5 },
  { id: 61, name: "2 Peter", chapters: 3 },
  { id: 62, name: "1 John", chapters: 5 },
  { id: 63, name: "2 John", chapters: 1 },
  { id: 64, name: "3 John", chapters: 1 },
  { id: 65, name: "Jude", chapters: 1 },
  { id: 66, name: "Revelation", chapters: 22 },
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

const ALIASES: Record<string, string> = {
  psalm: "Psalms",
  psalms: "Psalms",
  song: "Song of Solomon",
  songs: "Song of Solomon",
  "song of songs": "Song of Solomon",
  canticles: "Song of Solomon",
};

export function parseReference(input: string) {
  const raw = input.trim().replace(/\s+/g, " ");
  const m = raw.match(/^([1-3]?\s?[A-Za-z. ]+?)\s*(\d+)?(?::(\d+)(?:\s*-\s*(\d+))?)?$/);
  if (!m) return null;
  const key = (m[1] ?? "").toLowerCase().replace(/\./g, "").trim();
  const name =
    ALIASES[key] ??
    BOOKS.find((b) => b.name.toLowerCase() === key)?.name ??
    BOOKS.find((b) => b.name.toLowerCase().startsWith(key))?.name;
  const book = BOOKS.find((b) => b.name === name);
  if (!book) return null;
  const chapter = Math.min(Math.max(Number(m[2] ?? 1), 1), book.chapters);
  return {
    book,
    chapter,
    verseStart: m[3] ? Number(m[3]) : undefined,
    verseEnd: m[4] ? Number(m[4]) : m[3] ? Number(m[3]) : undefined,
  };
}

const clean = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

export async function fetchPassage(
  reference: string,
  translation: string,
): Promise<Passage> {
  const parsed = parseReference(reference);
  const meta = findTranslation(translation);
  const id = meta?.id ?? translation.toUpperCase();
  const label = meta?.full ?? id;
  if (!parsed) return { reference, translation: label, verses: FALLBACK };

  const ref = `${parsed.book.name} ${parsed.chapter}${
    parsed.verseStart ? `:${parsed.verseStart}${parsed.verseEnd && parsed.verseEnd !== parsed.verseStart ? `-${parsed.verseEnd}` : ""}` : ""
  }`;

  try {
    const res = await fetch(
      `https://bolls.life/get-chapter/${id}/${parsed.book.id}/${parsed.chapter}/`,
    );
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { verse: number; text: string }[];
    let verses = (data ?? []).map((v) => ({ verse: v.verse, text: clean(v.text) }));
    if (parsed.verseStart) {
      verses = verses.filter(
        (v) => v.verse >= parsed.verseStart! && v.verse <= (parsed.verseEnd ?? parsed.verseStart!),
      );
    }
    if (!verses.length) throw new Error("empty");
    return { reference: ref, translation: label, verses };
  } catch {
    return { reference: ref, translation: label, verses: FALLBACK };
  }
}

export const passageQuery = (reference: string, translation: string) =>
  queryOptions({
    queryKey: ["passage", reference, translation],
    queryFn: () => fetchPassage(reference, translation),
    staleTime: 1000 * 60 * 60,
  });
