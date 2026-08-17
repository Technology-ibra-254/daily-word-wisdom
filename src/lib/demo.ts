export const VERSE_OF_DAY = {
  reference: "Isaiah 41:10",
  text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.",
};

export const DEVOTIONALS = [
  {
    id: "d1",
    title: "Walking by Faith",
    author: "Pastor John Emeka",
    minutes: 5,
    excerpt: "Faith is not the absence of fear, it is obedience in spite of it.",
  },
  {
    id: "d2",
    title: "The Quiet Morning",
    author: "Grace Adeyemi",
    minutes: 4,
    excerpt: "Before the noise begins, let His voice be the first one you hear.",
  },
  {
    id: "d3",
    title: "Strength for Today",
    author: "Daniel Okoro",
    minutes: 6,
    excerpt: "His mercies are new — today's grace was never meant for yesterday.",
  },
];

export const PLANS = [
  { id: "p1", title: "Bible in a Year", progress: 42, days: 365 },
  { id: "p2", title: "Psalms of Peace", progress: 68, days: 30 },
  { id: "p3", title: "Gospel of John", progress: 21, days: 21 },
];

export const SERMONS = [
  {
    id: "s1",
    title: "Walking by Faith",
    speaker: "Pastor John Emeka",
    duration: "38:12",
    date: "Aug 11, 2026",
    summary:
      "Faith moves when sight fails. Three marks of a life that walks by faith: hearing, trusting and obeying.",
    keyPoints: [
      "Faith begins with hearing God",
      "Faith trusts God's timing",
      "Faith obeys before it understands",
    ],
    transcript: [
      { t: "00:00", text: "Good morning, church. Today we are talking about walking by faith." },
      { t: "01:24", text: "Faith is not a feeling. Faith is a response to what God has already said." },
      { t: "03:05", text: "Abraham left without a map because he trusted the One who called him." },
      { t: "05:40", text: "When the road disappears, faith is what keeps your feet moving." },
      { t: "08:15", text: "Let me give you three practical steps this week." },
    ],
  },
  {
    id: "s2",
    title: "The God Who Restores",
    speaker: "Pastor Grace Light",
    duration: "44:03",
    date: "Aug 04, 2026",
    summary: "Restoration is God's specialty. What the locusts ate, He gives back with interest.",
    keyPoints: ["God restores time", "God restores joy", "God restores purpose"],
    transcript: [
      { t: "00:00", text: "Turn with me to the book of Joel, chapter two." },
      { t: "02:10", text: "Restoration always begins with returning." },
      { t: "06:32", text: "He is not embarrassed by your broken season." },
    ],
  },
  {
    id: "s3",
    title: "Living Generously",
    speaker: "Pastor David Nwosu",
    duration: "29:47",
    date: "Jul 28, 2026",
    summary: "Generosity is worship with your hands open.",
    keyPoints: ["Give first", "Give cheerfully", "Give expecting nothing"],
    transcript: [
      { t: "00:00", text: "Generosity is not about amount, it is about posture." },
      { t: "04:18", text: "The widow gave two mites and outgave the crowd." },
    ],
  },
];

export const FEED_ITEMS = [
  { id: "f1", kind: "Videos", title: "God is about to do something new in your life!", creator: "Pastor Jude", likes: "12.4k", comments: 812 },
  { id: "f2", kind: "Sermons", title: "Walking by Faith — full message", creator: "Grace Light Church", likes: "8.1k", comments: 402 },
  { id: "f3", kind: "Worship", title: "Spontaneous worship at midnight", creator: "Hope Collective", likes: "22.9k", comments: 1290 },
  { id: "f4", kind: "Testimonies", title: "He healed my daughter — my testimony", creator: "Ruth A.", likes: "5.6k", comments: 233 },
  { id: "f5", kind: "Christian Creators", title: "3 habits that changed my quiet time", creator: "Daniel O.", likes: "9.3k", comments: 511 },
  { id: "f6", kind: "Videos", title: "Why your prayer life feels dry", creator: "Faith Warriors", likes: "3.2k", comments: 118 },
  { id: "f7", kind: "Worship", title: "Hymns reimagined: It Is Well", creator: "Living Water", likes: "17.7k", comments: 640 },
];

export const EARN_TASKS = [
  { id: "e1", title: "Watch a 2 minute sermon clip", points: 120, category: "Watch & Earn", done: false },
  { id: "e2", title: "Complete today's Bible reading", points: 200, category: "Tasks", done: true },
  { id: "e3", title: "Faith & lifestyle survey", points: 450, category: "Surveys", done: false },
  { id: "e4", title: "Read a sponsored article", points: 90, category: "Tasks", done: false },
  { id: "e5", title: "Invite a friend to the app", points: 800, category: "Affiliate", done: false },
  { id: "e6", title: "Share a verse to your story", points: 60, category: "Tasks", done: false },
];

export const REWARDS = [
  { id: "r1", title: "₦1,000 airtime", cost: 5000 },
  { id: "r2", title: "Study Bible eBook", cost: 8000 },
  { id: "r3", title: "Church partner donation", cost: 3000 },
  { id: "r4", title: "Premium audio Bible (1 month)", cost: 12000 },
];

export const KIDS_CONTENT = [
  { id: "k1", title: "Noah's Ark", type: "Stories", minutes: 6 },
  { id: "k2", title: "David & Goliath", type: "Stories", minutes: 7 },
  { id: "k3", title: "Daniel in the Lions' Den", type: "Videos", minutes: 9 },
  { id: "k4", title: "Bedtime Psalms", type: "Audio", minutes: 12 },
  { id: "k5", title: "Books of the Bible Game", type: "Games", minutes: 5 },
  { id: "k6", title: "Jonah and the Big Fish", type: "Videos", minutes: 8 },
];

export const MEMORY_VERSES = [
  { id: "m1", reference: "John 3:16", learned: true },
  { id: "m2", reference: "Psalm 23:1", learned: true },
  { id: "m3", reference: "Philippians 4:13", learned: false },
  { id: "m4", reference: "Proverbs 3:5", learned: false },
];

export const GROUPS = [
  { id: "g1", name: "Youth Warriors", members: 128, activity: "3 new posts" },
  { id: "g2", name: "Women of Grace", members: 342, activity: "12 new posts" },
  { id: "g3", name: "Bible in a Year", members: 1204, activity: "Day 229 today" },
  { id: "g4", name: "Men of Valour", members: 96, activity: "Prayer at 6am" },
];

export const PRAYERS = [
  { id: "pr1", name: "Esther M.", request: "Please pray for my job interview on Monday.", prayers: 42, time: "2h" },
  { id: "pr2", name: "Samuel K.", request: "Healing for my mother in hospital.", prayers: 118, time: "5h" },
  { id: "pr3", name: "Anonymous", request: "Strength to forgive someone who hurt me.", prayers: 76, time: "1d" },
];

export const FRIENDS = [
  { id: "fr1", name: "Ruth Adeyemi", streak: 32 },
  { id: "fr2", name: "Peter Obi", streak: 12 },
  { id: "fr3", name: "Mary Chukwu", streak: 96 },
  { id: "fr4", name: "James Bello", streak: 7 },
];

export const ACHIEVEMENTS = [
  { id: "a1", title: "First Read", earned: true },
  { id: "a2", title: "7 Day Streak", earned: true },
  { id: "a3", title: "30 Day Streak", earned: true },
  { id: "a4", title: "Note Taker", earned: true },
  { id: "a5", title: "Prayer Partner", earned: false },
  { id: "a6", title: "Sermon Scholar", earned: false },
];

export const STUDY_TOOLS = [
  { id: "commentary", title: "Commentary", blurb: "Verse-by-verse insight from classic commentators." },
  { id: "greek", title: "Greek", blurb: "Strong's Greek lexicon for the New Testament." },
  { id: "hebrew", title: "Hebrew", blurb: "Strong's Hebrew lexicon for the Old Testament." },
  { id: "concordance", title: "Concordance", blurb: "Find every occurrence of a word." },
  { id: "cross", title: "Cross References", blurb: "Scripture interprets scripture." },
];

export const AI_SUGGESTIONS = [
  "What does John 1:1 mean?",
  "Give me 3 verses about anxiety",
  "Explain the parable of the sower",
  "Build a 7-day plan on forgiveness",
];
