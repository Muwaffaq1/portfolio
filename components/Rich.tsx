import Link from "next/link";
import type { ReactNode } from "react";

// Renders a little formatting inside the plain strings in content/site.json:
//   **bold**   [a link](/path/)   **[a bold link](/path/)**
const token = /(\*\*\[[^\]]+\]\([^)]+\)\*\*|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/;

function link(md: string, key: number): ReactNode {
  const [, label, href] = md.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
  return <Link key={key} href={href}>{label}</Link>;
}

export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(token).map((part, i) => {
        if (part.startsWith("**[")) return <strong key={i}>{link(part.slice(2, -2), i)}</strong>;
        if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("[")) return link(part, i);
        return part;
      })}
    </>
  );
}
