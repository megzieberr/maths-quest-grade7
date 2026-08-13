/* ============================================================
   VERIFY-STELLINGS CORE — gedeel deur verify-stellings.mjs (node)
   en verify-stellings.html (blaaier). Geen DOM nodig nie: diagrams.js
   bou SVG as 'n STRING, so ons kan die string self ontleed en die
   geTEKENDE booghoeke teen die vraag se eie wiskunde MEET — nie
   afkyk nie (soos circle-geometry-game se verify-node.mjs).

   Elke ch6 gen() dra 'n onsigbare q._chk = { figKind, values,
   hideIndex, allShown } — sien js/quests/ch6-stellings.js se lêerkop
   vir die presiese vorm. "values" is die WERKLIKE hoeke wat in die
   figuur geteken is (die onbekende s'n INGESLUIT); hideIndex wys
   watter een as "?" gewys word (null as almal gewys word).
   ============================================================ */

/* vaste middelpunt (OX,OY) per figuur-soort — reguit uit diagrams.js.
   Net 'n FALLBACK: driehoek-gebaseerde figure (triAngles/gelykbenig/
   buitehoek) het 'n ANDER hoekpunt vir elke gemerkte hoek, so dié
   figKinds gebruik eerder die outo-opsporing hieronder (findCenter). */
export const CENTERS = {
  vertical: [130, 95],
  verticalAdjacent: [130, 95],
  straightLine: [130, 120],
  straightLine3: [130, 120],
  aroundPoint: [130, 115],
  triAngles: [110, 95],
  gelykbenig: [110, 90],
  buitehoek: [110, 90],
  angle: [48, 142],   // ch3-meetkunde.js se angleFigure (m2b/m5b/m6b Deel 2) — hoekpunt is OX,OY daar
};

function parsePolylines(svg) {
  const out = [];
  const re = /<polyline points="([^"]+)"[^>]*stroke="([^"]+)"/g;
  let m;
  while ((m = re.exec(svg))) {
    out.push({ pts: m[1].trim().split(/\s+/).map(p => p.split(",").map(Number)), stroke: m[2] });
  }
  return out;
}
function parseTexts(svg) {
  const out = [];
  const re = /<text x="([-\d.]+)" y="([-\d.]+)"[^>]*>([^<]*)<\/text>/g;
  let m;
  while ((m = re.exec(svg))) out.push({ x: Number(m[1]), y: Number(m[2]), text: m[3] });
  return out;
}
/* elke ch6-figuur teken 'n klein "hoekpunt"-kolletjie (<circle .../>) by
   elke plek waar 'n hoek gemeet word — een vir sirkel-tipe figure (die
   snypunt/middelpunt), EEN PER HOEKPUNT vir driehoek-tipe figure. Ons
   ontgin dit: vir elke geTEKENDE booghoek (of regtehoek-blokkie) soek
   ons die kolletjie waarvandaan sy TWEE eindpunte EWE VER is — dis sy
   werklike hoekpunt, ongeag hoeveel hoekpunte die figuur het. */
function parseDots(svg) {
  const out = [];
  const re = /<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)"/g;
  let m;
  while ((m = re.exec(svg))) { const r = Number(m[3]); if (r <= 8) out.push({ x: Number(m[1]), y: Number(m[2]) }); }
  return out;
}
function findCenter(poly, dots, fallback) {
  if (!dots.length || poly.pts.length < 2) return fallback;
  const [x0, y0] = poly.pts[0], [x1, y1] = poly.pts[poly.pts.length - 1];
  let best = fallback, bestScore = Infinity;
  dots.forEach(d => {
    const r0 = Math.hypot(x0 - d.x, y0 - d.y), r1 = Math.hypot(x1 - d.x, y1 - d.y);
    const score = Math.abs(r0 - r1) + Math.min(r0, r1) * 0.02;   // gelyke radius + naaste
    if (score < bestScore) { bestScore = score; best = [d.x, d.y]; }
  });
  return best;
}
function angleOf(cx, cy, x, y) {
  let d = Math.atan2(-(y - cy), x - cx) * 180 / Math.PI;
  if (d < 0) d += 360;
  return d;
}
/* arcPoly ALTYD teken 'n MONOTONIESE sweep van d0 vorentoe na d1 (nooit die
   "kort pad" nie) — so die span moet die VORENTOE-verskil wees, nie die
   kortste-tussen-twee-hoeke nie (anders lees 'n 220°-sektor as 140°). */
function circSpan(a0, a1) {
  return ((a1 - a0) % 360 + 360) % 360;
}

/* toets EEN vraag se figuur teen sy _chk-metadata.
   gee { issues: [string], stats: {diagrams,angleChecks,labelChecks,collisionChecks} } terug */
export function checkQuestion(label, q) {
  const issues = [];
  const stats = { diagrams: 0, angleChecks: 0, labelChecks: 0, collisionChecks: 0 };
  const chk = q && q._chk;
  if (!chk || !q.figure) return { issues, stats };
  stats.diagrams = 1;
  const svg = q.figure;
  const fallback = CENTERS[chk.figKind] || [130, 115];
  const dots = parseDots(svg);

  const polys = parsePolylines(svg);
  const texts = parseTexts(svg).filter(t => /^\d+°$|^\?$/.test(t.text.trim()));

  /* 1) elke geteken booghoek (polyline) moet by 'n DECLARED waarde pas —
     die middelpunt word per booghoek OUTOMATIES opgespoor (findCenter),
     so dit werk ewe goed vir 'n sirkel-tipe figuur (een middelpunt) as
     vir 'n driehoek-tipe figuur (elke hoekpunt sy EIE middelpunt). */
  const remaining = chk.values.slice();
  polys.forEach(p => {
    if (p.pts.length < 2) return;
    const [cx, cy] = findCenter(p, dots, fallback);
    const [x0, y0] = p.pts[0], [x1, y1] = p.pts[p.pts.length - 1];
    const span = circSpan(angleOf(cx, cy, x0, y0), angleOf(cx, cy, x1, y1));
    stats.angleChecks++;
    let bestI = -1, bestD = Infinity;
    remaining.forEach((v, i) => { const d = Math.abs(v - span); if (d < bestD) { bestD = d; bestI = i; } });
    if (bestI === -1 || bestD > 0.6) {
      issues.push(`${label}: 'n geteken boog van ${span.toFixed(2)}° pas by GEEN verwagte waarde in [${chk.values.join(", ")}] nie`);
    } else {
      remaining.splice(bestI, 1);
    }
  });

  /* 2) "die gevraagde hoek se waarde word nooit op die figuur gewys nie" —
     oorgeslaan wanneer allShown (intro-rondtes / R2 se "waarde is reeds gegee") */
  if (chk.allShown) {
    if (texts.some(t => t.text.trim() === "?")) {
      issues.push(`${label}: hierdie vraag moet ALMAL waardes wys, maar 'n "?" is gevind`);
    }
  } else if (chk.hideIndex != null) {
    if (!texts.some(t => t.text.trim() === "?")) {
      issues.push(`${label}: die gevraagde hoek moet as "?" gewys word, geen "?" gevind nie`);
    }
  }

  /* 3) etiket-afstand van sy EIE naaste hoekpunt af (rowwe venster — vang
     los/vasgedrukte etikette) + botsings tussen ENIGE twee etikette */
  const withPos = texts.map(t => {
    let best = fallback, bestD = Infinity;
    dots.forEach(d => { const dd = Math.hypot(t.x - d.x, t.y - d.y); if (dd < bestD) { bestD = dd; best = [d.x, d.y]; } });
    return { ...t, dist: dots.length ? bestD : Math.hypot(t.x - fallback[0], t.y - fallback[1]) };
  });
  withPos.forEach(t => {
    stats.labelChecks++;
    if (t.dist < 18 || t.dist > 90) {
      issues.push(`${label}: etiket "${t.text}" is ${t.dist.toFixed(1)}px van die hoekpunt af (buite 18-90px)`);
    }
  });
  for (let i = 0; i < withPos.length; i++) {
    for (let j = i + 1; j < withPos.length; j++) {
      stats.collisionChecks++;
      const d = Math.hypot(withPos[i].x - withPos[j].x, withPos[i].y - withPos[j].y);
      if (d < 18) {
        issues.push(`${label}: etikette "${withPos[i].text}" & "${withPos[j].text}" is net ${d.toFixed(1)}px uitmekaar`);
      }
    }
  }

  /* 4) inhoud-hoekreeks (haar 2026-08-10 ruling, bindend op alle sessies):
     ELKE gemerkte hoek moet ≥25° wees; 'n gelykbenige tophoek moet
     30°–120° wees. Dié is HARDE wanpassings, nes 'n verkeerde hoek. */
  (chk.values || []).forEach(v => {
    if (v < 25) issues.push(`${label}: gemerkte hoek ${v}° is < 25° (buite die toegelate inhoud-reeks)`);
  });
  if (chk.apex != null && (chk.apex < 30 || chk.apex > 120)) {
    issues.push(`${label}: gelykbenige tophoek ${chk.apex}° is buite 30°–120°`);
  }

  return { issues, stats };
}

/* loop elke rondte se skills N keer en akkumuleer */
export function runSuite(CH6, rounds, tries = 15) {
  let diagrams = 0, angleChecks = 0, labelChecks = 0, collisionChecks = 0;
  const fails = [];
  const perRound = {};
  for (const id of rounds) {
    const def = CH6[id];
    if (!def) { fails.push(`${id}: ontbreek in die CH6-register`); continue; }
    perRound[id] = { diagrams: 0, fails: 0 };
    def.skills.forEach((skill, si) => {
      for (let t = 0; t < tries; t++) {
        const q = skill.gen();
        const { issues, stats } = checkQuestion(`${id} skill${si + 1} probeer${t + 1}`, q);
        diagrams += stats.diagrams; angleChecks += stats.angleChecks;
        labelChecks += stats.labelChecks; collisionChecks += stats.collisionChecks;
        perRound[id].diagrams += stats.diagrams;
        if (issues.length) { perRound[id].fails += issues.length; fails.push(...issues); }
      }
    });
  }
  return { diagrams, angleChecks, labelChecks, collisionChecks, fails, perRound };
}
