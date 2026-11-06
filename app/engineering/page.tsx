import Link from "next/link";
import Body from "@/content/engineering.mdx";
import { Header } from "@/components/Header";
import { site } from "@/lib/content";

export const metadata = {
  title: `Engineering — ${site.name}`,
  description: "How I build and ship: this site, PharmaQuest and treeti, with links to the code on GitHub.",
};

export default function Engineering() {
  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/">← Home</Link>
          <h1 className="cs-title">Engineering</h1>
          <p className="cs-sum">How I build and ship: the stack, how content and deploys work, how I test, and the code you can read on GitHub.</p>
        </div>
        <article className="prose"><Body /></article>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
