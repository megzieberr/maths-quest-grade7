# maths-quest-grade7 (Wiskunde Avontuur · Graad 7) — instructions for Claude

## Who you're working with (READ THIS FIRST)

The owner of this project is **not a professional developer**. She built this
app with AI help and wants to genuinely understand how it works, but she does
not have a programming background. Past sessions that assumed expert knowledge
caused real stress. Your job is to be a patient guide, not a terse colleague.

### How to communicate — always

1. **Plain English first.** Explain what you're doing and why in everyday
   language BEFORE showing any code or commands. Lead with the "so what."
2. **Define every technical term the first time you use it.** Don't say
   "I'll refactor the API client to memoize responses." Say "I'll reorganize
   the code that talks to the movie database (the 'API client') so it
   remembers answers it already fetched ('memoize' = remember) instead of
   asking twice."
3. **Use analogies for concepts.** A database is a filing cabinet, an API is
   a waiter taking orders to the kitchen, a cache is a notepad by the phone,
   an environment variable is a sticky note with a secret on it that never
   gets photocopied.
4. **Never assume knowledge.** No "just," "simply," "obviously," or "as you
   know." If a step requires her to do something (open a terminal, click
   something in Netlify/Supabase), spell out exactly where to click.
5. **Small doses.** Explain one idea at a time. After a big change, give a
   3–5 sentence plain-English summary of what changed and what she would
   notice in the app — not a wall of file names.
6. **It's her app.** When you make a decision (a library, a pattern, a
   trade-off), say what you chose and why in one friendly sentence, like
   you're explaining it to a smart friend who works in a different field.
7. **Reassure, don't alarm.** If something breaks, open with what it means
   for her ("nothing is lost, the app just can't reach the database right
   now") before the technical diagnosis.
8. **Check understanding at natural pauses**, e.g. "Want me to go deeper on
   how the scorer works, or is that enough detail?"

### Things she may ask for by name

- `/explain <anything>` — she can run this skill to get a plain-English tour
  of any file, folder, error message, or concept in this project.

## What this project is (plain English)

Wiskunde Avontuur is her **Grade 7 maths practice game** (Term 3, all
learner content in Afrikaans). Learners sign themselves up on their phones,
play short quest rounds — algebra, equations, geometry with a real on-screen
protractor, 2D shapes and transformations — earn XP, and get hints, worked
solutions and concept cards when they're stuck. She (the teacher) has an
admin dashboard where she opens/closes rounds as she teaches them and
watches each learner's progress and weekly XP.

## Technical map (for you, Claude — translate when discussing)

- **Frontend**: static ES modules, **no build step, no package.json, no
  bundler**. Entry `index.html` (learners) and `admin.html` (teacher).
  App code in `js/` — `app.js` (router/boot), `screens.js` (hub + chapter
  map), `play.js` (a round), `auth.js` (sign-up/login), `admin.js`
  (dashboard), `keypad.js`, `modal.js`, `ui.js`.
- **Content/curriculum**: `js/config.js` (the 5 chapters × 45 rounds list,
  colours, XP rules), `js/quests/ch1…ch5-*.js` (question generators, one
  file per chapter), `js/concepts.js` (the "Ek is verlore" concept cards),
  `js/engine/diagrams.js` + `js/engine/protractor.js` (to-scale SVG
  diagrams). Question wording is **Afrikaans**; keep new content Afrikaans
  and Grade-7-Term-3 level.
- **Two interchangeable backends** behind one interface (`js/api.js`):
  - **Supabase** (the cloud filing cabinet): auth + progress via
    SECURITY DEFINER RPCs only (functions prefixed `g7_`); direct table
    access is revoked. Config in `js/supabase-config.js` — the
    **publishable** key there is public-safe and committed on purpose.
    SQL lives in `supabase/schema.sql` (full setup) and
    `supabase/migration-teacher-dashboard.sql` (one-off upgrade that also
    includes everything from `migration-quest-gating.sql`).
  - **Local mode** (`js/local-backend.js`): pure localStorage, no login
    server needed. Triggered by `?local=1` or missing Supabase config.
    It deliberately mirrors every server feature, including the admin
    dashboard.
- **Secrets**: the Supabase **secret/service-role key is never in the repo**
  — it lives only in the Supabase dashboard. The **teacher/admin password**
  lives bcrypt-hashed in the `app_config` table in Supabase (set/changed via
  the SQL editor — see the comment near the bottom of `supabase/schema.sql`).
  `.gitignore` blocks `seed-private.sql` and `theory*/` — never commit
  learner data or private SQL.
- **Deploy**: **GitHub Pages**, served straight from the `main` branch of
  `megzieberr/maths-quest-grade7` (no Actions workflow; `.nojekyll` is
  there for Pages). Pushing to `main` IS the deploy — live at
  https://megzieberr.github.io/maths-quest-grade7/ (learners) and
  `/admin.html` (teacher) within a minute or two. A service worker
  (`sw.js`, network-first) makes installed phones pick up new versions
  automatically.
  **Database changes do NOT deploy with a push** — Megan must run the
  migration SQL once in the Supabase SQL editor.
- **Local dev**: no install needed. From the repo folder run
  `python3 -m http.server 5192` and open http://localhost:5192/ — no port
  is pinned anywhere in this repo, so any free port works; 5192 avoids
  clashing with the Grade 11 app's conventional 5191. Add `?local=1` to
  test without touching the real database.
- **Sibling project**: `megzieberr/maths-homework-quest` (cloned at
  `/workspace/maths-homework-quest`) is the **Grade 11** homework hub this
  app was modelled on (it came first, 2026-06-25; this repo started
  2026-06-27 from the same architecture). Same quest/mastery-loop/RPC
  pattern, but **separate Supabase projects** (different URLs and keys —
  never mix them). Both apps now bcrypt-hash learner passwords (Grade 11
  caught up in its commit e3ec374 — older notes in this repo saying Grade 11
  stores passwords readable are out of date). The sibling's
  `PROJECT-STATUS.md` documents a headless fuzz-testing pattern (import a
  quest module in node, generate thousands of questions, recompute answers)
  that works for this repo too.

## Decision log — what was chosen and WHY (do not silently reverse these)

- **Static ES modules, no build step** (README: "geen bou-stap") — nothing
  to compile means nothing to break; any static server or GitHub Pages can
  serve it as-is.
- **All access through SECURITY DEFINER RPCs; publishable key committed**
  (`supabase-config.js` header, `schema.sql` revokes all table access) —
  the browser key can only call the vetted functions, and every call
  re-verifies the password server-side.
- **Learner passwords bcrypt-hashed; teacher never sees them** (initial
  commit 0dd683e, README) — deliberate privacy choice (the Grade 11 app
  later adopted the same approach). Forgotten password → teacher "resets"
  (clears) it and the learner sets a new one on next login.
- **The logged-in learner's username+password sit in localStorage**
  (`js/session.js`) — by design: there are no session tokens; every RPC
  call authenticates itself. Don't "fix" this without redesigning the RPCs.
- **Service worker is network-first with revalidation** (commit 7b3a95a) —
  added specifically because installed PWAs kept showing stale versions
  until a hard refresh. Cache Storage is only an offline fallback; the
  cache name `wq-g7-v2` in `sw.js` gets bumped on big changes.
- **10 rounds per section, except Uitdrukkings with 5 — at the teacher's
  request** (commit a0d252d); Vergelykings uses a gentle one-step-only
  difficulty curve on purpose.
- **All 45 rounds were seeded OPEN when gating arrived** (commit e40461d)
  so the feature disrupted nobody; she closes the untaught ones. A client
  that doesn't receive `openQuests` treats everything as open — keep that
  fallback.
- **Weekly XP board uses an append-only `xp_events` table + a
  `weekly_anchor` timestamp** (commit a50a2fc) — "reset weekly" just moves
  the anchor; no XP history is ever deleted.
- **Greek polygon names** (pentagoon … dekagoon), with the standard
  "nonagoon" for 9 sides (commit 8824828) — matches what's taught in class.
- **Local mode mirrors every server feature** (commit a50a2fc) — so
  `?local=1` is always a complete, safe playground; keep the two backends
  in feature parity when you add anything.
- **Migrations are additive and idempotent, run by hand in the Supabase SQL
  editor** — `migration-teacher-dashboard.sql` is the current one-file
  setup for gating + dashboard and is safe to re-run.

## Gotchas that already caused real bugs (check before planning)

- **`?local=1` is sticky.** Visiting once sets `g7.forceLocal` in
  localStorage (`js/api.js`), and the app stays in offline mode on every
  later visit until that key is removed. If "progress isn't saving to
  Supabase," check this first before suspecting the database.
- **Installed phones used to need a hard refresh to get updates** — that's
  why `sw.js` exists (commit 7b3a95a). Two remnants: (1) any device that
  installed the app *before* the service worker existed needed one manual
  refresh to adopt it; (2) for big changes, bump the `CACHE` constant in
  `sw.js` so old caches get cleared.
- **`schema.sql` seeds the admin password as literally `admin`.** It must
  be changed with the one-line SQL `update` shown in the comment at the
  bottom of `schema.sql`. Never assume the live password matches the repo.
- **Pushing code does not update the database.** Any change to tables or
  `g7_*` functions needs Megan to paste the migration into the Supabase SQL
  editor and press Run — always tell her this explicitly, with the exact
  file to paste.
- **Two Supabase projects exist in her account** (this app:
  `wjkhedepwnwrqcpxmkds…`; Grade 11: `pjpwhalcifywjrwtjknd…`). Running this
  repo's SQL in the wrong project, or copying the wrong key, breaks the
  other class's app.
- Future sessions: when you hit a new one, append it here in the same style.

## How to plan any change here (walk this checklist, in order)

1. **Which backend(s) does it touch?** Almost every feature must land in
   BOTH `js/supabase.js` + the SQL (cloud) AND `js/local-backend.js`
   (offline) — they promise the same interface via `js/api.js`.
2. **Does the database change?** If yes: write an additive, idempotent
   migration in `supabase/`, update `schema.sql` to match, and plan the
   plain-English instruction telling Megan exactly what to paste into the
   Supabase SQL editor (SQL Editor → New query → paste → Run).
3. **Is it content (questions/rounds)?** Keep it Afrikaans and
   Grade-7-Term-3 level. A new round needs: an entry in `js/config.js`,
   a generator in the right `js/quests/chX-*.js`, a concept card in
   `js/concepts.js` if it's a new concept, and a row in the `quests`
   gating seed (SQL) so the teacher can open/close it.
4. **Verify before shipping.** Fuzz the generator headlessly in node
   (import the quest module, generate a few thousand questions, recompute
   the answers — the pattern in the sibling repo's PROJECT-STATUS.md),
   then actually play the round at `http://localhost:5192/?local=1`.
   Check `admin.html` too if the dashboard is affected.
5. **Big change? Bump `CACHE` in `sw.js`** so installed phones drop old
   files cleanly.
6. **Deploy = push to `main`** (GitHub Pages). Remind her the phone app
   updates itself on the next open; the SQL step (if any) is separate and
   manual.
7. **End with the plain-English summary** — what changed, what she and the
   learners will notice, and anything she must do (in exact steps).

## Working rules

- Explain any command before running it if she'll see it or need to repeat it.
- Never put secrets (API keys, Supabase keys) in committed files.
- After changes, always end with a plain-English "what changed and what
  you'll notice" summary.
