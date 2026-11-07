import s from "./BoardingPass.module.css";

// A decorative square pattern standing in for a boarding code (not a real code).
const pattern = Array.from({ length: 21 * 21 }, (_, i) => {
  const x = i % 21, y = Math.floor(i / 21);
  const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || (x >= a + 2 && x <= a + 4 && y >= b + 2 && y <= b + 4));
  if (finder(0, 0) || finder(14, 0) || finder(0, 14)) return true;
  if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) return false;
  return Math.abs(Math.sin(i * 91.7) * 1e4) % 1 > 0.52;
});

export default function BoardingPass() {
  return (
    <div className={s.screen}>
      <header className={s.top}><span>Boarding pass</span><b>Today</b></header>
      <article className={s.pass} aria-label="Boarding pass, Abuja to Doha, flight HM 1408, gate B12, boarding 13:20, seat 23A">
        <div className={s.head}>
          <span className={s.airline}>Harmattan Air · HM 1408</span>
          <span className={s.status}>On time</span>
        </div>
        <div className={s.route}>
          <div><b>ABV</b><span>Abuja</span><span className="tnum">14:05</span></div>
          <div className={s.path} aria-hidden="true"><i /><span>✈</span><i /><em>6h 40m</em></div>
          <div className={s.right}><b>DOH</b><span>Doha</span><span className="tnum">21:45</span></div>
        </div>
        <div className={s.tiles}>
          <div className={s.hot}><span>Gate</span><b>B12</b></div>
          <div className={s.hot}><span>Boards</span><b className="tnum">13:20</b></div>
          <div><span>Seat</span><b>23A</b></div>
          <div><span>Group</span><b>3</b></div>
        </div>
        <div className={s.perf} aria-hidden="true" />
        <div className={s.bottom}>
          <div className={s.code} aria-hidden="true">{pattern.map((on, i) => <i key={i} className={on ? s.on : undefined} />)}</div>
          <div className={s.pax}><span>Passenger</span><b>Muwaffaq Yusuf</b><span>Economy · 1 cabin bag</span></div>
        </div>
      </article>
      <span className={s.wallet} aria-hidden="true">Add to Wallet</span>
    </div>
  );
}
