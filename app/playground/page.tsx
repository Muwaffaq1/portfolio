import Link from "next/link";
import { Header } from "@/components/Header";
import { Shot } from "@/components/Shot";
import { BidiTransfer } from "@/components/playground/BidiTransfer";
import { HoldToSend } from "@/components/playground/HoldToSend";
import { playground, site } from "@/lib/content";

export const metadata = {
  title: `Playground — ${site.name}`,
  description: "Small experiments you can try, and screens from projects and concepts.",
};

export default function Playground() {
  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/">← Home</Link>
          <h1 className="cs-title">Playground</h1>
          <p className="cs-sum">Small experiments, built to answer one question each. The first two are live, so try them. Below are screens from my projects and concepts.</p>
        </div>

        <section id="hold-to-send" className="pg-exp" aria-labelledby="hts-h">
          <div className="sh"><h2 id="hts-h">Hold to send</h2><span className="hint">Live · fintech interaction</span></div>
          <p className="lead">Can sending money feel deliberate without feeling slow? A tap can be an accident. A hold can&apos;t.</p>
          <HoldToSend />
          <ul className="pg-notes">
            <li>The fill takes 1.5 seconds at a steady pace, so you can see exactly how long is left.</li>
            <li>Let go early and it snaps back in 200ms, with a hint that says what to do.</li>
            <li>The button presses in slightly while held, and on phones that support it, a short vibration confirms the send.</li>
            <li>Space or Enter works too: hold the key down.</li>
          </ul>
        </section>

        <section id="english-arabic" className="pg-exp" aria-labelledby="bd-h">
          <div className="sh"><h2 id="bd-h">English and Arabic</h2><span className="hint">Live · right to left</span></div>
          <p className="lead">The same transfer screen in both languages. Pick a rule to see what it changes in each.</p>
          <BidiTransfer />
          <p className="pg-review">The Arabic copy is mine and still needs a native speaker&apos;s review before it would ship.</p>
        </section>

        <section aria-labelledby="sc-h">
          <div className="sh"><h2 id="sc-h">Screens</h2><span className="hint">From projects and concepts</span></div>
          <div className="gallery">
            {playground.filter((s) => !s.live).map((s) => <Shot key={s.src} item={s} />)}
          </div>
        </section>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
