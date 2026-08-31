# Project status — updated 2026-08-24 (🏆 Weekly winners SHIPPED LIVE on her "Ship it!" — migration RAN first, then push; live-verified)

> **2026-08-24 (ship, on her "Ship it!"):** migration-weekly.sql RAN via MCP on the
> Homework Hub project (verified in the DB: right project confirmed first — g7 helpers
> present, 0 mhq_ functions; all 4 functions live, SECURITY DEFINER, search_path
> pinned, anon+authenticated execute, g7_admin_data carries the new greatest() window,
> fake creds → clean 'auth' error), THEN pushed cc096b5..b76ac53 (incl. the morning
> pending-sweep commit that was already sitting local). Live-verified: weekly.js /
> leaderboard.js / local-backend.js / admin.js all serve 200 with the new content
> ("Grootste Sprong" greps live), hub boots in ?preview=1 with the 🏆 Leaderboard
> tile, no popup misfires, 0 console errors. sw auto-updates — no cache bump.
> First rally lands naturally Fri 28 Aug; first crown Mon 31 Aug.
> A stray wiskunde-avontuur-leerders.csv (Session 3's CSV-button test on the FAKE
> Toets class) was deleted before push — never a real-data file.

> **2026-08-24 (Weekly winners foreman day — her "run the plan", Fable dispatched 3
> Sonnet sessions, reviewed each with own eyes):** the Circle Quest leaderboard +
> weekly-winners pattern, ported per `PLAN-weekly-winners.md`. Commits dea183d (SQL
> + local mirror) → d8fb152 (learner UI) → 1dd2e8f (admin panel) → 20eeb93 (foreman
> review fix). LOCAL ONLY — `supabase/migration-weekly.sql` is written but NOT run;
> nothing pushed. Until the migration runs, the live UI is graceful: the Leaderboard
> screen shows a friendly empty state and no popups fire (RPC throw is caught).
> What's in: 🏆 "Leaderboard" hub tile → screen with "Hierdie week"/"Altyd" tabs
> (top 10 + own row below "···"); Fri–Sun rally popup with the chase line; Mon–Tue
> crown popup with her award names (🌟 Ster van die Week · 📈 Grootste Sprong ·
> 🔥 Aan die Brand · 🎯 Perfekte Week 7/7 — three DIFFERENT winners by design);
> admin 🌟 Weekly winners panel + "Voorskou: kroon/rally" buttons for WhatsApp
> screenshots. Foreman verified everything in the DOM at 375px on a 13-learner
> seeded local class: all four awards correct (incl. the Sprong-excludes-Ster
> rule), chase line "Jy is #12 — net 20 XP agter #11!", rank-12 own row, admin
> panel + both previews, 0 new console errors. fuzz-weekly.mjs green (6/6 groups,
> foreman re-ran it). Review fix 20eeb93: local adminData's weekly window now
> matches the SQL (greatest(Monday, weekly_anchor)) — offline-mirror-only bug,
> live data was never wrong.

> **2026-08-21 (ship, on her "You can ship it"):** migration RAN via MCP (g7_submit_dice
> verified on live: SECURITY DEFINER, search_path pinned, anon+authenticated execute,
> fake-creds → clean auth error, 0 dice rows at ship), THEN pushed (7db2f03..cad2df0).
> Live-verified: dice.js + screens.js serving with the review fixes, Dice Quest card
> renders on the live Meetkunde page in ?preview=1, 0 console errors. sw auto-updates —
> no cache bump needed.

> **2026-08-21 (Dice Quest day — her /go: Sonnet built, Fable foreman-reviewed):** every
> chapter page (ch3–ch6) gets a 🎲 **"Dice Quest"** card (her wording; chapter page, NOT
> the hub) dealing 10 fresh questions evenly across that chapter's teacher-open rounds
> via the Daaglikse Quest mechanic, now factored into shared js/deal.js. ch6 deals ONLY
> the gemeng rounds st28–32 (a single-theorem round's hint names its theorem = leak in a
> mixed deal); its card appears once the learner's chain unlocks st28. **XP pays EVERY
> play** (her ruling): new g7_submit_dice RPC in supabase/migration-dice.sql —
> server-computed 10 XP per first-try-correct, cap 100/play; `passed` stays false
> forever so dice-* ids never enter the chip grid or CSV. **Migration NOT run** — until
> it runs, dice is fully playable and XP simply doesn't bank (graceful). Foreman catches,
> fixed in cad2df0: (1) the results screen now shows the XP that actually BANKS (was the
> client streak number) with dice-specific copy — no kenteken-talk; (2) the double-submit
> hole closed (finish() re-entry guard + the "Gaan voort" button disables) — latent
> app-wide, but only g7_submit_dice (no was_passed gate) could PAY TWICE on a double-tap.
> Verified: fuzz-dice.mjs green twice (300 deals/chapter), full DOM plays at 375px (dice
> ×2 incl. deliberate double-clicks on every continue → exactly ONE xp_event; m1 normal
> round renders byte-identically, badge pop and all), 0 console errors.

> **2026-08-14 evening (her playtest catches, pushed on her "push"):** five wording fixes
> (aangrensende; rand→omtrek everywhere; radius sonder "(straal)" — straal is dié app se
> woord vir 'n RAY; Tik→"Klik op" in klik-rondtes, app-wyd insluitend die ou "Tap"-rondtes
> s11/s12/s13 op haar ruling; Poligone s5b wys nou die poligoon-figuur by elke vraag),
> plus: waarde-chips (koördinate) breek nooit meer oor 'n reël nie (white-space:nowrap),
> en t2b het nou 'n vasgespelde 📖 Leer-voorbeeldkaart (def.lesson, soos ch6) én
> twoPointFigure — A én A′ geplot met 'n stippelpyl, dx/dy so gekies dat A′ op die rooster
> pas. Alles DOM-geverifieer (rondte as leerder gespeel, "✓ Reg!").

> **2026-08-14 correction day (her /go + "fix the bent arrow and then you can ship"):**
> four commits built, foreman-reviewed and PUSHED LIVE: (1) parallel marks are now real
> chevrons drawn ON the line (parMark in diagrams.js) instead of the floating "›" glyph
> she screenshotted — incl. rotated marks on slanted quad sides; (2) m10's three
> calculation questions converted to calcdo — the kids type 360−104= on the in-app Casio
> (genReflexIdentify stays mc; new tools/fuzz-m10.mjs, 0 failures); (3) the bent-ray
> buitehoek arrowhead was y-mirrored (~46° off) — angleOfVec is y-up, arrowHead is
> y-down; fixed by negating at both call sites (verify-stellings: 19,860 diagrams,
> 0 mismatches). m3 + m10 are open rounds, so these went live to the class on push.

> **2026-08-14 late:** on her go, the 4 local commits were pushed to Pages and
> live-verified: plain URL boots to Teken in (kids see nothing new — m1c/m11 have no
> quests rows, SQL-confirmed empty); ?preview=1 shows "Juffrou-voorskou", meetkunde
> = 22 rounds with both new ones on the map; js/calculator.js serves live with the eq
> hook; 0 console errors. migration-nuwe-rondtes.sql still NOT run — that's the switch
> that puts the rounds on learner maps (seeds them CLOSED even then).

> **2026-08-14 midday (foreman day, Fable ran the agents on her /go):** she played the
> Deel 2 preview and said "run the migration" → migration-deel2.sql RAN on Homework Hub
> (verified: 31/31 rows, all open) — **the class has Deel 2 now** (code was already live).
> Then her two queued rounds were built by two Sonnet sessions, each foreman-reviewed
> (diff read + DOM-played at 375px with own eyes): commits 9b336e1, 19d9031 (review fix),
> bacab5c. NOTHING pushed — her check gates the deploy.

## Where we are
🎲 Dice Quest is LIVE (2026-08-21 blocks above) — card on every chapter page, XP pays
every play through g7_submit_dice (migration ran before the push, so no unpaid window).
Live site: Deel 2 fully open to learners since midday yesterday (migration ran; sw
auto-updates), PLUS today's correction-day fixes (chevron parallel marks, m10 Casio,
bent-ray arrowhead). The two NEW rounds are pushed but only visible in ?preview=1
until migration-nuwe-rondtes.sql runs:
- **m1c "Lees die gradeboog — ander kant"** (ch3, after m1b) — protractor engine got an
  opt-in `baseSide:"left"` (default output byte-identical, proven by capture + the new
  `tools/verify-gradeboog-c.mjs`, 32 angles 0 failures). Arm A left → correct reading is
  the OUTER row; classic inner-row mistake rejected (DOM-verified).
- **m11 "Refleks-hoeke met die sakrekenaar"** (ch3, after m10b) — new `calcdo` question
  type: real reflex figure (`reflexFigure` in diagrams.js, "?" stays orange) + Blipwork's
  Casio ported COMP-only (`js/calculator.js`, new `eq` event). Auto-passes when "="
  shows 360 − klein; "Gaan my antwoord na ✓" commits a wrong display into the normal
  wrong flow; Syntax ERROR/incomplete "=" never counts as an attempt.
  `tools/fuzz-m11.mjs`: 500 questions + real key-press pipeline, 0 failures.
`supabase/migration-nuwe-rondtes.sql` seeds BOTH rounds **CLOSED** — written, **NOT run**.
All harnesses green at wrap; DOM plays clean at phone width, 0 console errors.

## Decisions
(2026-07-22 install, 2026-08-10 day+night, 2026-08-11: see git history of this file / below.)
- **2026-08-13 (night, her /go)** — foreman session dispatched Sessions 2/3/3b/4 itself as
  sequential Sonnet subagents (her explicit go), review between each, NOTHING ships until
  she reviews the questions.
- **2026-08-13** — house rule extended: any round where the skill entry determines the
  ANSWER (waar/onwaar claim rounds) gets `shuffleSkills = true` (ch3/ch4/ch5 Deel 2 loops).
- **2026-08-13** — claim-round figures must never display or contradict the value the claim
  asks about (s3b hides base angles as "?" via hide:"base").
- **2026-08-13** — inclusive-definition rule for property/claim content: a true-but-redundant
  fact (vierkant is ook 'n reghoek/ruit/parallelogram; gelyksydig is ook gelykbenig) is
  NEVER shown as a wrong option/false claim — it's excluded entirely.
- **2026-08-13** — s13 clean figures: the shared QUADS coordinates are only readable WITH
  decoration; clean rounds use exaggerated per-round pts (`quadPropsFigure` opt.pts,
  opt-in — s4/s11/s12 pixel-identical).
- **2026-08-13** — migration-deel2.sql seeds **31** ids (30 b-rounds + s13), all is_open
  TRUE (her 2026-08-10 "Deel 2 seeds OPEN" ruling), sort band 300+.
- **2026-08-13** — spelling for learner-facing property text: "Teenoorstaande", "parallel".
- **2026-08-14** — migration-deel2.sql RAN on Homework Hub (31/31 verified) on her
  explicit go after her phone playtest. Deel 2 is live content now.
- **2026-08-14** — NEW-content rounds seed **CLOSED** in migration-nuwe-rondtes.sql (the
  Deel 2 open-seeding ruling was specific to revision rounds of already-taught material).
- **2026-08-14** — m1c's in-play prompt is deliberately identical to m1's: noticing which
  side arm A is on IS the skill. The "ander kant" cue lives only in the round
  title/blurb, the hint, and the figure itself.
- **2026-08-14** — m11 pass semantics: auto-pass the moment "=" shows the right value; a
  wrong "=" never auto-fails (only the "Gaan my antwoord na ✓" button commits it); Syntax
  ERROR/incomplete never counts as an attempt; a bare typed answer is accepted (the
  display is the check — no method policing).
- **2026-08-14 (correction day)** — her call: old m10's calculation questions ALSO use the
  Casio (calcdo), not just m11 — kids should literally type 360−104=. m11's remaining
  distinctive is its reflex FIGURE. genReflexIdentify stays mc (recognition, no sum).
- **2026-08-14 (correction day)** — parallel-mark notation is DRAWN chevrons on the line
  (parMark, y-up angleOfVec convention), never text glyphs. Convention rule for
  diagrams.js: angleOfVec/arcPoly are y-UP, arrowHead's ang is y-DOWN — negate when
  feeding one to the other (the bent-ray arrowhead bug was exactly this).
- **2026-08-14 (evening, her rulings from the live playtest)** — circle wording: the
  sirkel se buiterand heet die OMTREK, nooit "rand"/"randpunte" nie; "radius" staan
  alleen (geen "(straal)" nie — straal beteken 'n ray in hierdie app se ch3). Vlieer:
  "aangrensende" (nie "langsaan-liggende" nie). Klik-instruksies sê "Klik op" — die ou
  "Tap"-ruling is HIERMEE VERVANG, app-wyd; "Tik" bly net waar dit TIK/tipe beteken
  (sakrekenaar, keypads, aanteken-velde). Waarde-chips mag nooit oor 'n reël breek nie.
  Rondtes met kaal regte-lewe verwysings (heuningkoek) kry 'n figuur by elke vraag.
- **2026-08-14 (evening)** — t2b patroon vir "moeilike eerste kennismaking": een
  uitgewerkte voorbeeld in 'n vasgespelde 📖 Leer-kaart BO die vrae (def.lesson werk in
  enige hoofstuk, nie net ch6 nie) + albei punte geplot (twoPointFigure) sodat die
  leerder kan TEL; genereer-waardes word so begrens dat alles op die figuur pas.

- **2026-08-21 (Dice Quest day)** — her rulings: name is exactly **"Dice Quest"** (🎲);
  the card lives INSIDE each chapter's page, not the hub; XP pays EVERY play like
  Blipwork's dice. Design: pool = that chapter's teacher-open rounds only; ch6 pool =
  gemeng (st28–32) only, card gated on the chain reaching st28; deal mechanic shared
  with the Daaglikse Quest (js/deal.js); dice progress rows keep passed=false forever
  (no kenteken → no chip-grid/CSV leak); the XP amount is SERVER-computed
  (10 × first-try-correct, cap 100), never client-named — dice is infinitely
  repeatable, a client-named amount would be farmable.
- **2026-08-21 (foreman)** — results screens must show the XP that actually BANKS;
  double-submit law now enforced at finish() + the continue button (the hole was latent
  app-wide; only the gate-less dice RPC could pay twice).
- **2026-08-24 (weekly winners, her rulings)** — screen/tile name is **"Leaderboard"**
  (English, NOT "Ranglys"); award names verbatim: **Ster van die Week · Grootste
  Sprong · Aan die Brand · Perfekte Week** ("Grootste Verbetering" rejected).
- **2026-08-24 (week windows, per her "exactly like circle geo")** — the LIVE board
  (learner "Hierdie week" tab AND admin Weekly XP column) uses greatest(this Monday
  00:00, weekly_anchor): Monday auto-reset AND her ↺ Reset weekly button both work.
  The CROWN (Mon–Tue popup + admin winners panel) uses PURE calendar weeks —
  a mid-week reset can never change last week's settled winners.
- **2026-08-24** — NOT ported from Circle Quest, deliberately: nicknames/avatars
  (Gr7 has no profile layer) and Circle Champion (one-time term-end honour).
  Empty-board guards replace CQ's go-live date gating.
- **2026-08-24** — "me" on the board is matched by display_name, not id (the RPC
  rows carry no ids): two learners sharing an exact display_name would both
  highlight. Known, accepted limitation.

## Pending on Megan
- Nothing. (2026-08-31 sweep, her word: the 🌟 Weekly-winners phone eyeball is KILLED — the Afrikaans popup wording stands as built, no veto coming.)
(2026-08-24 sweep, her word: she is done with the earlier Gr7 queue — m1c/m11 are hers to open whenever she teaches them; t6b STAYS as built; Dice Quest phone test DONE, Afrikaans passed.)

## Next up
- Watch the first natural cycle: rally Fri 28 Aug, first crown Mon 31 Aug — the
  admin "Voorskou: kroon" button is the WhatsApp-screenshot path that Monday.
- Still floated from Sunday: traps in st28–st32; "Tap" retro-fit in old s7; trap-style
  questions in Deel 2 rounds where the pattern fits.
