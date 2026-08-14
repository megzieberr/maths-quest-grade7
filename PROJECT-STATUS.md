# Project status — updated 2026-08-13 (Deel 2 night build DONE, awaiting her review — NOTHING shipped)

## Where we are
Live site unchanged tonight. Locally, the whole Deel 2 build is DONE and foreman-reviewed:
**31 new rounds** — m1b–m10b (ch3), s1b–s10b (ch4), t1b–t10b (ch5), plus her chat-requested
**s13 "Eienskappe van vorms"** (shape name + CLEAN figure → tap the matching properties from
a 10–13 list, truth-matrix driven). `supabase/migration-deel2.sql` is WRITTEN (31 ids, all
seeded OPEN, idempotent) but **NOT RUN**. Repo is 8 commits ahead of origin (Session 1's
archive/dashboard work + tonight): 1b3d0c1, 3a874a9, 77c86b6, cc6a28f, 34e7598, af9ba68,
3cfa64e + status. Verify state at wrap: verify-stellings 19,860 diagrams 0 mismatches;
fuzz-s13 and fuzz-ch5b (new harnesses) both green; every new mechanic DOM-played at phone
width, 0 console errors.

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

## Pending on Megan
- 💻 15 min **[blocking]**: play the new rounds before they reach the kids — say "start the
  preview" in a session, then open http://localhost:5192/?local=1 → Meetkunde/2D Vorms/
  Transformasies, elke "— Deel 2" rondte + "Eienskappe van vorms" (round 23 in 2D Vorms).
- 💬 1 min **[whenever]**: t6b (dubbele 180°-rotasie) is correct but all 5 questions share
  the one "you land back where you started" trick — say if you want more variety mixed in.

## Next up
- Her review of the 31 rounds → then the ship step in a Fable session (run plan § "Ship
  plan"): run migration-deel2.sql on Homework Hub (ref wjkhedepwnwrqcpxmkds) → git push
  (Pages; sw auto-updates) → live verify (play one b-round + s13 as test learner, b-rounds
  show OPEN). Session 1's archive/dashboard work rides along in the same push.
- Then her queued ask: **weekly winners** (Circle Quest pattern — see 2026-08-11 entry
  below/git history: three awards to three different learners, g7_ RPCs in a NEW migration;
  ⚠️ the weekly_anchor vs date_trunc('week') design call is HERS before building).
- **Her round ideas 2026-08-14 (for the next build session):**
  1. Protractor round reading from the OTHER side — 0° on the LEFT, so the correct reading
     comes off the other row than usual (extend js/engine/protractor.js carefully; the
     dual-scale drawing itself is sacred, this is an orientation/arm variant).
  2. Reflex-angle CALCULATOR round (her upgrade 2026-08-14): show a REFLEX angle figure,
     give the smaller angle (e.g. 50°) — the learner gets the Blipwork in-app Casio
     (port js/calculator.js from maths-homework-quest, COMP arithmetic only, strip the
     stats mode) and literally types 360 − 50 = ; the round watches the display via the
     calculator's onEvent hook and passes when the right answer shows. Copy the calc CSS
     too. (Reconcile with m10's existing genReflexFromInner; check what m10 draws first.)
- Still floated from Sunday: traps in st28–st32; "Tap" retro-fit in old s7; trap-style
  questions in Deel 2 rounds where the pattern fits.
