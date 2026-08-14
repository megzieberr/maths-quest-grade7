/* ============================================================
   GEDEELDE QUEST-HELPERS
   ------------------------------------------------------------
   Kort bouers vir elke vraagtipe sodat die quest-lêers netjies
   bly. Elke bouer gee 'n vraag-objek terug wat questions.js wys.
   ============================================================ */
import { randInt, pick, shuffled } from "../ui.js";
import { REDES } from "../redes.js";
export { randInt, pick, shuffled };

/* meervoudige keuse. options = [{label, correct}], word geskommel. */
export function mc(prompt, options, extra = {}) {
  return { type: "mc", prompt, options: shuffled(options), ...extra };
}
/* bou opsies uit 'n korrekte waarde + verkeerdes (afleiers) */
export function mcFrom(prompt, correct, distractors, extra = {}) {
  const opts = [{ label: String(correct), correct: true },
    ...distractors.map(d => ({ label: String(d), correct: false }))];
  return mc(prompt, opts, { answerLabel: extra.answerLabel ?? String(correct), ...extra });
}
/* waar/onwaar (of Ja/Nee via labels) */
export function tf(prompt, isTrue, extra = {}) {
  return { type: "tf", prompt, yes: !!isTrue, ...extra };
}
/* getikte getal-antwoord (sleutelbord) */
export function calc(prompt, expected, extra = {}) {
  return { type: "calc", prompt, expected, answerLabel: extra.answerLabel ?? fmt(expected, extra.dp), ...extra };
}
/* kies-almal (gelyksoortige terme ens.) chips = [{label, correct}] */
export function multi(prompt, chips, extra = {}) {
  return { type: "multi", prompt, chips: shuffled(chips), instruction: extra.instruction || "Kies almal wat pas, dan Stuur.", ...extra };
}
/* koördinaat-paar */
export function coord(prompt, expected, extra = {}) {
  return { type: "coord", prompt, expected, allowNeg: true,
    answerLabel: extra.answerLabel ?? `(${expected.x} ; ${expected.y})`, ...extra };
}
/* tik-die-deel: figure bevat [data-tap] areas; target = die regte sleutel */
export function tap(prompt, target, figure, extra = {}) {
  return { type: "tap", prompt, target, figure, ...extra };
}
/* gradeboog-lees */
export function protractor(prompt, angle, extra = {}) {
  return { type: "protractor", prompt, angle, unit: "°",
    answerLabel: extra.answerLabel ?? `${angle}°`, ...extra };
}
/* sakrekenaar-vraag: (opsionele) figuur + 'n werklike Casio; die vraag
   slaag sodra "=" die REGTE waarde wys (of via die "Gaan my antwoord
   na ✓"-knoppie, wat die laaste "="-resultaat teen expected toets). */
export function calcdo(prompt, expected, extra = {}) {
  return { type: "calcdo", prompt, expected,
    answerLabel: extra.answerLabel ?? fmt(expected, extra.dp), ...extra };
}

/* ---------- Hoofstuk 6: Meetkunde Stellings — rede-vrae ---------- */
/* hulp: sorg dat die korrekte kode in die aangebode lys is, geskommel */
function withCorrect(correctCode, offeredCodes) {
  const codes = offeredCodes.includes(correctCode) ? offeredCodes : [correctCode, ...offeredCodes];
  return shuffled(codes.map(c => ({ code: c, correct: c === correctCode })));
}

/* kies-die-rede: prompt + figuur + 'n chip-rooster (kort groot, vol klein).
   correctCode = die regte REDES-sleutel; offeredCodes = al die kodes om te wys
   (moet correctCode insluit — indien nie, word dit outomaties bygevoeg). */
export function reasonQ(prompt, correctCode, offeredCodes, figure, extra = {}) {
  const options = withCorrect(correctCode, offeredCodes);
  return { type: "reason", prompt, figure, correctCode, options,
    answerLabel: extra.answerLabel ?? REDES[correctCode].kort, ...extra };
}

/* waarde ÉN rede: sleutelbord (waarde) + chip-rooster (rede) — Stuur toets albei.
   expected = die korrekte hoekwaarde; correctCode/offeredCodes soos reasonQ. */
export function calcReason(prompt, expected, correctCode, offeredCodes, figure, extra = {}) {
  const options = withCorrect(correctCode, offeredCodes);
  const unit = extra.unit ?? "°";
  return { type: "calcReason", prompt, figure, expected, correctCode, options, unit,
    answerLabel: extra.answerLabel ?? `${fmt(expected, extra.dp)}${unit} · ${REDES[correctCode].kort}`,
    ...extra };
}

/* formateer met komma */
export function fmt(n, dp = null) {
  const s = (dp == null) ? String(Math.round(n * 1e6) / 1e6) : Number(n).toFixed(dp);
  return s.replace(".", ",");
}

/* maak 'n stel unieke afleiers naby 'n korrekte getal */
export function nearDistractors(correct, count = 3, spread = 6) {
  const set = new Set();
  let guard = 0;
  while (set.size < count && guard++ < 100) {
    const d = correct + randInt(-spread, spread);
    if (d !== correct && d >= 0) set.add(d);
  }
  // vul aan as ons te min het
  let k = correct + 1;
  while (set.size < count) { if (k !== correct) set.add(k); k++; }
  return [...set];
}

/* n unieke afleiers (!= correct), eers uit candidates, dan opgevul */
export function distinct(correct, candidates, n = 3) {
  const out = [];
  for (const c of candidates) { if (c !== correct && !out.includes(c)) out.push(c); if (out.length >= n) break; }
  let k = correct + 1;
  while (out.length < n) { if (k !== correct && !out.includes(k)) out.push(k); k++; }
  return out;
}

/* wrap algebra in 'n <code> blokkie vir die prompt */
export function code(s) { return `<code>${s}</code>`; }
