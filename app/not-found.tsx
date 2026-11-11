import Link from "next/link";
import { Header } from "@/components/Header";
import { Glitch } from "@/components/Greeting";
import { site } from "@/lib/content";
import { Track404 } from "@/components/Track404";

export const metadata = { title: `Page not found — ${site.name}` };

export default function NotFound() {
  return (
    <div className="wrap">
      <Header name={site.name} />
      <Track404 />
      <main className="lost">
        <h1><Glitch text="404" loop /></h1>
        <p>This page slipped into another universe. Everything else is still here.</p>
        <div className="links"><Link href="/">Back to the home page</Link><Link href="/#work">See the work</Link></div>
      </main>
    </div>
  );
}
