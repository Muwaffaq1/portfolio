import s from "./WeatherIcons.module.css";

const Cloud = ({ className = "" }: { className?: string }) => (
  <path className={className} d="M20 44h26a10 10 0 000-20 14 14 0 00-27-3A11 11 0 0020 44z" />
);

export default function WeatherIcons() {
  const icons = [
    { name: "Sunny", svg: <svg viewBox="0 0 64 64"><g className={s.rays}>{Array.from({ length: 8 }, (_, i) => <line key={i} x1="32" y1="6" x2="32" y2="13" transform={`rotate(${i * 45} 32 32)`} />)}</g><circle cx="32" cy="32" r="12" className={s.sunCore} /></svg> },
    { name: "Cloudy", svg: <svg viewBox="0 0 64 64"><g className={s.drift}><Cloud className={s.cloudBack} /></g><g className={s.drift2} transform="translate(-6 6)"><Cloud className={s.cloud} /></g></svg> },
    { name: "Rain", svg: <svg viewBox="0 0 64 64"><Cloud className={s.cloud} /><g className={s.drops}><line x1="24" y1="50" x2="22" y2="56" /><line x1="33" y1="50" x2="31" y2="56" /><line x1="42" y1="50" x2="40" y2="56" /></g></svg> },
    { name: "Storm", svg: <svg viewBox="0 0 64 64"><Cloud className={s.cloudDark} /><path d="M34 44l-6 9h6l-4 9 10-12h-6l4-6z" className={s.bolt} /></svg> },
    { name: "Snow", svg: <svg viewBox="0 0 64 64"><Cloud className={s.cloud} /><g className={s.flakes}><circle cx="24" cy="52" r="2" /><circle cx="33" cy="55" r="2" /><circle cx="42" cy="52" r="2" /></g></svg> },
    { name: "Windy", svg: <svg viewBox="0 0 64 64"><g className={s.wind}><path d="M8 24h30a6 6 0 10-6-6" /><path d="M8 34h42a6 6 0 11-6 6" /><path d="M8 44h22" /></g></svg> },
  ];
  return (
    <div className={s.grid}>
      {icons.map((ic) => (
        <figure key={ic.name} className={s.cell}>
          <span className={s.box} role="img" aria-label={ic.name}>{ic.svg}</span>
          <figcaption>{ic.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
