# Plan — Gr7 Leaderboard + Weekly Winners (Circle Quest pattern)

**Date:** 2026-08-24 · **Mode:** foreman day (Fable designs & reviews, Sonnet builds)
**Her ask:** "make me a leaderboard with weekly winners, exactly like the circle geo"

## What the kids will get

1. **🏆 Ranglys screen** — a hub tile opens a board with two tabs:
   **Hierdie week** and **Altyd**. Top 10 shown mobile-game style
   (🥇🥈🥉 medals), and a learner outside the top 10 still sees their own
   row below a "···" separator. Names = display_name (Gr7 has no
   nicknames/avatars — that Circle Quest layer is skipped, NOT ported).
2. **🔥 Friday–Sunday RALLY popup** — "the board locks soon, you're #N,
   only X XP behind #N−1" (chase line only under a 60 XP gap). Once per
   learner per week (localStorage flag), straight port of CQ's weekly.js.
3. **🌟 Monday–Tuesday CROWN popup** — last week's settled results,
   server-computed so every device agrees:
   - **🌟 Ster van die Week** — top weekly XP
   - **📈 Grootste Sprong** — biggest XP jump vs the week before,
     excludes the Ster
   - **🔥 Aan die Brand** — most Daaglikse-Quest days, excludes both
   - **🎯 Perfekte Week** — EVERYONE with 7/7 dailies (not winner-take-all)
   Three different kids win, so the dopamine spreads — that's the whole
   point of the CQ design. Plus the learner's own line: finished #N,
   moved up/down, best-week-ever flag.
   (⚠️ Award names above are DRAFT Afrikaans — her veto pass before ship.)
4. **Teacher previews** — admin dashboard buttons to open the exact crown
   and rally modals (screenshot-for-WhatsApp flow), plus `?wk=crown` /
   `?wk=rally` URL overrides, same as CQ.

**Not ported:** Circle Champion (CQ's one-time teacher-chosen term-end
honour) and the nickname/avatar layer. Easy to add later if she asks.

## How weeks work (the design call, resolved per her "exactly like circle geo")

- **Winners + crown:** pure calendar weeks, Monday 00:00 anchored, exactly
  CQ's `date_trunc('week', …)` maths — XP sums in UTC, daily-quest day
  counts in Africa/Johannesburg, same as phase9.sql.
- **The live "Hierdie week" board:** window = the LATER of this Monday and
  her `weekly_anchor`. So Monday auto-resets the board like CQ, and her
  existing "↺ Reset weekly" button still works (a mid-week reset zeroes
  the board) — this is literally how CQ's own local-backend mirror does it
  (`Math.max(startOfWeek(), weeklyAnchor)`).
- **Admin Weekly XP column** switches to the same window so teacher view
  and learner board never disagree.
- **No go-live date gate needed:** CQ's guards carry over — no popup when
  the board is empty. Ship this week ⇒ first rally lands Fri 28 Aug on
  real data, first crown Mon 31 Aug.

## Facts the build leans on (verified in code today)

- `xp_events` exists (append-only, `quest_id` text, indexed by
  student+time) — dailies log as `daily-YYYY-MM-DD`, dice as `dice-*`;
  dice XP correctly counts toward the week (XP-every-play ruling).
- "Aan die Brand" counts distinct SA days with `quest_id like 'daily-%'`
  (CQ counts `round_id = 'daily'`).
- Gr7 has no i18n module — Afrikaans strings written directly, obeying
  the language rulings (Klik op, geen "frase", ens.).
- sw.js auto-updates — **no cache bump needed** (unlike Gr11).
- Repo is PUBLIC — no learner names anywhere in code, commits, or plan.
- `?local=1` LocalBackend needs the same RPC mirrors (CQ pattern:
  leaderboard + weeklyResults mirrored in local-backend.js).

## Build sessions (Sonnet, foreman-reviewed between each)

**Session 1 — SQL + local backend.** New idempotent
`supabase/migration-weekly.sql`: `g7_leaderboard(p_username,p_password)`
(weekly/allTime top list + my ranks), `g7_weekly_results(...)` (last
week's board + the three awards + perfectWeek + me/prevRank/bestPrevXp —
port of phase9/phase10 minus champion/nicknames), `g7_admin_weekly_results
(p_admin_password)`, and `g7_admin_data`'s weekly window updated to
`greatest(date_trunc('week', now()), weekly_anchor)`. All SECURITY
DEFINER, search_path pinned, grants to anon+authenticated, g7_ prefix.
Mirror all of it in js/local-backend.js. **Migration NOT run by the
session** — ship step, hers to trigger. Verify: SQL file lints against a
dry read of schema; local-backend fuzz (seeded fake events → known
winners).

**Session 2 — learner UI.** `js/leaderboard.js` (port of CQ's, minus
profile bits, Afrikaans), hub tile, `js/weekly.js` port (rally/crown
orchestrator called at end of hub render, localStorage per-learner
week flags, ?wk= overrides, empty-board guards), CSS for lb-* and wk-*
in the Bubble Pop theme (Fredoka, bright — NOT CQ's palette), api.js
wiring. Verify: DOM-play at 375px against ?local=1 with seeded data —
board renders, own-rank row, both popups via ?wk=, 0 console errors.

**Session 3 — admin + polish.** Admin dashboard: 🌟 weekly-winners panel
(last week's three awards via g7_admin_weekly_results) + "Voorskou
kroon/rally" preview buttons; keep admin.html's ≥1560px laptop layout
rule. Verify: admin DOM walk, preview modals open, CSV untouched.

**Ship step (Fable session, her explicit yes):** run migration-weekly.sql
via MCP → migration-check skill → push → live-verify (login as test path,
?wk=rally on live, admin panel) → PROJECT-STATUS + memory update.

## Cost estimate (fan-out gate)

3 Sonnet sessions ≈ 150–250k tokens each + foreman reviews ≈ **0.6–0.9M
tokens total** for the day.

## Her rulings (2026-08-24, mid-build — FINAL)

- Tile/screen name: **"Leaderboard"** (English, NOT "Ranglys") — matches
  the UI-in-English house rule.
- Award names: **Ster van die Week · Grootste Sprong · Aan die Brand ·
  Perfekte Week** ("Grootste Verbetering" rejected in favour of
  Grootste Sprong).
