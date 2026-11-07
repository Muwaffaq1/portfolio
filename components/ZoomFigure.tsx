"use client";

import { useRef, useState } from "react";

// A Figma frame presented on a stage. The page shows a 1600px render (sharp on retina at column width);
// clicking opens the full 4K export in a viewer, where a second click shows it at full size.
export function ZoomFigure({ src, caption, wide }: { src: string; caption: string; wide?: boolean }) {
  const full = src.replace(/\.(png|jpe?g|webp)$/, "@full.$1");
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = useState(false);

  const close = () => {
    dialog.current?.close();
    setZoomed(false);
  };

  return (
    <figure className={wide ? "fig wide" : "fig"}>
      <button type="button" className="fig-stage" onClick={() => dialog.current?.showModal()} aria-label={`View full size: ${caption}`}>
        <img src={src} alt={caption} loading="lazy" decoding="async" />
        <span className="fig-hint" aria-hidden="true">View full size</span>
      </button>
      <figcaption>{caption}</figcaption>
      <dialog ref={dialog} className="viewer" onClick={(e) => { if (e.target === dialog.current) close(); }} onClose={() => setZoomed(false)}>
        <div className="viewer-bar">
          <span>{caption}</span>
          <button type="button" onClick={() => setZoomed(!zoomed)}>{zoomed ? "Fit to screen" : "Actual size"}</button>
          <button type="button" onClick={close}>Close</button>
        </div>
        <div className={zoomed ? "viewer-body zoomed" : "viewer-body"}>
          <img src={full} alt={caption} loading="lazy" decoding="async" onClick={() => setZoomed(!zoomed)} />
        </div>
      </dialog>
    </figure>
  );
}
