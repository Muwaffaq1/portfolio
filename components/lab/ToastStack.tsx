"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./ToastStack.module.css";
import { Icon } from "./icons";
import { tap, useStill } from "./util";

type Kind = "success" | "error" | "undo";
type Toast = { id: number; kind: Kind; title: string; body: string };

const samples: Record<Kind, Omit<Toast, "id" | "kind">> = {
  success: { title: "Invoice sent", body: "INV-0042 is on its way to Nkem Foods." },
  error: { title: "Upload failed", body: "The file is over 10 MB. Try a smaller one." },
  undo: { title: "Project archived", body: "Find it any time under Archive." },
};

export default function ToastStack() {
  // Starts with two, so the stack is visible before anyone presses a button.
  const [toasts, setToasts] = useState<Toast[]>([{ id: -1, kind: "undo", ...samples.undo }, { id: -2, kind: "success", ...samples.success }]);
  const [open, setOpen] = useState(false);
  const id = useRef(0);
  const still = useStill();

  const add = (kind: Kind) => {
    tap(6);
    setToasts((t) => [{ id: ++id.current, kind, ...samples[kind] }, ...t].slice(0, 5));
  };
  const remove = (tid: number) => setToasts((t) => t.filter((x) => x.id !== tid));

  // Toasts leave on their own after 5s, but never while you're reading the open stack.
  useEffect(() => {
    if (open || toasts.length === 0) return;
    const oldest = toasts[toasts.length - 1];
    const tm = setTimeout(() => remove(oldest.id), 5000);
    return () => clearTimeout(tm);
  }, [toasts, open]);

  return (
    <div className={s.wrap}>
      <div className={s.buttons}>
        <button type="button" onClick={() => add("success")}>Send invoice</button>
        <button type="button" onClick={() => add("error")}>Upload a big file</button>
        <button type="button" onClick={() => add("undo")}>Archive project</button>
      </div>
      <ol
        className={s.stack}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t, i) => (
            <motion.li
              key={t.id}
              className={`${s.toast} ${s[t.kind]}`}
              style={{ zIndex: 50 - i }}
              initial={{ y: 80, opacity: 0, scale: 0.96 }}
              animate={{ y: open ? -i * 82 : -i * 12, scale: open ? 1 : 1 - i * 0.05, opacity: i > 2 && !open ? 0 : 1 }}
              exit={{ y: 80, opacity: 0, transition: { duration: 0.2 } }}
              transition={still ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }}
              drag="x"
              dragSnapToOrigin
              dragElastic={0.6}
              onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) remove(t.id); }}
            >
              <span className={s.icon} aria-hidden="true"><Icon name={t.kind === "success" ? "check" : t.kind === "error" ? "alert" : "archive"} size={16} stroke={2.2} /></span>
              <span className={s.text}><b>{t.title}</b><span>{t.body}</span></span>
              {t.kind === "undo" ? (
                <button type="button" className={s.action} onClick={() => remove(t.id)}>Undo</button>
              ) : (
                <button type="button" className={s.close} onClick={() => remove(t.id)} aria-label={`Dismiss: ${t.title}`}><Icon name="close" size={14} stroke={2.2} /></button>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <p className={s.hint}>{toasts.length ? "Hover the stack to fan it out. Swipe a toast to dismiss it." : "Make a few toasts."}</p>
    </div>
  );
}
