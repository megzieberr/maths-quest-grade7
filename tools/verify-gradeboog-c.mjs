/* ============================================================
   VERIFY — m1c "Lees die gradeboog — ander kant" (baseSide:"left")
   ------------------------------------------------------------
   Trig-checks renderProtractor's flipped variant (node, no browser):
     (a) moving-arm endpoint sits at angle 180−θ on the arc
     (b) base-arm endpoint sits at 180°
     (c) the sector path's two arc endpoints match those angles
     (d) the outer-row label nearest arm A (position 180) reads "0"
   Also asserts the default variant still puts arm A at 0°.
   ============================================================ */
import { renderProtractor } from "../js/engine/protractor.js";

const VX = 188, VY = 190;
const rad = d => d * Math.PI / 180;
const px = (a, r) => VX + r * Math.cos(rad(a));
const py = (a, r) => VY - r * Math.sin(rad(a));
const close = (a, b, eps = 0.05) => Math.abs(a - b) < eps;

let fails = 0;
const fail = (msg) => { fails++; console.log("FAIL:", msg); };

// pull all <line> arm endpoints (x2,y2) from the svg — arms are the two
// stroke="<accent>" lines with marker-end="url(#ph)"
function armEndpoints(svg, accent) {
  const re = new RegExp(`<line x1="[^"]*" y1="[^"]*" x2="([^"]*)" y2="([^"]*)" stroke="${accent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" stroke-width="3\\.6"[^>]*marker-end="url\\(#ph\\)"`, "g");
  const pts = [];
  let m;
  while ((m = re.exec(svg))) pts.push([parseFloat(m[1]), parseFloat(m[2])]);
  return pts;
}

// pull the sector <path> d= attribute
function sectorPath(svg, accent) {
  const re = new RegExp(`<path d="([^"]*)" fill="${accent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" fill-opacity="0\\.18"`);
  const m = re.exec(svg);
  return m ? m[1] : null;
}

const ACCENT = "#0d9488";
const armLen = 178; // R(162) + 16

// --- default variant (baseSide "right") still puts arm A at 0° ---
{
  const svg = renderProtractor(60, { accent: ACCENT });
  const pts = armEndpoints(svg, ACCENT);
  if (pts.length !== 2) fail(`default 60°: expected 2 arm endpoints, got ${pts.length}`);
  else {
    const expA = [px(0, armLen), py(0, armLen)];
    const okA = pts.some(p => close(p[0], expA[0], 0.5) && close(p[1], expA[1], 0.5));
    if (!okA) fail(`default 60°: no arm endpoint near arm A (0°) — got ${JSON.stringify(pts)} vs expected ${JSON.stringify(expA)}`);
  }
}

// --- flipped variant (baseSide "left") ---
const angles = [];
for (let a = 15; a <= 165; a += 5) angles.push(a);
angles.push(90);

for (const theta of angles) {
  const svg = renderProtractor(theta, { accent: ACCENT, baseSide: "left" });

  // (a)+(b) arm endpoints at 180 (A) and 180-theta (B)
  const pts = armEndpoints(svg, ACCENT);
  if (pts.length !== 2) { fail(`θ=${theta}: expected 2 arm endpoints, got ${pts.length}`); continue; }
  const expA = [px(180, armLen), py(180, armLen)];
  const expB = [px(180 - theta, armLen), py(180 - theta, armLen)];
  const hasA = pts.some(p => close(p[0], expA[0], 0.5) && close(p[1], expA[1], 0.5));
  const hasB = pts.some(p => close(p[0], expB[0], 0.5) && close(p[1], expB[1], 0.5));
  if (!hasA) fail(`θ=${theta}: no arm endpoint at base arm A (180°) — got ${JSON.stringify(pts)}`);
  if (!hasB) fail(`θ=${theta}: no arm endpoint at moving arm B (180−θ=${180 - theta}°) — got ${JSON.stringify(pts)}`);

  // (c) sector path's two arc endpoints (radius 44) match 180 and 180-theta
  const sr = 44;
  const d = sectorPath(svg, ACCENT);
  if (!d) { fail(`θ=${theta}: sector path not found`); continue; }
  const nums = d.match(/-?\d+\.?\d*/g).map(Number);
  // path: M VX VY L x1 y1 A sr sr 0 0 0 x2 y2 Z  -> nums: [VX,VY, x1,y1, sr,sr,0,0,0, x2,y2]
  const [, , x1, y1, , , , , , x2, y2] = nums;
  const loAngle = Math.min(180, 180 - theta), hiAngle = Math.max(180, 180 - theta);
  const expLo = [px(loAngle, sr), py(loAngle, sr)];
  const expHi = [px(hiAngle, sr), py(hiAngle, sr)];
  if (!(close(x1, expLo[0], 0.5) && close(y1, expLo[1], 0.5)))
    fail(`θ=${theta}: sector start (${x1},${y1}) != expected lo-angle point ${JSON.stringify(expLo)}`);
  if (!(close(x2, expHi[0], 0.5) && close(y2, expHi[1], 0.5)))
    fail(`θ=${theta}: sector end (${x2},${y2}) != expected hi-angle point ${JSON.stringify(expHi)}`);

  // (d) outer-row label nearest arm A (position 180) reads "0"
  // numsOuter text is placed at angle a with value (180-a); at a=180, value = 0
  const outerAt180Re = /<text x="([^"]*)" y="([^"]*)" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="11\.5" font-weight="600" fill="#39555f">(-?\d+)<\/text>/g;
  let mm, found = null;
  const ro = 162 - 25;
  const expOuterPt = [px(180, ro), py(180, ro) + 4];
  while ((mm = outerAt180Re.exec(svg))) {
    const x = parseFloat(mm[1]), y = parseFloat(mm[2]);
    if (close(x, expOuterPt[0], 0.5) && close(y, expOuterPt[1], 0.5)) { found = mm[3]; break; }
  }
  if (found !== "0") fail(`θ=${theta}: outer-row label nearest arm A (180°) should read "0", found ${JSON.stringify(found)}`);
}

console.log(`\nChecked ${angles.length} angles (flipped) + 1 default-path check.`);
if (fails === 0) {
  console.log("PASS: 0 failures.");
  process.exit(0);
} else {
  console.log(`FAILED: ${fails} failure(s).`);
  process.exit(1);
}
