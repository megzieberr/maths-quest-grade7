/* ============================================================
   GRADEBOOG (protractor) — akkurate SVG met DUBBELE skaal
   ------------------------------------------------------------
   Soos 'n regte gradeboog: TWEE rye getalle.
     • Buitenste ry: 0 (links) → 180 (regs)   = 180 − a
     • Binnenste ry: 0 (regs)  → 180 (links)  = a
   Arm A lê op die 0-lyn (regs). Omdat die basislyn na REGS wys,
   lees die leerder die BINNESTE ry → die antwoord = theta.
   Merke elke 1° (langer by 5° en 10°). Alles trig-bereken (op skaal).
   ============================================================ */
const VW = 376, VH = 226;
const VX = 188, VY = 190;     // hoekpunt (vertex)
const R = 162;                // buite-radius van die skaal

const rad = d => d * Math.PI / 180;
const px = (a, r) => VX + r * Math.cos(rad(a));
const py = (a, r) => VY - r * Math.sin(rad(a));
const f = n => Math.round(n * 100) / 100;

export function renderProtractor(theta, opts = {}) {
  const accent = opts.accent || "#0d9488";

  // skaal-merke: elke 2° kort, 5° medium, 10° lank (arm land altyd op 'n 5°-merk)
  let ticks = "";
  for (let a = 0; a <= 180; a++) {
    if (a % 2 !== 0 && a % 5 !== 0) continue;          // hou dit lig: net ewe grade + veelvoude van 5
    const big = a % 10 === 0, med = a % 5 === 0;
    const len = big ? 15 : med ? 10 : 6;
    const w = big ? 1.4 : (med ? 1.1 : 0.8);
    ticks += `<line x1="${f(px(a, R))}" y1="${f(py(a, R))}" x2="${f(px(a, R - len))}" y2="${f(py(a, R - len))}" stroke="#8da6b0" stroke-width="${w}"/>`;
  }

  // DUBBELE getalreeks (elke 10°)
  let numsOuter = "", numsInner = "";
  for (let a = 0; a <= 180; a += 10) {
    const ro = R - 25, ri = R - 41;
    numsOuter += `<text x="${f(px(a, ro))}" y="${f(py(a, ro)) + 4}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="11.5" font-weight="600" fill="#39555f">${180 - a}</text>`;
    numsInner += `<text x="${f(px(a, ri))}" y="${f(py(a, ri)) + 3}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="9" font-weight="600" fill="#85a2ac">${a}</text>`;
  }

  // gekleurde sektor naby die hoekpunt, tussen 0° en theta
  const sr = 44;
  const sector = `<path d="M ${VX} ${VY} L ${f(px(0, sr))} ${f(py(0, sr))} A ${sr} ${sr} 0 0 0 ${f(px(theta, sr))} ${f(py(theta, sr))} Z" fill="${accent}" fill-opacity="0.18"/>`;

  // arms: vas op 0° (regs), beweeg op theta — met pyltjies
  const armLen = R + 16;
  const arm = (a) => `<line x1="${VX}" y1="${VY}" x2="${f(px(a, armLen))}" y2="${f(py(a, armLen))}" stroke="${accent}" stroke-width="3.6" stroke-linecap="round" marker-end="url(#ph)"/>`;

  // letters by die arm-punte en die hoekpunt
  const lblA = `<text x="${f(px(0, armLen) - 2)}" y="${f(py(0, armLen)) - 10}" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="15" font-weight="600" fill="${accent}">A</text>`;
  const lblB = `<text x="${f(px(theta, armLen + 9))}" y="${f(py(theta, armLen + 9))}" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="15" font-weight="600" fill="${accent}">B</text>`;
  const lblO = `<text x="${VX}" y="${VY + 18}" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="14" font-weight="600" fill="#5b6f76">O</text>`;

  return `<svg viewBox="0 0 ${VW} ${VH}" width="100%" style="max-width:344px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gradeboog met dubbele skaal en 'n hoek om te meet">
    <defs><marker id="ph" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="${accent}"/></marker></defs>
    <path d="M ${f(px(180, R))} ${VY} A ${R} ${R} 0 0 1 ${f(px(0, R))} ${VY} Z" fill="#eef4fb" stroke="#b9c9d6" stroke-width="1.4"/>
    <line x1="${f(px(180, R))}" y1="${VY}" x2="${f(px(0, R))}" y2="${VY}" stroke="#b9c9d6" stroke-width="1.4"/>
    ${ticks}${numsOuter}${numsInner}${sector}${arm(0)}${arm(theta)}
    <circle cx="${VX}" cy="${VY}" r="4.5" fill="#fff" stroke="${accent}" stroke-width="2"/>
    ${lblA}${lblB}${lblO}
  </svg>`;
}

/* hoektipe-naam vir 'n gegewe grade-waarde (vir terugvoer/redes) */
export function angleType(deg) {
  if (deg === 90) return "regtehoek";
  if (deg === 180) return "gestrekte hoek";
  if (deg < 90) return "skerphoek";
  if (deg < 180) return "stomphoek";
  if (deg < 360) return "inspringende hoek";
  return "omwenteling";
}
