# Translator Suite

A 6-page site: a homepage plus four Arabic/Urdu/English \u2194 Bangla/English
book translators and an HTML table-of-contents editor. Built with React +
React Router (HashRouter) and Vite. Fully client-side — no backend.

## Folder structure

```
translator-suite/
├── .github/workflows/deploy.yml   # auto-builds & publishes to GitHub Pages
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx                     # router: wires all 6 pages together
    ├── components/
    │   └── SiteNav.jsx             # floating menu present on every page
    └── pages/
        ├── Home.jsx                # homepage: guide, setup, safety, privacy...
        ├── BanglaTranslator1.jsx   # Ar/Ur/En → Bn, Flash + Flash-Lite mix
        ├── BanglaTranslator2.jsx   # Ar/Ur/En → Bn, Flash model only
        ├── EnglishTranslator1.jsx  # Ar/Ur → En, Flash + Flash-Lite mix
        ├── EnglishTranslator2.jsx  # Ar/Ur → En, Flash model only
        └── HtmlTocStudio.jsx       # HTML ToC Studio & Editor
```

The four translator pages are your original app code, with only their saved
`localStorage`/`sessionStorage` key names prefixed (`bn1_`, `bn2_`, `en1_`,
`en2_`) so each page keeps its own independent API key and session — working
in one translator never overwrites another.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this repo to GitHub, keeping the folder structure exactly as above
   (use github.dev — press `.` on the repo page — if the web uploader ever
   flattens your folders).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the **Actions** tab).
5. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

Routing uses `HashRouter`, so URLs look like `.../#/bangla-translator-1` —
this means direct links and page refreshes always work on GitHub Pages
without any server-side redirect rules.

## Notes

- Each translator page needs its own free Gemini API key, entered in that
  page's Settings panel (or reuse the same key across all four — that's
  fine, only the *saved session* is kept separate, not the key itself,
  unless you choose to use a different key per page).
- Tailwind, PDF.js, and DOMPurify are loaded from CDNs — Tailwind loads once
  globally via `index.html`; the translator pages also inject/remove their
  own copy on mount/unmount exactly as originally authored.
