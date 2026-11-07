// The Playground lab: small experiments, one question each. Metadata only (safe for server pages);
// the components themselves are loaded per page from components/lab/pieces.tsx.
export type LabKind = "Mobile" | "Web" | "Motion";
export type LabFrame = "phone" | "browser" | "stage";

export type LabPiece = {
  slug: string;
  title: string;
  kind: LabKind;
  frame: LabFrame;
  live: boolean; // interactive (true) or a visual composition (false)
  question: string; // the one thing it explores
  notes: string[]; // how it works, in plain words
};

export const lab: LabPiece[] = [
  {
    slug: "hold-to-send", title: "Hold to send", kind: "Mobile", frame: "stage", live: true,
    question: "Can sending money feel deliberate without feeling slow?",
    notes: ["Press and hold for 1.5 seconds. The fill moves at a steady pace, so you can see exactly how long is left.", "Let go early and it snaps back in 200ms, with a hint that says what to do.", "Space or Enter works too: hold the key down."],
  },
  {
    slug: "english-arabic", title: "English and Arabic", kind: "Mobile", frame: "stage", live: true,
    question: "What actually changes when a screen goes right to left?",
    notes: ["The same transfer screen in both languages. Pick a rule to see what it changes in each.", "Layout mirrors and directional icons flip, but numbers, the clock and the tick stay as they are.", "The Arabic copy still needs a native speaker's review before it would ship."],
  },
  {
    slug: "live-activity", title: "Live Activity", kind: "Mobile", frame: "phone", live: true,
    question: "How much can a status pill say before it needs to open?",
    notes: ["Tap the pill to open it. It grows from where it sits, on a spring, so it never jumps.", "The arrival time counts down live, and the progress bar moves with it.", "Collapsed, it keeps only what you'd glance at: who and how long."],
  },
  {
    slug: "swipe-to-pay", title: "Swipe to pay", kind: "Mobile", frame: "phone", live: true,
    question: "Can confirming a payment feel physical without being slow?",
    notes: ["Drag the handle to the end. It only pays if you get past 85%.", "Pull past the end and it resists, like a rubber band.", "Let go early and it springs back, keeping your speed."],
  },
  {
    slug: "card-stack", title: "Wallet stack", kind: "Mobile", frame: "phone", live: true,
    question: "Can four cards share one screen without a carousel?",
    notes: ["Tap any card in the stack to bring it to the front.", "Each card moves on a spring, so the stack reshuffles rather than snapping.", "The balance under the stack follows the front card, rolling to its new value."],
  },
  {
    slug: "bottom-sheet", title: "Sheet with stops", kind: "Mobile", frame: "phone", live: true,
    question: "Where should a sheet stop, and how does a flick decide?",
    notes: ["Drag the sheet between three stops: peek, half and full.", "A quick flick moves it a stop in that direction, even if you only drag a little.", "The map behind dims as the sheet rises, so you always know which layer you're in."],
  },
  {
    slug: "rolling-amount", title: "Rolling amount", kind: "Mobile", frame: "phone", live: true,
    question: "Can typing an amount feel like a counter, not a text field?",
    notes: ["Each digit rolls into place as you type, and commas slide in at thousands.", "Delete and the digits roll back out the other way.", "Hit the limit and the amount shakes once instead of showing an error."],
  },
  {
    slug: "budget-slider", title: "Budget slider", kind: "Mobile", frame: "phone", live: true,
    question: "Can a slider show what a number means while you drag it?",
    notes: ["Drag to set a monthly budget. The ring shows how much is already spent against it.", "It snaps to steps of 50, with a light tick at each one on phones that support it.", "Arrow keys work too, and Shift moves in bigger steps."],
  },
  {
    slug: "morph-button", title: "Add to bag", kind: "Web", frame: "stage", live: true,
    question: "Can one button carry the whole add-to-bag moment?",
    notes: ["The button shrinks into a spinner while it works, then grows into a confirmation.", "The width animates with the label, so the button never jumps.", "The bag count bumps when the item lands."],
  },
  {
    slug: "toast-stack", title: "Toast stack", kind: "Web", frame: "stage", live: true,
    question: "How do you stack notifications without hiding them?",
    notes: ["New toasts push older ones back into a stack. Hover or focus the stack to fan it out.", "Swipe a toast sideways, or flick it, to dismiss it.", "Each toast enters and leaves from the same edge, so you always know where they live."],
  },
  {
    slug: "command-palette", title: "Command palette", kind: "Web", frame: "browser", live: true,
    question: "What does a keyboard-first menu need to feel instant?",
    notes: ["Press ⌘K or Ctrl+K, or the button. It opens with no animation, because you'll use it a hundred times a day.", "Type to filter, use the arrow keys to move and Enter to run.", "Commands are grouped, and each one shows its own shortcut."],
  },
  {
    slug: "dock", title: "Magnifying dock", kind: "Web", frame: "stage", live: true,
    question: "Can magnification feel smooth when it follows the pointer exactly?",
    notes: ["Icons grow with their distance from the pointer, through springs, so it feels alive rather than mechanical.", "On touch screens, a tap bounces the icon instead.", "Each icon has a label for screen readers and a tooltip on hover."],
  },
  {
    slug: "colour-tabs", title: "Colour tabs", kind: "Web", frame: "stage", live: true,
    question: "Can a tab change colour cleanly as the highlight moves?",
    notes: ["Two copies of the tab list sit on top of each other: the top one is coloured and clipped to the active tab.", "Moving the clip reveals the colour exactly, letter by letter, with no colour fades to time.", "Arrow keys move between tabs."],
  },
  {
    slug: "wireframe-final", title: "Wireframe to final", kind: "Web", frame: "stage", live: true,
    question: "What changes between a wireframe and the finished screen?",
    notes: ["Drag the handle to compare the same screen as a wireframe and as the final design.", "It uses a clip, not two moving images, so it stays sharp and fast.", "Arrow keys move the handle for keyboard users."],
  },
  {
    slug: "reorder", title: "Drag to reorder", kind: "Mobile", frame: "phone", live: true,
    question: "Can reordering a list feel as easy as moving paper?",
    notes: ["Drag a row by its handle. The others make room on springs.", "The row you hold lifts with a shadow, so it's clear what's moving.", "With a keyboard, focus a handle and use the up and down arrows."],
  },
  {
    slug: "expanding-cards", title: "Expanding cards", kind: "Mobile", frame: "phone", live: true,
    question: "Can a card open into a page without losing your place?",
    notes: ["Tap a destination. The card itself grows into the page, so you see where it came from.", "Close it and it shrinks back into the same spot.", "Escape closes it, and focus returns to the card."],
  },
  {
    slug: "flashcards", title: "Arabic flashcards", kind: "Mobile", frame: "phone", live: true,
    question: "Can vocabulary practice feel like a game of cards?",
    notes: ["Tap a card to flip it and see the meaning. Swipe right if you knew it, left if you didn't.", "A fast flick counts as a swipe, even if it's short.", "The arrow keys and Space work too."],
  },
  {
    slug: "ai-prompt", title: "AI prompt box", kind: "Web", frame: "browser", live: true,
    question: "How should an answer arrive so it feels fast but readable?",
    notes: ["Pick a suggestion or type, and the answer streams in word by word.", "A thinking state shows first, so the wait never looks frozen.", "You can stop it mid-answer, and the screen reader hears the full text when it's done."],
  },
  {
    slug: "music-scrubber", title: "Music scrubber", kind: "Mobile", frame: "phone", live: true,
    question: "Can a progress bar show the song, not just the time?",
    notes: ["The bar is the song's waveform. Drag anywhere on it to scrub.", "Play and pause swap with a quick scale and fade.", "The played part lights up as it goes."],
  },
  {
    slug: "habit-heatmap", title: "Habit heatmap", kind: "Mobile", frame: "phone", live: true,
    question: "Can twelve weeks of a habit fit in one glance?",
    notes: ["Tap a day to log it. The square fills with a small ripple.", "The streak counter updates as you fill in days.", "Every square is a button with its date, for screen readers."],
  },
  {
    slug: "text-decode", title: "Text decode", kind: "Motion", frame: "stage", live: true,
    question: "Can a hover effect be playful but still readable?",
    notes: ["Hover or focus a word and it decodes from random letters into the real one.", "Each letter settles left to right, so it reads as it resolves.", "With reduced motion or Pause on, the words simply stay as they are."],
  },
  {
    slug: "prayer-times", title: "Prayer times", kind: "Mobile", frame: "phone", live: true,
    question: "What does someone need in the minute before the next prayer?",
    notes: ["A ring counts down to the next prayer, and the list marks where you are in the day.", "Drag the compass to turn it. The arrow always points to the qibla, worked out from Abuja's position.", "The times are a sample day for Abuja, not live times."],
  },
  {
    slug: "loaders", title: "Six loaders", kind: "Motion", frame: "stage", live: false,
    question: "How many ways can you say 'wait' without saying it?",
    notes: ["Six loaders, all CSS: dots, an orbit, a morphing square, bars, a ring and a pulse.", "Each loop is short and steady, so it reads as progress, not decoration.", "They stop with reduced motion or Pause."],
  },
  {
    slug: "weather-icons", title: "Weather icons", kind: "Motion", frame: "stage", live: false,
    question: "Can an icon set say the weather before you read it?",
    notes: ["Sun, cloud, rain, storm, snow and wind, each with one small motion that matches it.", "Built as SVG and CSS, so they stay sharp at any size.", "They stop with reduced motion or Pause."],
  },
  {
    slug: "aurora", title: "Aurora", kind: "Motion", frame: "stage", live: true,
    question: "Can a background move without pulling focus from the words?",
    notes: ["Four soft shapes drift slowly behind the text.", "Drag the hue slider to shift the whole palette.", "It's slow on purpose, and it stops with reduced motion or Pause."],
  },
  {
    slug: "dashboard-reveal", title: "Dashboard reveal", kind: "Motion", frame: "browser", live: true,
    question: "Can numbers arriving on a dashboard feel calm, not flashy?",
    notes: ["The numbers count up, the line draws in and the bars rise, a few milliseconds apart.", "Everything finishes within a second, so it never delays reading.", "Replay it with the button."],
  },
  {
    slug: "boarding-pass", title: "Boarding pass", kind: "Mobile", frame: "phone", live: false,
    question: "What does a traveller need at the gate, in order?",
    notes: ["Gate and boarding time come first, because they change. Seat and route come second.", "The perforation splits what you scan from what you read.", "The code is a decorative pattern, not a real boarding code."],
  },
  {
    slug: "sleep-summary", title: "Sleep summary", kind: "Mobile", frame: "phone", live: false,
    question: "Can a night of sleep be one number and one shape?",
    notes: ["A single score leads, and the stage chart underneath shows how the night actually went.", "Each sleep stage keeps one colour across the chart and the bars.", "All the data is made up."],
  },
  {
    slug: "match-day", title: "Match day", kind: "Mobile", frame: "phone", live: false,
    question: "How do you show a live match to someone who just looked away?",
    notes: ["Score and minute first, then a timeline of what happened.", "Each team has its own side of the timeline, so you can follow it without reading names.", "The teams are invented."],
  },
  {
    slug: "delivery-tracking", title: "Delivery tracking", kind: "Mobile", frame: "phone", live: false,
    question: "What's the one number someone wants while they wait for food?",
    notes: ["The minutes left are the biggest thing on screen.", "A segmented track shows the stage at a glance: confirmed, cooking, on the way, here.", "The rider moves along a drawn route."],
  },
  {
    slug: "ai-landing", title: "AI landing page", kind: "Web", frame: "browser", live: false,
    question: "Can a product page show the product before it explains it?",
    notes: ["The hero is the product's own input box, with suggestions underneath.", "The bento grid below gives each feature one sentence and one visual.", "The product, Margin, is invented."],
  },
  {
    slug: "smart-home", title: "Smart home", kind: "Mobile", frame: "phone", live: true,
    question: "Can a room's controls fit on one screen without menus?",
    notes: ["The temperature is the biggest tile, with plus and minus right beside it.", "Tap the lights tile to switch them on or off, and drag the brightness bar.", "Every tile is a real control for keyboard and screen reader users."],
  },
];

export const labBySlug = (slug: string) => lab.find((p) => p.slug === slug);
