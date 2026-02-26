import type { AboutPanelContent, DesktopDockItem } from "./types";

export const COLORS = {
  primary: "#35373a",
  secondary: "#2E6F40",
  accent1: "#68BA7F",
  accent2: "#FA766E",
  accent3: "#4682B4",
  accent4: "#366899",
  yellow: "#FFCC00",
  background: "#F9F9F7",
  terminalBg: "#FCFCFA",
  border: "#D4C5A9",
  textPrimary: "#3E3326",
  textSecondary: "#9B8B75",
  textMuted: "#8B7E6A",
  placeholder: "#B5A68F",
  chipBg: "#E8E0D0",
  chipHover: "#DDD3BF",
  chipText: "#6B5D4F",
  response: "#35373a",
} as const;

export const HELP_TEXT = `Available commands:
  help     - Show this message
  clear    - Clear terminal
  /whoami  - Quick intro about Jananadi

Or just type a question!`;

export const SUGGESTIONS = [
  "What do you do?",
  "Tell me about your projects",
  "Where are you based?",
] as const;

export const TERMINAL_CONFIG = {
  maxWidth: "max-w-5xl",
  width: "w-[90vw] sm:w-[720px]",
  height: "h-[80vh] sm:h-[600px]",
  title: "lucky — bash",
} as const;

export const STAMP_TOOLTIPS: Record<string, string> = {
  "/boardingpass.png": "Flew to America for the first time",
  "/floppy.png": "I have Floppy Disk memories (am I old?)",
  "/eiffel.png": "We went to the top! 🗼",
  "/harderkulm.png": "Lost my voice screaming at the view 🏔️",
  "/swisapls.png": "I do this when I'm bored",
  "/fujiyoshida.png": "Road tripped in JP 🚙!",
  "/perruche.png": "Had a b'day meal here! 🍽️",
  "/nystamp.png": "Stole from mom's collection 👀",
  "/kiyomisutemple.png": "Made a wish here! 🎋",
  "/parisdeli.png": "Deli in Paris, yum! 🥖🧀",
  "/usa_stamp.png": "I live here now! 🌁",
  "/pastrypicnic.png": "Pastry Picnic in Paris 🥐",
  "/Rome.png": "Rome, first city we visited in Europe",
  "/greece.png": "Greece, a magical place 🏛️",
  "/seoul.png": "It was home for 10+ years 🇰🇷",
  "/handmadechoco.png": "Who can beat the best? 🍫",
  "/JR.png": "2nd time in Japan! 🚅",
  "/colstamp.png": "I grew up here!",
  "/journal.png": "All my thoughts and sketches..📝",
  "/bizzaria.png": "Time travelled to a perfumary",
  "/parismurals.png": "Interesting streets of Paris",
  "/busan.png": "Perfect place for soju and makgeolli! 🍶",
  "/japanbill.png": "Shopping for stationary whenever wherever🛍️",
  "/parisdeli2.png": "Dont say no to Sandwtiches in Paris 🥪",
  "/firenze.png": "Met a Medici or two ;)",
  "/shoes.png": "Go to stuff for a sunset walk",
  "/austria.png": "We went here. Intentionally",
  "/shakespeare.png": "Cutest bookshop in Prague",
  "/spain.png": "Went to a Flamenco show here! 💃",
  "/pompei.png": "Got lost in the maze.",
  "/wien.png": "Said hi to Mozart 🎼",
  "/vatican.png": "Smallest country, no boarders",
  "/stPeters.png": "Went to the top. Breathtaking! 🏛️",
  "/sl_stamp.png": "I was born here!🇱🇰",
  "/kiyotemple.png": "Walked in this 1000+ year old temple",
  "/zurich.png": "Lost my ID here! 😱",
  "/vietnam.png": "🍯🌕 cityyy",
  "/brandi.png": "Pizza Margherita originated here.",
  "/japsalttoek.png": "I miss this goodness!",
  "/malta.png": "Malta, lived here for 2 years! 🇲🇹",
  "/WienLib.png": "The most beautiful library I've ever been to!",
  "/shanghai.png": "Strolled around the Bund! 🇨🇳",
};

export const DESKTOP_DOCK_ITEMS: DesktopDockItem[] = [
  { id: "about", label: "About", kind: "folder" },
  { id: "terminal", label: "Terminal", kind: "terminal" },
  { id: "resume", label: "Resume", kind: "resume" },
];

export const ABOUT_PANEL_CONTENT: AboutPanelContent = {
  title: "Hello!~ 👋🏼",
  subtitle: "Thanks for being here.",
  imageSrc: "/about/coffee.png",
  imageAlt: "Illustration of Jananadi holding a coffee cup",
  paragraphs: [
    "I'm Jananadi.",
    "I'm a software engineer by practice, transitioning in to systems-first engineer, learning AI/ML. Since AI has taken half of my software engineer job, I'm also working on product design.",
    "Recently, I moved to San Francisco from Malta (EU), to give my wild tech dreams a shot.",
    "At the moment I'm building LinkMap, where heavy connections can be managed and nurtured. Also, I'm working as a freelance front-end lead (product) at Daxe AI, a legal-tech startup.",
    "Before moving to SF, I was in Malta as a digital nomad, worked as a full-stack engineer building fin-tech tools for Taula Capital in the UK, with Rocketfin.",
    "I moved from Sri Lanka to South Korea, called it home for about 10 years. Studied, then worked for startups in diverse industries. Tokamak Network, ONDA, as a front-end engineer building SaaS products, Corners as a backend engineer in IoT safety tech.",
    "When I'm not glued to a monitor, I sketch everyday things (including the ones on the background), read, hike or travel.",
    "Fun fact: I speak fluent Korean. I've always been a nomad. Moved across two continents, four countries, starting everything from scratch, three times.",
  ],
  links: [
    { id: "github", label: "GitHub", href: "https://github.com/jananadiw" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/jananadiw" },
    { id: "x", label: "X", href: "https://x.com/jananadiw" },
    {
      id: "resume",
      label: "Resume",
      href: "https://drive.google.com/file/d/1ZmFAUx4e09y2YHM9s7r9dvie9fVSc4KR/view?pli=1",
    },
    { id: "blog", label: "Blog", href: "https://www.jananadiw.com/blog" },
  ],
  footer: "PS: for a change, I wrote all of the above content without AI.",
};
