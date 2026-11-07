import s from "./SleepSummary.module.css";

// One made-up night: stage per 10-minute block (0 awake, 1 light, 2 deep, 3 REM).
const night = [0,1,1,2,2,2,1,3,1,1,2,2,1,3,3,1,0,1,1,2,1,3,3,1,1,1,3,3,1,0,1,1,3,3,3,1,1,0,1,1,3,1];
const stages = [
  { name: "Awake", color: "#f4a261", mins: 30 },
  { name: "Light", color: "#8ecae6", mins: 196 },
  { name: "Deep", color: "#2a6fdb", mins: 72 },
  { name: "REM", color: "#4cc9a8", mins: 122 },
];

export default function SleepSummary() {
  const W = 300, H = 120, step = W / (night.length - 1);
  const y = (st: number) => [14, 40, 100, 70][st];
  const pts = night.map((st, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${y(st)} H${((i + 1) * step).toFixed(1)}`).join(" ");
  const total = stages.reduce((a, b) => a + b.mins, 0);
  const R = 56, C = 2 * Math.PI * R, score = 84;

  return (
    <div className={s.screen}>
      <header className={s.head}><p>Thursday night</p><h2>Sleep</h2></header>
      <div className={s.scoreRow}>
        <div className={s.ringWrap}>
          <svg viewBox="0 0 140 140" className={s.ring} aria-hidden="true"><circle cx="70" cy="70" r={R} className={s.track} /><circle cx="70" cy="70" r={R} className={s.fill} strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} /></svg>
          <div className={s.score}><b>{score}</b><span>Good</span></div>
        </div>
        <dl className={s.facts}>
          <div><dt>Asleep</dt><dd>7h 0m</dd></div>
          <div><dt>Bedtime</dt><dd>23:12</dd></div>
          <div><dt>Woke</dt><dd>06:42</dd></div>
        </dl>
      </div>
      <div className={s.chart}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          {[14, 40, 70, 100].map((v) => <line key={v} x1="0" x2={W} y1={v} y2={v} className={s.grid} />)}
          <path d={pts} className={s.path} />
        </svg>
        <div className={s.axis} aria-hidden="true"><span>23:12</span><span>03:00</span><span>06:42</span></div>
      </div>
      <ul className={s.stages} aria-label="Time in each stage">
        {stages.map((st) => (
          <li key={st.name}>
            <span><i className={s.dot} style={{ background: st.color }} />{st.name}</span>
            <span className={s.bar}><i style={{ width: `${(st.mins / total) * 100}%`, background: st.color }} /></span>
            <b className="tnum">{Math.floor(st.mins / 60)}h {st.mins % 60}m</b>
          </li>
        ))}
      </ul>
      <p className={s.note}>All data is made up for this exploration.</p>
    </div>
  );
}
