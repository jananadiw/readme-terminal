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
} as const;

export const HELP_TEXT = `Available commands:
  <span class="text-[#2E6F40]">help</span>     - Show this message
  <span class="text-[#2E6F40]">clear</span>    - Clear terminal
  <span class="text-[#2E6F40]">/whoami</span>  - Quick intro about Jananadi

Or just type a question!`;

export const SUGGESTIONS = [
  "What do you do?",
  "Tell me about your projects",
  "Where are you based?",
] as const;

export const TERMINAL_CONFIG = {
  maxWidth: "max-w-5xl",
  width: "w-[720px]",
  height: "h-[600px]",
  title: "lucky — bash",
} as const;

export const STAMP_TOOLTIPS: Record<string, string> = {
  "/boardingpass.png": "Boarding Pass Collection",
  "/floppy.png": "Floppy Disk Memories",
  "/eiffel.png": "Eiffel Tower, Paris",
  "/harderkulm.png": "Harder Kulm, Switzerland",
  "/swisapls.png": "Swiss Alps",
  "/fujiyoshida.png": "Fujiyoshida, Japan",
  "/perruche.png": "Perruche Café, Paris",
  "/nystamp.png": "New York Stamp",
  "/kiyomisutemple.png": "Kiyomizu Temple, Kyoto",
  "/parisdeli.png": "Paris Deli",
  "/usa_stamp.png": "USA Stamp",
  "/pastrypicnic.png": "Pastry Picnic",
  "/Rome.png": "Rome, Italy",
  "/greece.png": "Greece",
  "/seoul.png": "Seoul, South Korea",
  "/handmadechoco.png": "Handmade Chocolates",
  "/JR.png": "JR Rail Pass, Japan",
  "/colstamp.png": "Colosseum Stamp",
  "/journal.png": "Travel Journal",
  "/bizzaria.png": "Bizzaria, Florence",
  "/parismurals.png": "Paris Murals",
  "/busan.png": "Busan, South Korea",
  "/japanbill.png": "Japanese Yen Note",
  "/parisdeli2.png": "Paris Deli II",
  "/firenze.png": "Firenze, Italy",
  "/shoes.png": "Travel Shoes",
  "/austria.png": "Austria",
  "/shakespeare.png": "Shakespeare & Co, Paris",
  "/spain.png": "Spain",
  "/pompei.png": "Pompeii, Italy",
  "/wien.png": "Wien, Austria",
  "/vatican.png": "Vatican City",
  "/stPeters.png": "St. Peter's Basilica",
  "/sl_stamp.png": "Sri Lanka Stamp",
  "/kiyotemple.png": "Kiyomizu Temple",
  "/zurich.png": "Zürich, Switzerland",
  "/vietnam.png": "Vietnam",
  "/brandi.png": "Brandi Pizzeria, Naples",
  "/japsalttoek.png": "Japanese Salt Toek",
  "/malta.png": "Malta",
  "/WienLib.png": "Vienna Library",
};
