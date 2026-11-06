"use client";

import { useEffect, useState } from "react";

export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [timeZone]);

  return <span className="tnum">{time}</span>;
}
