"use client";

import Link from "next/link";
import { useState } from "react";
import type { LabPiece } from "@/lib/lab";

const filters = ["All", "Mobile", "Web", "Motion"] as const;

export function LabGrid({ items }: { items: LabPiece[] }) {
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const shown = f === "All" ? items : items.filter((p) => p.kind === f);
  return (
    <>
      <div className="lab-filters" role="group" aria-label="Filter experiments">
        {filters.map((x) => (
          <button key={x} type="button" aria-pressed={f === x} onClick={() => setF(x)}>
            {x} <span className="tnum">{x === "All" ? items.length : items.filter((p) => p.kind === x).length}</span>
          </button>
        ))}
      </div>
      <ul className="lab-grid">
        {shown.map((p) => (
          <li key={p.slug}>
            <Link href={`/playground/${p.slug}/`} className="lab-card">
              <span className="lab-thumb"><img src={`/playground/lab/${p.slug}.webp`} alt="" loading="lazy" /></span>
              <span className="lab-card-text">
                <b>{p.title}</b>
                <span>{p.question}</span>
                <span className="lab-card-tags">{p.kind}{p.live ? " · Live" : ""}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
