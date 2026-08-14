# Project status — updated 2026-08-14 (late afternoon: correction day SHIPPED — arrows fixed, m10 got the Casio; migration-nuwe-rondtes.sql still gated on her preview play)

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

## Pending on Megan
- 📱 7 min **[blocking]**: open megzieberr.github.io/maths-quest-grade7/?preview=1 →
  Meetkunde → play m1c (rondte 3, "ander kant") + m11 (rondte 22, sakrekenaar), and
  eyeball today's fixes on the live rounds (m3 arrows, m10 Casio) → happy? say "run the
  new migration" (m1c+m11 seed CLOSED; add "and open them" to put them straight on the
  kids' maps).
- 💬 1 min **[whenever]**: t6b (dubbele 180°-rotasie) is correct but all 5 questions share
  the one "you land back where you started" trick — say if you want more variety mixed in.

## Next up
- On her "run the migration": run migration-nuwe-rondtes.sql on Homework Hub
  (wjkhedepwnwrqcpxmkds) — open-or-closed decided at that moment → live verify.
- Then her queued ask: **weekly winners** (Circle Quest pattern — three awards to three
  different learners, g7_ RPCs in a NEW migration; ⚠️ the weekly_anchor vs
  date_trunc('week') design call is HERS before building).
- Still floated from Sunday: traps in st28–st32; "Tap" retro-fit in old s7; trap-style
  questions in Deel 2 rounds where the pattern fits.
