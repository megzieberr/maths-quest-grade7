# Project status — updated 2026-07-22

## Where we are
Live and feature-complete at **https://megzieberr.github.io/maths-quest-grade7/** (+ `/admin.html`),
repo `megzieberr/maths-quest-grade7` (PUBLIC, GitHub Pages). 5 chapters / 45 rounds, both Supabase
migrations run against production ("Homework Hub", ref `wjkhedepwnwrqcpxmkds`).

**Today (2026-07-22): the hub became an installable phone app.** The class opens the link from
WhatsApp on phones with parental controls — internet for WhatsApp, no Google/Play access — so the
app has to install straight from the page. It had no manifest and no PNG icons, so it wasn't
installable at all. Now: `manifest.json`, four rocket icons generated from `icon.svg` by
`tools/make_icons.py`, and `js/install.js` — a big Afrikaans popup, once per learner on first hub
view, plus a "📱 Sit dit op jou foon" button on the login and hub screens.

Shipped as `c6ac31f`, verified live (manifest + all icons 200, service worker controlling, install
button rendering, no console errors).

## Decisions
- **2026-07-22 — Install popup is Afrikaans**, matching the login screens, even though the rest of
  the UI chrome is English. It is learner-facing and they are 12.
- **2026-07-22 — One-tap install is Android Chrome only, and that's accepted.** iOS provides no
  install API at all, so iPhones get the Share → "Voeg by Tuisskerm" steps instead. Don't go looking
  for a button that works there; it doesn't exist.
- **2026-07-22 — WhatsApp's in-app browser is handled explicitly.** Installing is blocked inside it,
  so on Android the popup offers an `intent://` link that reopens the page in Chrome. This is the
  path the class actually takes, so it matters more than the plain-Chrome case.
- **2026-07-22 — `beforeinstallprompt` is caught by an inline script in `<head>`**, not in a module.
  It often fires before the modules load; catching it later misses it entirely.
- **2026-07-22 — Home-screen label is "Wiskunde"** (manifest `short_name`). "Wiskunde Avontuur" gets
  truncated under the icon.
- **2026-07-22 — No sw.js cache bump needed.** The service worker is network-first with revalidation;
  the cache is only an offline fallback (unlike the Gr11 app).

## Pending on Megan
- **Test one install on your own phone**, from a WhatsApp message to yourself — that's the exact path
  the learners take and the only thing that can't be verified from here.
- If the site is already open on a phone, close and reopen it **twice** — the service worker needs one
  load to fetch the new files and another to serve them.
- No SQL to run. No migration was part of this change.

## Next up
- Nothing queued. Term 3 content decisions (which rounds to open in the admin dashboard) are yours as
  the class gets there.
- A cloud-dispatch commit landed on the remote today (`88e7807`, CLAUDE.md hand-off + `/explain`
  skill). It's intentional — rebase on top of it, never delete it.
