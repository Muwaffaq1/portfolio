// One switch that pauses everything on the site that moves by itself: the greeting, the work videos
// and the 404 glitch. The choice is remembered, and set on <html data-motion="paused"> before paint.
const EVENT = "motionchange";

export function motionPaused() {
  return typeof document !== "undefined" && document.documentElement.dataset.motion === "paused";
}

export function setMotionPaused(paused: boolean) {
  if (paused) document.documentElement.dataset.motion = "paused";
  else delete document.documentElement.dataset.motion;
  try {
    if (paused) localStorage.setItem("motion", "paused");
    else localStorage.removeItem("motion");
  } catch {}
  dispatchEvent(new Event(EVENT));
}

export function onMotionChange(fn: () => void) {
  addEventListener(EVENT, fn);
  return () => removeEventListener(EVENT, fn);
}
