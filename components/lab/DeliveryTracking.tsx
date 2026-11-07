import s from "./DeliveryTracking.module.css";

const steps = ["Confirmed", "Cooking", "On the way", "Here"];
const route = "M60 470 C 90 400, 160 420, 180 340 S 260 260, 230 190 S 280 120, 300 90";

export default function DeliveryTracking() {
  const current = 2;
  return (
    <div className={s.screen}>
      <div className={s.map} aria-hidden="true">
        <svg viewBox="0 0 360 520" preserveAspectRatio="xMidYMid slice">
          <path d="M-20 120 C 100 80, 220 160, 380 110" className={s.road} />
          <path d="M-20 300 C 120 260, 220 360, 380 300" className={s.road} />
          <path d="M120 -20 C 140 200, 90 360, 140 560" className={s.roadSm} />
          <path d={route} className={s.routeBase} />
          <path d={route} className={s.route} pathLength={1} />
          <circle cx="60" cy="470" r="7" className={s.start} />
          <g transform="translate(300 90)"><circle r="16" className={s.homeRing} /><circle r="7" className={s.home} /></g>
          <g transform="translate(230 190)"><g className={s.rider}><circle r="15" className={s.riderBg} /><text y="5" textAnchor="middle" className={s.riderIcon}>🛵</text></g></g>
        </svg>
      </div>
      <section className={s.sheet} aria-label="Order status: on the way, about 9 minutes">
        <div className={s.etaRow}>
          <div><p className={s.k}>Arriving in</p><p className={s.eta}><b className="tnum">9</b> min</p></div>
          <span className={s.chip}>On time</span>
        </div>
        <ol className={s.steps} aria-label="Progress">
          {steps.map((st, i) => (
            <li key={st} className={i < current ? s.done : i === current ? s.now : undefined} aria-current={i === current ? "step" : undefined}>
              <i aria-hidden="true" /><span>{st}</span>
            </li>
          ))}
        </ol>
        <div className={s.rider2}>
          <span className={s.avatar} aria-hidden="true">KA</span>
          <div><b>Kabir is bringing your order</b><span>Suya platter · Garki Grill</span></div>
          <span className={s.call} aria-hidden="true">Call</span>
        </div>
      </section>
    </div>
  );
}
