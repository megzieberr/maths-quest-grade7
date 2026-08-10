# Project status — updated 2026-08-10 (late night, all SHIPPED & live-tested by Megan)

## Where we are
Live at **https://megzieberr.github.io/maths-quest-grade7/** (+ `/admin.html`), repo
`megzieberr/maths-quest-grade7` (PUBLIC, GitHub Pages). App is **79 rounds / 6 chapters**.

**2026-08-10 was a full Fable foreman day+night.** Day: six Sonnet build sessions
(reviewed between each) → shipped Hoofstuk 6 "Meetkunde Stellings" (32 rounds, st1–st32),
s11/s12 2D drills, the Daaglikse Quest + Hersiening tick-list (migration RUN on Homework
Hub). Night: Megan phone-tested live and streamed rulings; three more shipped batches:
1. **Sequential locks** in ch6 (js/chain.js — unlock = previous OPEN round passed 80%,
   teacher-closed rounds skipped, passed rounds always replayable, deep links guarded).
2. **Six evening features**: "Volgende rondte →" on results (all chapters, not daily);
   st2/st3/st4 discrimination traps; per-angle colours (arc+label+lesson text match, "?"
   stays orange); st18↔st19 swap (basishoek-gegee now FIRST); "só doen jy dit" lesson
   slide on st19; "Wanneer deel jy deur 2?" slide on st20.
3. **Traps in ALL six theorem blocks** (~3-in-10 per R1/R2/R3 round, forced+reshuffled per
   play): always-present escape ("Nie regoorstaande hoeke nie" / "…op 'n reguitlyn…" /
   "…om 'n punt…" / "Nie al drie binnehoeke nie" / "Nie 'n gelykbenige driehoek nie" =
   scalene with NO merkies / "Nie 'n buitehoek nie" = HER bent-line design + interior
   variant). Escape = button on calc/calcReason, ✋-chip on reasonQ (pseudo-codes in
   js/redes.js, ambiguity guard: trap chips never include a genuinely-fitting code).

**Verification state at ship:** tools/verify-stellings (.mjs runner + .html gallery)
measures every generated figure vs its own maths + label distances + content-range rules:
**17,760 diagrams / 46,067 angles / 0 mismatches**; 190 trap-grading checks 0 failures.
Run `node tools/verify-stellings.mjs` before ANY ch6 content change.

## Decisions
(2026-07-22 install decisions: see git history of this file)
- **2026-08-10 (day)** — intro "Leer:" round opens every theorem block; gelykbenig = 6-round
  block; "Binne of buite?" recognition round; **"Tap", never "tik"/"klik"** in new learner
  content; **no flat triangles** (apex 30°–120°, marked angles ≥ 25°, verifier hard-fails);
  st-rounds seeded CLOSED (she opens per theorem), Deel 2 will seed OPEN; mixed-round
  tips/hints never name the theorem.
- **2026-08-10 (night)** — sequential locks are ch6-ONLY, unlock = passed 80%; trap
  questions are the house pattern for "did you actually look at the figure": always-present
  escape so its existence never signals; **trap and normal questions in the same round
  share ONE identical hint** (look-first, method in words, no numbers — the Wenk is
  tappable pre-answer, so any numeric hint reveals and any differing hint betrays traps);
  trap rounds reshuffle question order every playthrough (def.shuffleSkills); st18/st19
  swapped (equal-first, ÷2 second) — supersedes the original run-plan order;
  buitehoekBentFigure returns { svg, markedAngle } (bend is random, caller needs the real
  drawn angle for _chk); bent labels display whole degrees, _chk stays exact.
- **2026-08-10** — the /go scope discipline WORKED as designed: the locks agent refused six
  mid-flight addenda because its written scope said locks-only; fix is a properly-scoped
  fresh dispatch, not looser agents.

## Pending on Megan
- Nothing blocking. (She live-tested every batch on her phone before/after each ship,
  2026-08-10 evening; migration confirmed run; all pushes verified serving.)
- 📱 1 min [whenever]: open st rounds in admin as the class covers each theorem — all 34
  new rounds are still CLOSED.

## Next up
- **Deel 2 build day (her word: tomorrow, 2026-08-11)** — Sessions 7–11, one chapter per
  session, 45 b-rounds with genuinely NEW question styles, seed OPEN. Full prompts +
  shared brief ready in `RUN-PLAN-2026-08-10.md` § "Queued for the next build day".
  Session 11 also writes migration-deel2.sql (run at that day's ship).
- Consider (her call, floated tonight): extend the trap pattern into the mixed rounds
  st28–st32; retro-fit "Tap" wording into old s7; trap-style questions in Deel 2 rounds
  where the pattern fits.
- Any polish she spots overnight gets picked up in the Deel 2 session.
