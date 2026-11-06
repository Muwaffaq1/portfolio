import Link from "next/link";
import Body from "@/content/accessibility.mdx";
import { Header } from "@/components/Header";
import { site } from "@/lib/content";

export const metadata = {
  title: `Accessibility — ${site.name}`,
  description: "How I design and build for keyboards, screen readers, zoom and reduced motion, with what I've checked on this site and in client work.",
};

export default function Accessibility() {
  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/">← Home</Link>
          <h1 className="cs-title">Accessibility</h1>
          <p className="cs-sum">How I design and build for people using keyboards, screen readers, zoom and reduced motion: what I check, what I fixed, and what&apos;s still to do.</p>
        </div>
        <article className="prose"><Body /></article>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
