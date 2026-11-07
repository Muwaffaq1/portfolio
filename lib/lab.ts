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
    slug: "live-activity", title: "Live Activity", kind: "Mobile", frame: "phone", live: true,
    question: "How much can a status pill say before it needs to open?",
    notes: ["Tap the pill to open it. It grows from where it sits, on a spring, so it never jumps.", "The arrival time counts down live, and the progress bar moves with it.", "Collapsed, it keeps only what you'd glance at: who and how long."],
  },
  {
    slug: "card-stack", title: "Wallet stack", kind: "Mobile", frame: "phone", live: true,
    question: "Can a card on a screen feel like the plastic in your hand?",
    notes: ["Move your pointer over the front card: it tilts toward you, with a glare and a holographic foil that follow the light.", "Tap a card behind to bring it forward, or drag the front card down to send it back. The balance below rolls to the front card\u2019s value.", "Pointer moves update CSS variables directly, so the tilt never re-renders the page."],
  },
  {
    slug: "swipe-to-pay", title: "Swipe to pay", kind: "Mobile", frame: "phone", live: true,
    question: "Can confirming a payment feel physical without being slow?",
    notes: ["Drag the handle to the end. It only pays if you get past 85%.", "Pull past the end and it resists, like a rubber band.", "Let go early and it springs back, keeping your speed."],
  },
  {
    slug: "rolling-amount", title: "Rolling amount", kind: "Mobile", frame: "phone", live: true,
    question: "Can typing an amount feel like a counter, not a text field?",
    notes: ["Each digit rolls into place as you type, and commas slide in at thousands.", "Delete and the digits roll back out the other way.", "Hit the limit and the amount shakes once instead of showing an error."],
  },
  {
    slug: "bottom-sheet", title: "Sheet with stops", kind: "Mobile", frame: "phone", live: true,
    question: "Where should a sheet stop, and how does a flick decide?",
    notes: ["Drag the sheet between three stops: peek, half and full.", "A quick flick moves it a stop in that direction, even if you only drag a little.", "The map behind dims as the sheet rises, so you always know which layer you're in."],
  },
  {
    slug: "music-scrubber", title: "Music scrubber", kind: "Mobile", frame: "phone", live: true,
    question: "Can a progress bar show the song, not just the time?",
    notes: ["The bar is the song's waveform. Drag anywhere on it to scrub.", "Play and pause swap with a quick scale and fade.", "The played part lights up as it goes."],
  },
  {
    slug: "prayer-times", title: "Prayer times", kind: "Mobile", frame: "phone", live: true,
    question: "What does someone need in the minute before the next prayer?",
    notes: ["A ring counts down to the next prayer, and the list marks where you are in the day.", "Drag the compass to turn it. The arrow always points to the qibla, worked out from Abuja's position.", "The times are a sample day for Abuja, not live times."],
  },
  {
    slug: "smart-home", title: "Smart home", kind: "Mobile", frame: "phone", live: true,
    question: "Can a room's controls fit on one screen without menus?",
    notes: ["Drag the dial around its arc to set the temperature. The arc runs from cool blue to warm amber, and the room\u2019s light follows it.", "The tiles are frosted glass, and the lamp in the corner brightens with the lights slider.", "Every control works by keyboard: arrows on the dial, Space on the tiles."],
  },
  {
    slug: "flashcards", title: "Arabic flashcards", kind: "Mobile", frame: "phone", live: true,
    question: "Can vocabulary practice feel like a game of cards?",
    notes: ["Tap a card to flip it and see the meaning. Swipe right if you knew it, left if you didn't.", "A fast flick counts as a swipe, even if it's short.", "Or use the Again and Knew it buttons, which send the card off the same way. The arrow keys and Space work too."],
  },
  {
    slug: "command-palette", title: "Command palette", kind: "Web", frame: "browser", live: true,
    question: "What does a keyboard-first menu need to feel instant?",
    notes: ["Press ⌘K or Ctrl+K, or the button. It opens with no animation, because you'll use it a hundred times a day.", "Type to filter, use the arrow keys to move and Enter to run.", "Commands are grouped, and each one shows its own shortcut."],
  },
  {
    slug: "ai-prompt", title: "AI prompt box", kind: "Web", frame: "browser", live: true,
    question: "How should an answer arrive so it feels fast but readable?",
    notes: ["Pick a suggestion or type, and the answer streams in word by word.", "A thinking state shows first, so the wait never looks frozen.", "You can stop it mid-answer, and the screen reader hears the full text when it's done."],
  },
  {
    slug: "toast-stack", title: "Toast stack", kind: "Web", frame: "stage", live: true,
    question: "How do you stack notifications without hiding them?",
    notes: ["New toasts push older ones back into a stack. Hover or focus the stack to fan it out.", "Swipe a toast sideways, or flick it, to dismiss it.", "Each toast enters and leaves from the same edge, so you always know where they live."],
  },
];

export const labBySlug = (slug: string) => lab.find((p) => p.slug === slug);
