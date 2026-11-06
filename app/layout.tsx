import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Geist_Mono, Chivo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

const sans = Schibsted_Grotesk({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const chivo = Chivo({ variable: "--font-chivo", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const arabic = IBM_Plex_Sans_Arabic({ variable: "--font-arabic", subsets: ["arabic"], weight: ["400", "500", "600", "700"] });

const description = "I design, build and launch products I'd want to use. Websites, design systems, products built with AI, and launch films.";

// Paints under the notch (content is padded back with env(safe-area-inset-*)), and gives the
// browser chrome the page colour in each theme. Zoom is never disabled.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0e" },
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://muwaffaq.pages.dev"),
  title: `${site.name} — ${site.role}`,
  description,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description,
    url: "/",
    siteName: site.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}, ${site.role}` }],
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@Muwaffaaq", images: ["/og.png"] },
};

// Runs before first paint so a saved light/dark choice never flashes.
// Also marks the first visit of a session, so the entrance plays once, not on every return.
const themeScript = `try{var t=localStorage.getItem('theme');if(t){document.documentElement.dataset.theme=t;document.querySelectorAll('meta[name=theme-color]').forEach(function(m){m.content=t==='light'?'#f4f3ef':'#0f0f0e'})}if(localStorage.getItem('motion')==='paused')document.documentElement.dataset.motion='paused';if(!sessionStorage.getItem('seen')){document.documentElement.classList.add('first');sessionStorage.setItem('seen','1')}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const style = { "--grain": String(site.theme.texture) } as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${chivo.variable} ${arabic.variable}`}
      style={style}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
