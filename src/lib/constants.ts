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
