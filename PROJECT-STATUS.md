# Project status — updated 2026-08-10

## Where we are
Live at **https://megzieberr.github.io/maths-quest-grade7/** (+ `/admin.html`), repo
`megzieberr/maths-quest-grade7` (PUBLIC, GitHub Pages).

**2026-08-10 was a Fable foreman build night (Megan out for dinner, Fable ran six Sonnet
sessions with reviews between each).** Built, verified, committed locally — **NOT yet
pushed, migration NOT yet run**:
- **Hoofstuk 6 "Meetkunde Stellings"** — 32 rounds (st1–st32): six theorem blocks
  (regoorst · reguitlyn · om 'n punt · binnehoeke Δ · gelykbenig · buitehoek Δ), each
  intro ("Leer:" teaching card for the absent learner) → R1 (reason given, type value) →
  R2 (value given, pick reason) → R3 (both, calcReason). Gelykbenig is a 6-round block
  (÷2 → geen-÷2 → "Deel jy deur 2?" Yay/Nay); buite has a "Binne of buite?" recognition
  round. Five mixed rounds close the chapter. Reason wording verbatim from her class notes
  (js/redes.js).
- **s11 + s12 in 2D Vorms** — tap teenoorstaande/aangrensende sye + hoeke; pyltjies/
  merkies/blokkie symbol drills. Quad properties transcribed from her Eienskappe-doc.
- **Daaglikse Quest** — hub tile serving 10 questions from admin-ticked "Hersiening"
  rounds; quest_id daily-YYYY-MM-DD; graceful on live until the migration runs.
- **tools/verify-stellings** (.mjs node runner + .html gallery) — MEASURES every generated
  figure against its question's maths + label distances + range rules: final run
  **17,760 diagrams / 46,993 angles / 0 mismatches**. The .html page doubles as Megan's
  scroll-through review.
- App total now **79 rounds**. Run plan + all rulings: `RUN-PLAN-2026-08-10.md`.

## Decisions
(older decisions from 2026-07-22 install work: see git history of this file)
- **2026-08-10 — Foreman night rulings (hers):** intro round before every theorem block;
  gelykbenig gets geen-÷2 + Yay/Nay rounds; binne-of-buite recognition round after buite
  intro; s11 includes teenoorstaande hoeke; **"click stays click" — new learner content
  says "Tap", never "tik"/"klik"** (old rounds left as-is for now); **no flat triangles** —
  isosceles apex capped 30°–120°, every marked angle ≥ 25°, verify harness hard-fails
  violations.
- **2026-08-10 — Seeding:** st1–st32 + s11/s12 seed CLOSED (she opens as class covers);
  Deel 2 (next build day) will seed OPEN.
- **2026-08-10 — Mixed-round tips/hints never name the theorem or show the result** (Wenk
  is available pre-answer). Single-theorem rounds may name it — their titles do anyway.
- **2026-08-10 — Answer-determining variants are forced by the skills list** (5+5
  shuffled), never a coin flip inside one generator (st20/st24 foreman fix).
- **2026-08-10 — Daily quest reuses the normal play loop + submit path** with a synthetic
  def; no new tables; "Hersiening" is a separate flag from open/close.

## Pending on Megan
- 💻 5 min **[blocking]**: open `tools/verify-stellings.html` in the repo (or the chat
  review page) → scroll the figures → if happy, tell the Fable session "ship it" → it runs
  `supabase/migration-stellings-daily.sql` on Homework Hub and pushes.
- 📱 3 min **[whenever, after ship]**: on your phone on live — open one st round as a test
  learner, tick one round "Hersiening" in admin, check the Daaglikse Quest tile appears.

## Next up
- Ship ritual (Fable session): run migration-stellings-daily.sql → push → live verify →
  she opens st1 (Leer: Regoorstaande hoeke) for the class when ready.
- **Deel 2 build day — Sessions 7–11** (one chapter per session, 45 b-rounds, new question
  styles, seed OPEN): full prompts ready in `RUN-PLAN-2026-08-10.md` §"Queued for the next
  build day". Session 11 also writes migration-deel2.sql.
- After Deel 2 ships: consider retro-fitting "Tap" wording into the old s7 round (her
  call, low priority).
