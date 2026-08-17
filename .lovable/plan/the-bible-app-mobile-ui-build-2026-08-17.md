# The Bible App — Mobile UI Build

A full mobile-first Bible app matching the uploaded screens, using the blue "B + cross + flame" logo as the brand mark (splash, favicon, social preview).

## Build scope (agreed)

- Full mobile UI shell across all 10 sections and their sub-tabs, with realistic demo content
- Bible text from a free public-domain API (KJV/WEB) at runtime
- No accounts yet — notes, highlights, streaks and progress saved locally in the browser
- Mobile app only; the desktop admin dashboard comes later

## Look and feel

Taken from the screenshots: light neutral background, deep indigo/violet primary, rounded cards, soft shadows, pill tabs, colorful category tiles. Dark surfaces for the recorder and AI assistant screens. Bottom tab bar with five items (Home, Bible, ＋ Capture, Feed, Profile) and a raised circular ＋ button in the middle that opens the Capture sheet. Sections not in the tab bar (Earn, Children, Study, Sermons, Community) are reached from the Home grid and a "More" area.

## Screens

- **Home** — greeting header, Verse of the Day card with image, Continue Reading progress, Devotional, Prayer quick actions, streak counter with weekly dots, "Recommended for you" carousel, quick-access grid to every section
- **Bible** — reader with chapter navigation, translation picker, Compare (side-by-side translations), Audio player bar, Search, Notes and Highlights tabs, verse long-press actions (highlight, note, share)
- **＋ Capture** — bottom sheet with Record Sermon (waveform recorder screen with timer and controls), Upload Audio, Upload Video, Create Post, Create Study
- **Feed** — vertical video feed plus tabs for Videos, Sermons, Worship, Testimonies, Christian Creators
- **Earn** — balance card, Watch & Earn, Tasks, Surveys, Creator Earnings, Affiliate, Rewards, with progress and point values
- **Children** — bright kid-styled tiles for Stories, Videos, Audio, Games, Memory Verses
- **Study** — AI Bible Assistant chat UI, Commentary, Greek, Hebrew, Concordance, Cross References
- **Sermons** — Recordings list, Transcript view with synced highlight, Summaries, Key Points, AI Study
- **Community** — Groups, Prayer wall, Friends, Church
- **Profile** — avatar and stats, Notes, Journal, Saved, Earnings, Achievements badges, Settings

## Technical notes

- TanStack Start file routes: one route per section plus nested routes for sub-tabs; shared mobile shell with bottom nav in a layout route
- Design tokens (colors, radii, shadows) defined in `src/styles.css`; no hardcoded color classes
- Bible text via a free public-domain API (bible-api.com / WEB + KJV) fetched through TanStack Query, with cached fallback text so screens always render
- Local persistence layer over `localStorage` for notes, highlights, bookmarks, streaks and mock earnings
- Logo uploaded as a CDN asset, used in the splash screen, header, and downscaled into `public/favicon.png`
- Per-route `head()` metadata (title, description, og/twitter) on every section
- Demo media (verse backgrounds, kids art, thumbnails, avatars) generated as images so screens look real

## Not in this build

Real authentication, server storage of recordings, real payouts, actual AI inference, and the admin dashboard. These are natural follow-ups once the UI is approved.
