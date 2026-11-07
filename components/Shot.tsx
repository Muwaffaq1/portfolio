import Link from "next/link";
import type { PlaygroundItem } from "@/lib/content";

// A Playground card: screens sit in a phone frame on a soft stage; live experiments link to where you can try them.
export function Shot({ item }: { item: PlaygroundItem }) {
  const inner = (
    <>
      <div className={item.live ? "mock live" : "mock"}>
        {item.live ? (
          <div className="live-frame"><img src={item.src} alt="" loading="lazy" /></div>
        ) : (
          <div className="device"><img src={item.src} alt={`${item.title}, ${item.project}`} loading="lazy" /></div>
        )}
      </div>
      <figcaption><b>{item.title}</b><span className={item.live ? "live-tag" : undefined}>{item.project}</span></figcaption>
    </>
  );
  return <figure className="shot">{item.href ? <Link href={item.href}>{inner}</Link> : inner}</figure>;
}
