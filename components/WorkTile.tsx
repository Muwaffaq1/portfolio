"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Preview, Project } from "@/lib/content";
import { motionPaused, onMotionChange } from "@/lib/motion";

function Media({ preview }: { preview: Preview }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // Reduced motion: keep the still poster instead of the loop.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only play while on screen, so four loops never decode at once, and never while motion is paused.
    let visible = false;
    const sync = () => {
      if (visible && !motionPaused()) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    observer.observe(video);
    const off = onMotionChange(sync);
    return () => { observer.disconnect(); off(); };
  }, []);

  if (preview.type === "image") return <img src={preview.src} alt="" />;
  return <video ref={ref} src={preview.src} poster={preview.poster} muted loop playsInline preload="none" />;
}

function Stage({ preview }: { preview?: Preview }) {
  return (
    <div className="stage" aria-hidden="true">
      {preview?.frame === "phone" ? (
        <div className="phone"><Media preview={preview} /></div>
      ) : preview?.frame === "browser" ? (
        <div className="browser">
          <div className="browser-bar"><i /><i /><i /><span>{preview.url}</span></div>
          <Media preview={preview} />
        </div>
      ) : preview ? (
        <Media preview={preview} />
      ) : null}
    </div>
  );
}

export function WorkTile({ project, statusText }: { project: Project; statusText?: string }) {
  const href = project.hasCaseStudy ? `/work/${project.slug}/` : project.link;
  // Websites span the full row in landscape; apps sit side by side in portrait.
  const cls = project.preview?.wide ? "tile wide" : "tile";
  const body = (
    <>
      <Stage preview={project.preview} />
      <div className="cap">
        <b>{project.name}</b>
        <span className="d">{project.summary}</span>
        <span className="r">
          {statusText && <span className={project.status === "live" ? "live" : undefined}>{statusText}</span>}
          {statusText && project.tags.length > 0 && " · "}
          {project.tags.join(" · ")}
        </span>
      </div>
    </>
  );

  if (!href) return <div className={cls}>{body}</div>;
  return href.startsWith("http") ? (
    <a className={cls} href={href} target="_blank" rel="noreferrer">{body}</a>
  ) : (
    <Link className={cls} href={href}>{body}</Link>
  );
}
