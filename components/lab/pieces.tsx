import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// One code-split chunk per experiment, so each page only loads the piece it shows.
export const pieces: Record<string, ComponentType> = {
  "live-activity": dynamic(() => import("./LiveActivity")),
  "swipe-to-pay": dynamic(() => import("./SwipeToPay")),
  "card-stack": dynamic(() => import("./CardStack")),
  "bottom-sheet": dynamic(() => import("./BottomSheet")),
  "rolling-amount": dynamic(() => import("./RollingAmount")),
  "toast-stack": dynamic(() => import("./ToastStack")),
  "command-palette": dynamic(() => import("./CommandPalette")),
  flashcards: dynamic(() => import("./Flashcards")),
  "ai-prompt": dynamic(() => import("./AiPrompt")),
  "music-scrubber": dynamic(() => import("./MusicScrubber")),
  "prayer-times": dynamic(() => import("./PrayerTimes")),
  "smart-home": dynamic(() => import("./SmartHome")),
};
