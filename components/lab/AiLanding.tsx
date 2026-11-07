import s from "./AiLanding.module.css";

export default function AiLanding() {
  return (
    <div className={s.page}>
      <nav className={s.nav} aria-label="Margin demo">
        <b className={s.logo}><span aria-hidden="true">◐</span> Margin</b>
        <span className={s.links} aria-hidden="true"><span>Product</span><span>Pricing</span><span>Changelog</span></span>
        <span className={s.cta}>Try it free</span>
      </nav>
      <header className={s.hero}>
        <p className={s.pill}>New · Meeting notes that write themselves</p>
        <h2 className={s.h}>Notes that know<br />what matters.</h2>
        <div className={s.prompt} aria-hidden="true">
          <span>Summarise my call with the Lagos team and list the follow-ups</span>
          <i>↑</i>
        </div>
        <div className={s.chips} aria-hidden="true"><span>Draft a reply</span><span>Find decisions</span><span>Plan my week</span></div>
      </header>
      <section className={s.bento} aria-label="Features">
        <div className={`${s.cell} ${s.wide}`}>
          <b>Every decision, found</b><span>Ask in plain words. Margin finds the moment it was decided, with who said it.</span>
          <div className={s.quote} aria-hidden="true"><i>“Let’s ship the Android build first.”</i><em>Tolu · 14:32</em></div>
        </div>
        <div className={`${s.cell} ${s.dark}`}>
          <b>Private by default</b><span>Your notes stay on your workspace. Nothing trains on them.</span>
          <div className={s.lock} aria-hidden="true">🔒</div>
        </div>
        <div className={s.cell}>
          <b>Works in 30+ languages</b><span>Including Hausa, Yoruba, Igbo and Arabic.</span>
          <div className={s.langs} aria-hidden="true"><span>Sannu</span><span>Ẹ n lẹ</span><span>مرحبا</span></div>
        </div>
        <div className={`${s.cell} ${s.wide} ${s.accent}`}>
          <b>Follow-ups, written for you</b><span>Each call ends with a list of who does what by when.</span>
          <ul className={s.todo} aria-hidden="true"><li>Kemi · Send the revised quote · Fri</li><li>Ade · Book the venue · Mon</li></ul>
        </div>
      </section>
    </div>
  );
}
