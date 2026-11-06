import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ContactLinks } from "@/components/Contact";
import { site } from "@/lib/content";

// "Start here" pages: one per kind of role, mapping what that hirer needs to the work that shows it.
// The body of each lives in content/for/<role>.mdx.
const roles = {
  product: {
    title: "For product design roles",
    summary: "Hiring a senior product designer for complex web apps? Here's what you're likely looking for, and where to find it on this site.",
  },
  "front-end": {
    title: "For front-end roles",
    summary: "Hiring someone who designs and builds? Here's the code, the pipeline and the accessibility work, and where to find each.",
  },
  fintech: {
    title: "For fintech roles",
    summary: "Hiring for a money app? Here's how I handle states, money, copy, motion and both platforms, mostly in one case study.",
  },
} as const;

type Role = keyof typeof roles;
const label: Record<Role, string> = { product: "Product design", "front-end": "Front-end", fintech: "Fintech" };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(roles).map((role) => ({ role }));
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const r = roles[role as Role];
  return r ? { title: `${r.title} — ${site.name}`, description: r.summary } : {};
}

export default async function StartHere({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const r = roles[role as Role];
  if (!r) notFound();
  const { default: Body } = await import(`@/content/for/${role}.mdx`);

  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/">← Home</Link>
          <h1 className="cs-title">{r.title}</h1>
          <p className="cs-sum">{r.summary}</p>
        </div>
        <nav className="seg for-switch" aria-label="Other start pages">
          {(Object.keys(roles) as Role[]).map((k) => (
            <Link key={k} href={`/for/${k}/`} aria-current={k === role ? "page" : undefined}>{label[k]}</Link>
          ))}
        </nav>
        <article className="prose for-body"><Body /></article>
        <section aria-labelledby="for-contact">
          <div className="sh"><h2 id="for-contact">Talk to me</h2></div>
          <ContactLinks />
        </section>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#work">See all the work →</Link></footer>
    </div>
  );
}
