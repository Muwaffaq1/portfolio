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

export function ContactLinks() {
  return (
    <div className="links">
      {contactLinks().map((l) => (
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
          <p className="d">{site.lookingFor}. {c.reply}</p>
          {c.email && <CopyEmail email={c.email} />}
          <ContactLinks />
        </div>
        <dl className="contact-meta">
          <div><dt>Based in</dt><dd>{site.location}, Nigeria</dd></div>
          <div><dt>Hours</dt><dd>{c.availability}</dd></div>
          <div><dt>Status</dt><dd>{site.openToWork ? <><span className="pulse" aria-hidden="true" /> Open to work</> : "Not looking right now"}</dd></div>
        </dl>
      </div>
    </section>
  );
}
