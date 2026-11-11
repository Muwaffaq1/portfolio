// PostHog, loaded late so it never slows the first paint.
// Events sent before it finishes loading wait in a queue and go out once it's ready.
// Without NEXT_PUBLIC_POSTHOG_KEY nothing loads and track() does nothing.

import type { PostHog } from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
const CONSENT = "analytics-consent"; // "yes" | "no"; the visitor's choice, not tracking data

let ph: PostHog | null = null;
let loading = false;
const queue: [string, Record<string, unknown>?][] = [];

export const analyticsOn = Boolean(KEY);

export function getConsent(): "yes" | "no" | null {
  try {
    const v = localStorage.getItem(CONSENT);
    return v === "yes" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

export function track(event: string, props?: Record<string, unknown>) {
  if (!KEY) return;
  if (ph) ph.capture(event, props);
  else queue.push([event, props]);
}

// Until the visitor says yes, PostHog keeps everything in memory: the visit is still
// recorded in full, but nothing is stored on their device, so a return visit counts as new.
// After a yes, it remembers them across visits.
export function setConsent(yes: boolean) {
  try {
    localStorage.setItem(CONSENT, yes ? "yes" : "no");
  } catch {}
  ph?.set_config({ persistence: yes ? "localStorage+cookie" : "memory" });
  track(yes ? "consent_accepted" : "consent_declined");
}

export async function loadAnalytics() {
  if (!KEY || ph || loading) return;
  loading = true;
  const { default: posthog } = await import("posthog-js");
  posthog.init(KEY, {
    api_host: HOST,
    defaults: "2026-08-30",
    persistence: getConsent() === "yes" ? "localStorage+cookie" : "memory",
    person_profiles: "always", // a profile for every visitor, so return visits link up
    capture_pageview: "history_change", // page views on client-side navigation too
    capture_pageleave: true, // time on page and how far they scrolled
    autocapture: true, // every click
    enable_heatmaps: true,
    capture_dead_clicks: true,
    capture_exceptions: true, // JavaScript errors visitors hit
    capture_performance: { web_vitals: true }, // real load times
    session_recording: { maskAllInputs: true },
  });
  if (location.hostname === "localhost") posthog.debug();
  ph = posthog;
  for (const [e, p] of queue.splice(0)) posthog.capture(e, p);
}
