/* ============================================================
   ANTWOORD-KONTROLE + SA getalformaat
   ------------------------------------------------------------
   Desimale KOMMA oral. 'n Getikte antwoord is reg as dit gelyk
   is aan die verwagte waarde, afgerond na die vraag se desimale
   plekke, binne 'n klein toleransie (sodat 'n wettige afronding
   nooit faal nie, en 8,5 === 8,50).
   ============================================================ */
import { TOL } from "./config.js";

/* "8,5" of "8.5" -> 8.5 ; "" / "-" / "," -> NaN */
export function parseNum(str) {
  if (str == null) return NaN;
  const cleaned = String(str).trim().replace(",", ".");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/* formateer 'n getal met 'n komma; dp = vaste desimale plekke (opsioneel) */
export function fmtComma(n, dp = null) {
  if (n == null || Number.isNaN(n)) return "";
  const s = (dp == null) ? String(Math.round(n * 1e6) / 1e6) : Number(n).toFixed(dp);
  return s.replace(".", ",");
}

/* rond af na dp desimale plekke (half weg van nul — die skoolkonvensie) */
export function roundTo(n, dp = 0) {
  const f = Math.pow(10, dp);
  return Math.sign(n) * Math.round(Math.abs(n) * f) / f;
}

/* Is 'n getikte antwoord reg?
   q.dp  = desimale plekke (verstek 0)
   q.tol = absolute toleransieband (verstek: klein epsilon, of graphRead vir afleeswaardes). */
export function answerCorrect(given, expected, q = {}) {
  if (!Number.isFinite(given)) return false;
  const dp = q.dp ?? 0;
  const tol = (q.tol != null) ? q.tol : TOL.calcEps;
  const g = roundTo(given, dp), e = roundTo(expected, dp);
  return Math.abs(g - e) <= tol + 1e-9;
}
