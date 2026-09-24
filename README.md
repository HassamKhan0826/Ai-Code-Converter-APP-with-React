# AI Code Converter

Convert code between programming languages in the browser. The AI runs
through [Puter](https://puter.com), so the app needs **no API keys** and has
**no server**.

Languages: JavaScript, TypeScript, Python, Java, C, C++, Go, Rust, PHP.

## Quick start

Requires Node.js 22 LTS (or 20.19+). Check with `node -v`.

```bash
npm install      # install exact versions from package-lock.json
npm run dev      # start the dev server at http://localhost:5173
```

| Command           | What it does                                           |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Development server with instant reload                 |
| `npm run lint`    | Check the code for mistakes with ESLint                |
| `npm run build`   | Production build into `dist/`                          |
| `npm run preview` | Serve the `dist/` build locally to test it             |
| `npm run check`   | Lint + build in one step, run it before you deploy     |

## How it works

```
ConverterPage (UI)
   └─ useConverter (state + actions)
        ├─ utils/secretScanner   checks for keys/passwords before sending
        ├─ services/conversion   builds the prompt, cleans the AI output
        └─ services/puter        the only file that talks to Puter
```

| Folder        | Purpose                                                  |
| ------------- | -------------------------------------------------------- |
| `config/`     | Settings and the list of languages                       |
| `services/`   | Talking to Puter and building the AI prompt              |
| `context/`    | Shared sign-in state                                     |
| `hooks/`      | Reusable logic (converter, auth, routing, highlighting)  |
| `components/` | Reusable UI pieces                                       |
| `pages/`      | Full screens: converter, privacy, not found              |
| `utils/`      | Small helpers: secret scanner, file download             |

## Privacy and secrets

- **No API keys.** Puter's user-pays model bills AI usage to each visitor's
  own Puter account. There is nothing secret in this repository.
- **`VITE_` variables are public.** Anything in a `VITE_` variable is copied
  into the JavaScript every visitor downloads. Never put keys or passwords there.
- **`.env` files are git-ignored.** Only `.env.example` is committed.
- **Secret check.** Before sending, code is scanned for common key and
  password formats. The user can replace them with `REDACTED_SECRET`.
- **Nothing stored by the app.** Puter.js keeps the sign-in token in the
  browser's localStorage. Signing out removes it.
- **Fonts are bundled** and source maps are disabled in production builds.

## Deploying

Run `npm run build` and upload the `dist/` folder to any static host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages). `public/_headers` adds
security headers on Netlify and Cloudflare Pages.

## Troubleshooting

**"Failed to resolve import …" or "Cannot find module @rollup/…" / "…oxide…"**
Your `node_modules` is incomplete. Reinstall:

```powershell
# PowerShell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

```bash
# Git Bash / macOS / Linux
rm -rf node_modules package-lock.json && npm install
```

**The sign-in window doesn't open.** Allow pop-ups for the site
(for local development, `localhost`).
