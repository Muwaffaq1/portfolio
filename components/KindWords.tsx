import testimonials from "@/content/testimonials.json";

type Quote = { quote: string; name: string; role: string; featured?: boolean; placeholder?: boolean };

// Placeholder quotes show only in local preview (npm run dev), never on the live site.
// Replace them in content/testimonials.json and remove "placeholder": true.
export function KindWords() {
  const preview = process.env.NODE_ENV !== "production";
  const quotes = (testimonials as Quote[]).filter((q) => preview || !q.placeholder);
  if (quotes.length === 0) return null;
  return (
    <section id="kind-words" aria-labelledby="k-h">
      <div className="sh"><h2 id="k-h">Kind words</h2></div>
      <div className="quotes">
        {/* Featured quotes (from teammates) come first, side by side, a size larger */}
        {quotes.map((q, i) => (
          <figure key={q.name} className={["quote", q.featured && "featured", q.placeholder && "placeholder"].filter(Boolean).join(" ")}>
            <blockquote>{q.quote}</blockquote>
            <figcaption><b>{q.name}</b> {q.role}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
