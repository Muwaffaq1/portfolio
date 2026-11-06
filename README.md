# Muwaffaq's portfolio

Next.js, exported as a static site for Cloudflare Pages.

```bash
npm run dev      # http://localhost:3000
npm run build    # static site in out/
npm run deploy   # build, then publish to https://muwaffaq.pages.dev
```

## Personalise it

Everything you'd change lives in `content/site.json`:

- `intro`, `role`, `lookingFor`, `greetings`
- `contact`: email, Calendly link, résumé path, LinkedIn, X, hours (blank entries are hidden)
- `theme.texture`: paper grain strength, `0` (off) to about `0.15`
- `nuring`: the Nūring section (role, summary, confidential work)
- `systems`, `now`, `films`, `ai`: the lists further down the page

Use `**bold**` inside any intro line to highlight a number or name.

## Add a project

```bash
npm run new -- "Project name"                # list entry only
npm run new -- "Project name" --case-study   # with a case study page
```

This creates `content/projects/<slug>.json` (and `content/case-studies/<slug>.mdx`). Then:

1. Fill in the JSON: `summary`, `industry`, `status` (`live`, `redesign`, `concept`, `in-progress`, or `null`), `tags`.
2. Set `"featured": true` to show it as a large tile in Selected work; `order` sets the position.
3. Put a preview in `public/work/`: a short muted `.mp4` loop (`"type": "video"`) or an image (`"type": "image"`).
4. Write the case study in the `.mdx` file. Its page appears at `/work/<slug>/` automatically.

To cut a 6-second preview loop from a launch film:

```bash
ffmpeg -ss 3 -t 6 -i film.mp4 -vf "scale=720:-2,fps=30" -an -c:v libx264 -crf 27 -pix_fmt yuv420p -movflags +faststart public/work/<slug>.mp4
```
