# Project status — updated 2026-08-11 (foreman day PAUSED mid-queue, limit reset)

## Where we are
Live at **https://megzieberr.github.io/maths-quest-grade7/** (+ `/admin.html`), repo
`megzieberr/maths-quest-grade7` (PUBLIC, GitHub Pages). Live site still shows the
pre-2026-08-11 state; today's work is committed locally, **NOT pushed**.

**2026-08-11 foreman day, paused after Session 1 of 4.** Session 1 BUILT + reviewed green
(commit ff33a89): ch1+ch2 (Uitdrukkings/Vergelykings) archived — gone from the learner
map, folded into a "📦 Argief" block in admin, all XP/progress kept; admin learner grid
regrouped into per-chapter colour clusters with round-id chips (u1/m7/st12) and
"gespeel <datum>" in the tooltip (last_played_at was already in the payload — front-end
only, NO migration to run); CSV now uses round ids + a last-played column; Daaglikse
Quest can never pull from an archived chapter.

Sessions 2–4 (Deel 2 for ch3/ch4/ch5, 30 b-rounds + migration-deel2.sql) are prompted
and queued in **RUN-PLAN-2026-08-11.md** — none dispatched yet.

## Decisions
(2026-07-22 install decisions: see git history of this file; 2026-08-10 day+night
decisions: see that date's entries below.)
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
- **2026-08-11** — "hersiening rounds" = the queued Deel 2 siblings (her ruling); ch1+ch2
  archived because the class isn't doing algebra any more this year — archive means:
  invisible to learners, folded in admin, data kept, one config flag (`archived: true`)
  to reverse; Sunday's Sessions 7–8 (u/v b-rounds) DROPPED, migration-deel2.sql seeds 30
  ids not 45; admin chip grid is per-chapter clusters with dates, never a flat 1–N strip;
  archived history shows as a dimmed Argief cluster only for learners who have data there.

## Pending on Megan
- 💻 1 min [blocking Session 2 dispatch]: confirm — did you tell Session 1 mid-build to
  hide the admin "Where the class is stuck" section? Yes = stays hidden; no = I flip
  `SHOW_STRUGGLES` back on.
- 💻 5 min [whenever, after limit reset]: dispatch Session 2 from RUN-PLAN-2026-08-11.md.

## Next up
- Sessions 2–4 (Deel 2 ch3/ch4/ch5), one at a time with foreman review between, prompts
  ready in RUN-PLAN-2026-08-11.md. Session 4 also writes migration-deel2.sql (30 ids).
- Then the ship step from this Fable session (run plan § "Ship plan"): migration → push →
  live verify. Session 1's archive+dashboard work rides along with that ship, or can ship
  alone earlier if she asks.
- Still floated from Sunday (her call): extend traps into st28–st32; retro-fit "Tap"
  wording into old s7; trap-style questions in Deel 2 rounds where the pattern fits.
