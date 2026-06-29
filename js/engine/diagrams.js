/* ============================================================
   DIAGRAM-ENJIN — sirkeldele + transformasies (akkurate SVG)
   ------------------------------------------------------------
   Soos Circle Quest: wys 'n prentjie en laat die leerder dit lees.
   Alle meetkunde word presies bereken sodat dit "op skaal" is.
   ============================================================ */
const f = n => Math.round(n * 100) / 100;

/* ===================== SIRKELDELE ===================== */
const CW = 270, CH = 220, CX = 135, CY = 110, CR = 84;
const crad = d => d * Math.PI / 180;
const cpt = a => [f(CX + CR * Math.cos(crad(a))), f(CY - CR * Math.sin(crad(a)))];

export function circleFigure(part, accent = "#0d9488") {
  const base = `<circle cx="${CX}" cy="${CY}" r="${CR}" fill="#eef4fb" stroke="#c2d2d6" stroke-width="2"/>`;
  const dot = (x, y, r = 4.5, fill = accent) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const lineA = (p1, p2, w = 3.6) => `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${accent}" stroke-width="${w}" stroke-linecap="round"/>`;
  let hi = "";

  if (part === "omtrek") {
    hi = `<circle cx="${CX}" cy="${CY}" r="${CR}" fill="none" stroke="${accent}" stroke-width="5"/>`;
  } else if (part === "middelpunt") {
    hi = dot(CX, CY, 7);
  } else if (part === "radius") {
    hi = lineA([CX, CY], cpt(45)) + dot(CX, CY, 4);
  } else if (part === "middellyn") {
    hi = lineA(cpt(205), cpt(25)) + dot(CX, CY, 4);
  } else if (part === "koord") {
    hi = lineA(cpt(210), cpt(330));
  } else if (part === "sektor") {
    const a = cpt(55), b = cpt(125);
    hi = `<path d="M ${CX} ${CY} L ${a[0]} ${a[1]} A ${CR} ${CR} 0 0 0 ${b[0]} ${b[1]} Z" fill="${accent}" fill-opacity="0.32" stroke="${accent}" stroke-width="2.5"/>`;
  } else if (part === "boog") {
    const a = cpt(40), b = cpt(140);
    hi = `<path d="M ${a[0]} ${a[1]} A ${CR} ${CR} 0 0 0 ${b[0]} ${b[1]}" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`;
  } else if (part === "segment") {
    const a = cpt(320), b = cpt(220);
    hi = `<path d="M ${a[0]} ${a[1]} A ${CR} ${CR} 0 0 1 ${b[0]} ${b[1]} Z" fill="${accent}" fill-opacity="0.32" stroke="${accent}" stroke-width="2.5"/>`;
  }
  return `<svg viewBox="0 0 ${CW} ${CH}" width="100%" style="max-width:260px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sirkel met 'n gemerkte deel">${base}${hi}</svg>`;
}

/* ===================== ROOSTER (transformasies) ===================== */
const S = 19, OX = 152, OY = 150, RANGE = 6;
const VWG = 304, VHG = 300;
const gpx = (x, y) => [f(OX + x * S), f(OY - y * S)];

function gridBg(showNums = true) {
  let g = "";
  for (let i = -RANGE; i <= RANGE; i++) {
    g += `<line x1="${OX + i * S}" y1="${OY - RANGE * S}" x2="${OX + i * S}" y2="${OY + RANGE * S}" stroke="#e6ecf5" stroke-width="1"/>`;
    g += `<line x1="${OX - RANGE * S}" y1="${OY - i * S}" x2="${OX + RANGE * S}" y2="${OY - i * S}" stroke="#e6ecf5" stroke-width="1"/>`;
  }
  g += `<line x1="${OX - RANGE * S}" y1="${OY}" x2="${OX + RANGE * S}" y2="${OY}" stroke="#9aa7bd" stroke-width="1.6"/>`;
  g += `<line x1="${OX}" y1="${OY - RANGE * S}" x2="${OX}" y2="${OY + RANGE * S}" stroke="#9aa7bd" stroke-width="1.6"/>`;
  if (showNums) {
    for (const n of [-6, -4, -2, 2, 4, 6]) {
      g += `<text x="${OX + n * S}" y="${OY + 13}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="9" fill="#9aa7bd">${n}</text>`;
      g += `<text x="${OX - 9}" y="${OY - n * S + 3}" text-anchor="end" font-family="Baloo 2, sans-serif" font-size="9" fill="#9aa7bd">${n}</text>`;
    }
  }
  return g;
}
const svgGrid = inner => `<svg viewBox="0 0 ${VWG} ${VHG}" width="100%" style="max-width:300px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rooster-diagram">${inner}</svg>`;

/* die basis-vorm: 'n asimmetriese "L" (so refleksie/rotasie verskil duidelik) */
const BASE_L = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]];
const TF = {
  translate: (p, dx, dy) => p.map(([x, y]) => [x + dx, y + dy]),
  reflectX:  p => p.map(([x, y]) => [x, -y]),     // om die x-as
  reflectY:  p => p.map(([x, y]) => [-x, y]),     // om die y-as
  rot180:    p => p.map(([x, y]) => [-x, -y]),
  rot90:     p => p.map(([x, y]) => [-y, x]),     // teen die kloksrigting
  rot270:    p => p.map(([x, y]) => [y, -x]),     // kloksgewys
};
const polySvg = (pts, attrs) => `<polygon points="${pts.map(([x, y]) => gpx(x, y).join(",")).join(" ")}" ${attrs}/>`;
const centroidPx = pts => { const n = pts.length; let sx = 0, sy = 0; pts.forEach(([x, y]) => { const [px, py] = gpx(x, y); sx += px; sy += py; }); return [f(sx / n), f(sy / n)]; };

/* twee vorms (oorspronklik + beeld) op die rooster */
function twoShapeFigure(baseShape, imageShape, accent, { axis, labelB = "A′", showO = false } = {}) {
  let axisLine = "";
  if (axis === "x") axisLine = `<line x1="${OX - RANGE * S}" y1="${OY}" x2="${OX + RANGE * S}" y2="${OY}" stroke="${accent}" stroke-width="2.4" stroke-dasharray="6 5"/>`;
  if (axis === "y") axisLine = `<line x1="${OX}" y1="${OY - RANGE * S}" x2="${OX}" y2="${OY + RANGE * S}" stroke="${accent}" stroke-width="2.4" stroke-dasharray="6 5"/>`;
  const o = showO ? `<circle cx="${OX}" cy="${OY}" r="4" fill="#5b6f76"/><text x="${OX - 8}" y="${OY + 14}" font-family="Fredoka, sans-serif" font-size="12" fill="#5b6f76">O</text>` : "";
  const cA = centroidPx(baseShape), cB = centroidPx(imageShape);
  const lbl = (c, t, fill) => `<text x="${c[0]}" y="${c[1] + 4}" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="13" font-weight="600" fill="${fill}">${t}</text>`;
  return svgGrid(
    gridBg() + axisLine + o +
    polySvg(baseShape, `fill="${accent}" fill-opacity="0.20" stroke="${accent}" stroke-width="2.6" stroke-linejoin="round"`) +
    polySvg(imageShape, `fill="none" stroke="${accent}" stroke-width="2.6" stroke-dasharray="5 4" stroke-linejoin="round"`) +
    lbl(cA, "A", accent) + lbl(cB, labelB, accent)
  );
}

/* t1 — benoem: wys A en sy beeld; die generator weet die tipe */
export function transformFigure(kind, accent = "#db2777") {
  const start = TF.translate(BASE_L, 1, 1);    // basis effens van die oorsprong af
  let image, axis = null, showO = false;
  if (kind === "translate") { const [dx, dy] = [[2, -3], [-3, 2], [3, 1], [-4, -2]][Math.floor((start[0][0] * 7 + 3) % 4)]; image = TF.translate(start, dx, dy); }
  else if (kind === "reflectY") { image = TF.reflectY(start); axis = "y"; }
  else if (kind === "reflectX") { image = TF.reflectX(start); axis = "x"; }
  else if (kind === "rotate") { image = TF.rot180(start); showO = true; }
  return twoShapeFigure(start, image, accent, { axis, showO });
}

/* t3 — refleksie-as of rotasie-hoek (wys die diagram + die nodige merker) */
export function reflectFigure(axis, accent = "#db2777") {     // axis: "x" | "y"
  const start = TF.translate(BASE_L, axis === "x" ? 1 : 1, axis === "x" ? 1 : 1);
  const image = axis === "x" ? TF.reflectX(start) : TF.reflectY(start);
  return twoShapeFigure(start, image, accent, { axis, labelB: "A′" });
}
export function rotateFigure(deg, accent = "#db2777") {        // deg: 90 | 180 | 270
  const start = TF.translate(BASE_L, 1, 1);
  const image = deg === 180 ? TF.rot180(start) : deg === 90 ? TF.rot90(start) : TF.rot270(start);
  return twoShapeFigure(start, image, accent, { showO: true });
}

/* t2 — translasie: wys NET punt A (die leerder bereken die beeld) */
export function pointFigure(x, y, accent = "#db2777") {
  const [px, py] = gpx(x, y);
  const dot = `<circle cx="${px}" cy="${py}" r="5.5" fill="${accent}"/>`;
  const lbl = `<text x="${px + 9}" y="${py - 8}" font-family="Fredoka, sans-serif" font-size="14" font-weight="600" fill="${accent}">A (${x} ; ${y})</text>`;
  return svgGrid(gridBg() + dot + lbl);
}

/* t4 — simmetrie: wys die vorm (sonder die lyne) */
const SHCX = 135, SHCY = 105, SHR = 70;
function regPoly(n, startDeg) {
  const pts = [];
  for (let k = 0; k < n; k++) { const a = startDeg + k * 360 / n; pts.push([f(SHCX + SHR * Math.cos(crad(a))), f(SHCY - SHR * Math.sin(crad(a)))]); }
  return pts;
}
export function shapeFigure(shapeKey, accent = "#db2777") {
  let pts;
  if (shapeKey === "vierkant") pts = regPoly(4, 45);
  else if (shapeKey === "gelyksydige driehoek") pts = regPoly(3, 90);
  else if (shapeKey === "reëlmatige vyfhoek") pts = regPoly(5, 90);
  else if (shapeKey === "reëlmatige seshoek") pts = regPoly(6, 90);
  else if (shapeKey === "reghoek") pts = [[SHCX - 82, SHCY - 48], [SHCX + 82, SHCY - 48], [SHCX + 82, SHCY + 48], [SHCX - 82, SHCY + 48]];
  else pts = regPoly(4, 45);
  const poly = `<polygon points="${pts.map(p => p.join(",")).join(" ")}" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="2.8" stroke-linejoin="round"/>`;
  return `<svg viewBox="0 0 270 210" width="100%" style="max-width:250px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'n Vorm">${poly}</svg>`;
}

/* t5 — vergroting: twee vierkante (oud → nuut) vir die skaalfaktor */
export function enlargeFigure(oldSide, newSide, accent = "#db2777") {
  const maxPx = 96, k = maxPx / Math.max(oldSide, newSide);
  const a = f(oldSide * k), b = f(newSide * k);
  const y0 = 150;
  const sq = (x, side, val) => `<rect x="${x}" y="${y0 - side}" width="${side}" height="${side}" rx="4" fill="${accent}" fill-opacity="0.16" stroke="${accent}" stroke-width="2.6"/>`
    + `<text x="${x + side / 2}" y="${y0 + 18}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="13" font-weight="600" fill="${accent}">${val}</text>`;
  const arrow = `<text x="150" y="${y0 - 18}" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="20" fill="#9aa7bd">→</text>`;
  return `<svg viewBox="0 0 300 180" width="100%" style="max-width:280px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vergroting van 'n vierkant">${sq(24, a, oldSide)}${arrow}${sq(300 - 24 - b, b, newSide)}</svg>`;
}

/* ============================================================
   MEETKUNDE-DIAGRAMME (ch3) + 2D-VORM-DIAGRAMME (ch4)
   ------------------------------------------------------------
   Akkurate, op-skaal SVG. Hoeke word werklik teen die regte
   grootte geteken sodat 'n leerder visueel kan klassifiseer.
   ============================================================ */
const INK = "#52606d";
const rd = d => d * Math.PI / 180;
const txt = (p, s, col, size = 14) => `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="${size}" fill="${col}">${s}</text>`;
const svgWrap = (inner, vb, max = 250, label = "Meetkunde-diagram") =>
  `<svg viewBox="${vb}" width="100%" style="max-width:${max}px" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${inner}</svg>`;
/* pylpunt by (x,y) wat in rigting `ang` grade wys (skermkoördinate, y-af) */
function arrowHead(x, y, ang, col, size = 8) {
  const a = rd(ang);
  const b1 = [f(x - size * Math.cos(a - 0.45)), f(y - size * Math.sin(a - 0.45))];
  const b2 = [f(x - size * Math.cos(a + 0.45)), f(y - size * Math.sin(a + 0.45))];
  return `<polygon points="${f(x)},${f(y)} ${b1.join(",")} ${b2.join(",")}" fill="${col}"/>`;
}
/* boog (as polilyn) van d0 tot d1 grade, radius r, om (cx,cy) — y-af stelsel */
function arcPoly(cx, cy, r, d0, d1, col, w = 2.6) {
  const steps = Math.max(6, Math.round(Math.abs(d1 - d0) / 5));
  const pts = [];
  for (let i = 0; i <= steps; i++) { const d = d0 + (d1 - d0) * i / steps; pts.push(`${f(cx + r * Math.cos(rd(d)))},${f(cy - r * Math.sin(rd(d)))}`); }
  return `<polyline points="${pts.join(" ")}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
}

/* ---------- m2/m3: enkele hoek (klassifiseer) ---------- */
export function angleFigure(deg, accent = "#0d9488", opt = {}) {
  const OX = 48, OY = 142, L = 152;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const a0 = arm(0, L), aB = arm(deg, L);
  const armLine = p => `<line x1="${OX}" y1="${OY}" x2="${p[0]}" y2="${p[1]}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`;
  let mark;
  if (deg === 90) {
    const p1 = arm(0, 24), pc = arm(45, 24 * 1.414), p2 = arm(90, 24);
    mark = `<polyline points="${p1.join(",")} ${pc.join(",")} ${p2.join(",")}" fill="none" stroke="${accent}" stroke-width="2.6"/>`;
  } else {
    mark = arcPoly(OX, OY, Math.min(34, L * 0.28), 0, deg, accent, 2.8);
  }
  const lbl = opt.label != null ? txt(arm(deg / 2, 52), opt.label, accent, 14) : "";
  return svgWrap(`${armLine(a0)}${armLine(aB)}${mark}<circle cx="${OX}" cy="${OY}" r="4.5" fill="${INK}"/>${lbl}`,
    "0 0 252 168", 250, "'n Hoek");
}

/* ---------- m6/m7: hoeke op 'n reguitlyn (som = 180°) ---------- */
export function straightLineFigure(givenDeg, accent = "#0d9488") {
  const OX = 130, OY = 120, L = 112;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const base = `<line x1="${OX - L}" y1="${OY}" x2="${OX + L}" y2="${OY}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`
    + arrowHead(OX - L, OY, 180, INK) + arrowHead(OX + L, OY, 0, INK);
  const ray = arm(givenDeg, L);
  const rayLine = `<line x1="${OX}" y1="${OY}" x2="${ray[0]}" y2="${ray[1]}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
  const givenArc = arcPoly(OX, OY, 30, 0, givenDeg, accent);
  const askArc = arcPoly(OX, OY, 30, givenDeg, 180, "#f59e0b");
  const givenLbl = txt(arm(givenDeg / 2, 48), `${givenDeg}°`, accent, 13);
  const askLbl = txt(arm((givenDeg + 180) / 2, 48), "?", "#d97706", 16);
  return svgWrap(`${base}${rayLine}${givenArc}${askArc}${givenLbl}${askLbl}<circle cx="${OX}" cy="${OY}" r="4" fill="${INK}"/>`,
    "0 0 260 150", 260, "Hoeke op 'n reguitlyn");
}

/* ---------- m8: hoeke rondom 'n punt (3 strale, som = 360°) ---------- */
export function aroundPointFigure(a, b, accent = "#0d9488") {
  const OX = 130, OY = 115, L = 95;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const rays = [0, a, a + b];
  const lines = rays.map(d => { const p = arm(d, L); return `<line x1="${OX}" y1="${OY}" x2="${p[0]}" y2="${p[1]}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` + arrowHead(p[0], p[1], d < 90 || d > 270 ? 0 : 180, INK, 7); }).join("");
  const arcA = arcPoly(OX, OY, 30, 0, a, accent) + txt(arm(a / 2, 46), `${a}°`, accent, 13);
  const arcB = arcPoly(OX, OY, 38, a, a + b, "#2563eb") + txt(arm(a + b / 2, 54), `${b}°`, "#2563eb", 13);
  const arcC = arcPoly(OX, OY, 30, a + b, 360, "#f59e0b") + txt(arm((a + b + 360) / 2, 46), "?", "#d97706", 16);
  return svgWrap(`${lines}${arcA}${arcB}${arcC}<circle cx="${OX}" cy="${OY}" r="4" fill="${INK}"/>`,
    "0 0 260 200", 250, "Hoeke rondom 'n punt");
}

/* ---------- m9: regoorstaande (vertikaal-teenoorgestelde) hoeke ---------- */
export function verticalFigure(known, accent = "#0d9488") {
  const OX = 130, OY = 95, L = 105;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const line = d => { const p1 = arm(d, L), p2 = arm(d + 180, L); return `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`; };
  const givenArc = arcPoly(OX, OY, 26, 0, known, accent) + txt(arm(known / 2, 42), `${known}°`, accent, 13);
  const askArc = arcPoly(OX, OY, 26, 180, 180 + known, "#f59e0b") + txt(arm(180 + known / 2, 42), "?", "#d97706", 16);
  return svgWrap(`${line(0)}${line(known)}${givenArc}${askArc}<circle cx="${OX}" cy="${OY}" r="4" fill="${INK}"/>`,
    "0 0 260 190", 250, "Regoorstaande hoeke");
}

/* ---------- m3/m4: lyne & notasie ---------- */
export function lineFigure(kind, accent = "#0d9488") {
  const tick = (x, y, ang) => { const a = rd(ang + 90); const dx = 6 * Math.cos(a), dy = 6 * Math.sin(a); return `<line x1="${f(x - dx)}" y1="${f(y - dy)}" x2="${f(x + dx)}" y2="${f(y + dy)}" stroke="${accent}" stroke-width="2.4"/>`; };
  let inner = "";
  if (kind === "punt") {
    inner = `<circle cx="120" cy="92" r="7.5" fill="${accent}"/>`
      + `<text x="136" y="85" font-family="Fredoka, sans-serif" font-size="19" font-weight="700" fill="${INK}">A</text>`;
  } else if (kind === "ewewydig") {
    inner = [60, 110].map(y => `<line x1="24" y1="${y}" x2="236" y2="${y}" stroke="${INK}" stroke-width="3"/>` + arrowHead(24, y, 180, INK) + arrowHead(236, y, 0, INK) + `<text x="150" y="${y - 8}" text-anchor="middle" fill="${accent}" font-size="15" font-weight="700">›</text>`).join("");
  } else if (kind === "loodreg") {
    inner = `<line x1="40" y1="90" x2="220" y2="90" stroke="${INK}" stroke-width="3"/>` + arrowHead(40, 90, 180, INK) + arrowHead(220, 90, 0, INK)
      + `<line x1="130" y1="20" x2="130" y2="160" stroke="${INK}" stroke-width="3"/>` + arrowHead(130, 20, 270, INK) + arrowHead(130, 160, 90, INK)
      + `<rect x="130" y="74" width="16" height="16" fill="none" stroke="${accent}" stroke-width="2.2"/>`;
  } else if (kind === "snylyne") {
    inner = `<line x1="34" y1="40" x2="226" y2="150" stroke="${INK}" stroke-width="3"/>` + `<line x1="34" y1="150" x2="226" y2="40" stroke="${INK}" stroke-width="3"/>`;
  } else if (kind === "straal") {
    inner = `<line x1="50" y1="95" x2="226" y2="95" stroke="${INK}" stroke-width="3"/>` + arrowHead(226, 95, 0, INK) + `<circle cx="50" cy="95" r="5" fill="${accent}"/>`;
  } else if (kind === "lynsegment") {
    inner = `<line x1="50" y1="95" x2="210" y2="95" stroke="${INK}" stroke-width="3"/>` + `<circle cx="50" cy="95" r="5" fill="${accent}"/><circle cx="210" cy="95" r="5" fill="${accent}"/>`;
  } else { /* lyn */
    inner = `<line x1="30" y1="95" x2="230" y2="95" stroke="${INK}" stroke-width="3"/>` + arrowHead(30, 95, 180, INK) + arrowHead(230, 95, 0, INK);
  }
  return svgWrap(inner, "0 0 260 180", 250, "Lyne");
}

/* ---------- ch4: driehoeke (met merkies / regtehoek-blokkie) ---------- */
const sideTick = (p1, p2, n, accent) => {
  const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
  const ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) + Math.PI / 2;
  const dx = 6 * Math.cos(ang), dy = 6 * Math.sin(ang);
  const along = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
  let out = "";
  for (let i = 0; i < n; i++) {
    const off = (i - (n - 1) / 2) * 6;
    const cx = mx + off * Math.cos(along), cy = my + off * Math.sin(along);
    out += `<line x1="${f(cx - dx)}" y1="${f(cy - dy)}" x2="${f(cx + dx)}" y2="${f(cy + dy)}" stroke="${accent}" stroke-width="2.2"/>`;
  }
  return out;
};
const rightAngle = (v, p1, p2, accent, s = 15) => {
  const u1 = unit(v, p1), u2 = unit(v, p2);
  const a = [v[0] + u1[0] * s, v[1] + u1[1] * s], c = [v[0] + u2[0] * s, v[1] + u2[1] * s];
  const b = [v[0] + (u1[0] + u2[0]) * s, v[1] + (u1[1] + u2[1]) * s];
  return `<polyline points="${f(a[0])},${f(a[1])} ${f(b[0])},${f(b[1])} ${f(c[0])},${f(c[1])}" fill="none" stroke="${accent}" stroke-width="2"/>`;
};
function unit(a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1; return [dx / m, dy / m]; }
const TRIS = {
  gelyksydig: { pts: [[110, 28], [40, 146], [180, 146]], ticks: [[0, 1, 1], [1, 2, 1], [2, 0, 1]] },
  gelykbenig: { pts: [[110, 26], [56, 148], [164, 148]], ticks: [[0, 1, 1], [0, 2, 1]] },
  ongelyksydig: { pts: [[66, 32], [34, 146], [196, 120]], ticks: [] },
  reghoekig: { pts: [[52, 38], [52, 146], [188, 146]], right: 1 },
  stomphoekig: { pts: [[40, 70], [150, 36], [205, 150]], obtuseAt: 0 },
  skerphoekig: { pts: [[112, 34], [50, 146], [172, 138]] },
};
export function triangleFigure(kind, accent = "#ea580c") {
  const d = TRIS[kind] || TRIS.skerphoekig;
  const p = d.pts;
  const poly = `<polygon points="${p.map(q => q.join(",")).join(" ")}" fill="${accent}" fill-opacity="0.13" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`;
  let marks = "";
  (d.ticks || []).forEach(([i, j, n]) => marks += sideTick(p[i], p[j], n, accent));
  if (d.right != null) marks += rightAngle(p[d.right], p[(d.right + 1) % 3], p[(d.right + 2) % 3], accent);
  return svgWrap(poly + marks, "0 0 240 175", 230, "Driehoek");
}

/* ---------- ch4: vierhoeke ---------- */
const QUADS = {
  vierkant: { pts: [[70, 35], [170, 35], [170, 135], [70, 135]], right: [0, 1, 2, 3], ticks: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 0, 1]] },
  reghoek: { pts: [[40, 45], [200, 45], [200, 130], [40, 130]], right: [0, 1, 2, 3] },
  ruit: { pts: [[120, 28], [205, 92], [120, 156], [35, 92]], ticks: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 0, 1]] },
  parallelogram: { pts: [[70, 40], [210, 40], [165, 135], [25, 135]], ticks: [[0, 1, 1], [2, 3, 1], [1, 2, 2], [3, 0, 2]] },
  trapesium: { pts: [[80, 42], [165, 42], [215, 138], [25, 138]], par: [[0, 1], [3, 2]] },
  vlieer: { pts: [[120, 26], [185, 96], [120, 162], [55, 96]], ticks: [[0, 1, 1], [3, 0, 1], [1, 2, 2], [2, 3, 2]] },
};
export function quadFigure(kind, accent = "#ea580c") {
  const d = QUADS[kind] || QUADS.vierkant;
  const p = d.pts;
  const poly = `<polygon points="${p.map(q => q.join(",")).join(" ")}" fill="${accent}" fill-opacity="0.13" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`;
  let marks = "";
  (d.ticks || []).forEach(([i, j, n]) => marks += sideTick(p[i], p[j], n, accent));
  (d.right || []).forEach(i => marks += rightAngle(p[i], p[(i + 1) % 4], p[(i + 3) % 4], accent, 13));
  (d.par || []).forEach(([i, j], k) => { const c = "›".repeat(k + 1); const mx = (p[i][0] + p[j][0]) / 2, my = (p[i][1] + p[j][1]) / 2; marks += txt([mx, my], c, accent, 14); });
  return svgWrap(poly + marks, "0 0 240 185", 230, "Vierhoek");
}

/* ---------- ch4: reëlmatige poligoon met N sye ---------- */
export function polygonFigure(n, accent = "#ea580c") {
  const cx = 120, cy = 95, r = 72;
  const pts = [];
  for (let k = 0; k < n; k++) { const a = 90 + k * 360 / n; pts.push([f(cx + r * Math.cos(rd(a))), f(cy - r * Math.sin(rd(a)))]); }
  const poly = `<polygon points="${pts.map(q => q.join(",")).join(" ")}" fill="${accent}" fill-opacity="0.13" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`;
  return svgWrap(poly, "0 0 240 190", 220, "Poligoon");
}

/* ---------- ch4: kongruent vs gelykvormig (twee driehoeke) ---------- */
export function congruentFigure(congruent, accent = "#ea580c") {
  const base = [[20, 30], [10, 110], [120, 95]];          // 'n skewe driehoek (relatief tot eie oorsprong)
  const place = (pts, ox, oy, s) => pts.map(([x, y]) => [f(ox + x * s), f(oy + y * s)]);
  const tri = (pts, dash) => `<polygon points="${pts.map(q => q.join(",")).join(" ")}" fill="${accent}" fill-opacity="0.13" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" ${dash ? `stroke-dasharray="6 4"` : ""}/>`;
  const left = place(base, 20, 40, 1);
  const right = congruent ? place(base, 170, 40, 1) : place(base, 175, 30, 1.45);   // selfde grootte óf 1.45×
  return svgWrap(tri(left, false) + tri(right, true)
    + txt([70, 168], "A", INK, 14) + txt(congruent ? [235, 168] : [250, 168], "B", INK, 14),
    "0 0 320 180", 300, "Twee driehoeke");
}

/* ---------- ch4: tikbare sirkel (tap die deel) ---------- */
export function circleTapFigure(target, accent = "#0d9488") {
  const cx = 135, cy = 120, r = 86;
  const P = a => [f(cx + r * Math.cos(rd(a))), f(cy - r * Math.sin(rd(a)))];
  const base = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#eef4fb" stroke="#c2d2d6" stroke-width="2.4"/>`;
  // sigbare dele
  const radEnd = P(38);
  const radius = `<line x1="${cx}" y1="${cy}" x2="${radEnd[0]}" y2="${radEnd[1]}" stroke="${accent}" stroke-width="3.4" stroke-linecap="round"/>`;
  const ch1 = P(205), ch2 = P(310);
  const koord = `<line x1="${ch1[0]}" y1="${ch1[1]}" x2="${ch2[0]}" y2="${ch2[1]}" stroke="#7c3aed" stroke-width="3.4" stroke-linecap="round"/>`;
  const boog = arcPoly(cx, cy, r, 120, 165, "#db2777", 5);
  const mid = `<circle cx="${cx}" cy="${cy}" r="5.5" fill="${INK}"/>`;
  // onsigbare, ruim tik-areas (groot vir vingers op 'n tablet)
  const hit = (key, shape) => `<g data-tap="${key}" style="cursor:pointer">${shape}</g>`;
  const fatLine = (p1, p2) => `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="transparent" stroke-width="22"/>`;
  const tapMid = hit("middelpunt", `<circle cx="${cx}" cy="${cy}" r="16" fill="transparent"/>` + mid);
  const tapRad = hit("radius", fatLine([cx, cy], radEnd) + radius);
  const tapKoord = hit("koord", fatLine(ch1, ch2) + koord);
  const tapBoog = hit("boog", arcPoly(cx, cy, r, 118, 167, "transparent", 22) + boog);
  // teken volgorde: areas onder, sigbare bo reeds ingesluit
  return svgWrap(base + tapKoord + tapRad + tapBoog + tapMid,
    "0 0 270 220", 260, "Sirkel — tik die regte deel") ;
}
