"use client";

import { useRef, useState } from "react";
import { TextMorph } from "torph/react";
import site from "@/content/site.json";

const c = site.contact;

// The ways to reach me, in order of importance. Empty entries in site.json are hidden.
export function contactLinks() {
  return [
    c.email && { label: "Email", href: `mailto:${c.email}` },
    c.call && { label: "Book a call", href: c.call },
    c.resume && { label: "Résumé", href: c.resume, download: true },
    c.linkedin && { label: "LinkedIn", href: c.linkedin },
    c.github && { label: "GitHub", href: c.github },
    c.x && { label: "X", href: c.x },
  ].filter(Boolean) as { label: string; href: string; download?: boolean }[];
}

export function ContactLinks({ only }: { only?: string[] } = {}) {
  return (
    <div className="links">
      {contactLinks().filter((l) => !only || only.includes(l.label)).map((l) => (
        <a key={l.label} href={l.href} {...(l.download ? { download: "" } : { target: l.href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" })}>{l.label}</a>
      ))}
    </div>
  );
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const link = useRef<HTMLAnchorElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: select the address so it can be copied by hand.
      const range = document.createRange();
      if (link.current) range.selectNodeContents(link.current);
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
    }
  }

  return (
    <div className="email-row">
      <a ref={link} href={`mailto:${email}`}>{email}</a>
      <button type="button" onClick={copy} aria-live="polite"><TextMorph>{copied ? "Copied" : "Copy"}</TextMorph></button>
    </div>
  );
}

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="c-h">
      <div className="sh"><h2 id="c-h">Contact</h2></div>
      <div className="contact">
        <div className="contact-main">
          <p className="contact-title">Let&apos;s build something people want to use.</p>
          <p className="d">Have a role, a project or just an idea? Send me a note. {c.reply}</p>
          {c.email && <CopyEmail email={c.email} />}
          <ContactLinks />
          <p className="d contact-alt">Working on a project? <a href="/services/">See how I work with businesses →</a></p>
        </div>
        <dl className="contact-meta">
          <div><dt>Works</dt><dd>Remotely, worldwide</dd></div>
          <div><dt>Hours</dt><dd>{c.availability}</dd></div>
        </dl>
      </div>
    </section>
  );
}
