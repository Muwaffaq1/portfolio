import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// One code-split chunk per experiment, so each page only loads the piece it shows.
export const pieces: Record<string, ComponentType> = {
  "swipe-to-pay": dynamic(() => import("./SwipeToPay")),
  "card-stack": dynamic(() => import("./CardStack")),
  "bottom-sheet": dynamic(() => import("./BottomSheet")),
  "rolling-amount": dynamic(() => import("./RollingAmount")),
  "toast-stack": dynamic(() => import("./ToastStack")),
  "command-palette": dynamic(() => import("./CommandPalette")),
  flashcards: dynamic(() => import("./Flashcards")),
  "ai-prompt": dynamic(() => import("./AiPrompt")),
  "music-scrubber": dynamic(() => import("./MusicScrubber")),
  "smart-home": dynamic(() => import("./SmartHome")),
  "money-dashboard": dynamic(() => import("./MoneyDashboard")),
  "data-table": dynamic(() => import("./DataTable")),
  "week-calendar": dynamic(() => import("./WeekCalendar")),
  "spring-tuner": dynamic(() => import("./SpringTuner")),
  "card-to-detail": dynamic(() => import("./CardToDetail")),
  "button-states": dynamic(() => import("./ButtonStates")),
};
