import s from "./MatchDay.module.css";

const events = [
  { min: 12, side: "home", kind: "goal", text: "Goal · Bello", detail: "Header from a corner" },
  { min: 27, side: "away", kind: "card", text: "Yellow · Okafor", detail: "Late tackle" },
  { min: 41, side: "away", kind: "goal", text: "Goal · Danjuma", detail: "Penalty" },
  { min: 58, side: "home", kind: "sub", text: "Sub · Ade on, Musa off", detail: "" },
  { min: 66, side: "home", kind: "goal", text: "Goal · Ade", detail: "Left foot, top corner" },
];

export default function MatchDay() {
  return (
    <div className={s.screen}>
      <header className={s.top}><span>League · Matchday 9</span><span className={s.live}><i aria-hidden="true" />Live 71′</span></header>
      <section className={s.board} aria-label="Abuja City 2, Kano United 1, 71st minute">
        <div className={s.team}><span className={`${s.crest} ${s.home}`} aria-hidden="true">AC</span><b>Abuja City</b></div>
        <div className={s.score}><b className="tnum">2</b><span>–</span><b className="tnum">1</b></div>
        <div className={s.team}><span className={`${s.crest} ${s.away}`} aria-hidden="true">KU</span><b>Kano United</b></div>
      </section>
      <div className={s.poss} role="group" aria-label="Possession: Abuja City 58%, Kano United 42%">
        <span>58%</span><span className={s.possBar}><i style={{ width: "58%" }} /></span><span>42%</span>
      </div>
      <ol className={s.timeline} aria-label="Match events">
        {events.slice().reverse().map((e) => (
          <li key={e.min} className={e.side === "home" ? s.left : s.right}>
            <span className={s.min}>{e.min}′</span>
            <span className={`${s.event} ${s[e.kind]}`}><b>{e.text}</b>{e.detail && <span>{e.detail}</span>}</span>
          </li>
        ))}
      </ol>
      <p className={s.note}>The teams and match are invented.</p>
    </div>
  );
}
