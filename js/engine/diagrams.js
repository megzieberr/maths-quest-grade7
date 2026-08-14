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

/* t2b — translasie: wys A ÉN A′ met 'n stippelpyl tussenin, sodat die
   leerder die spronge op die vlak kan TEL. Etikette anker weg van die
   naaste rand van die assestelsel sodat lang koördinate nie afsny nie. */
export function twoPointFigure(x1, y1, x2, y2, accent = "#db2777") {
  const A2 = "#7c3aed", ARR = "#94a3b8";
  const [p1x, p1y] = gpx(x1, y1), [p2x, p2y] = gpx(x2, y2);
  const dxs = p2x - p1x, dys = p2y - p1y, len = Math.hypot(dxs, dys);
  const t = Math.max(0, (len - 10) / len);
  const ex = p1x + dxs * t, ey = p1y + dys * t;
  const ang = Math.atan2(dys, dxs) * 180 / Math.PI;   /* skerm-hoek (y-af) — presies arrowHead se konvensie */
  const arrow = `<line x1="${f(p1x)}" y1="${f(p1y)}" x2="${f(ex)}" y2="${f(ey)}" stroke="${ARR}" stroke-width="2.4" stroke-dasharray="5 4"/>` + arrowHead(ex, ey, ang, ARR, 7);
  const lbl = (px, py, txt, col) => {
    const anchor = px > OX + 30 ? "end" : "start";
    const tx = anchor === "end" ? px - 9 : px + 9;
    const ty = py < OY - RANGE * S + 20 ? py + 20 : py - 9;
    return `<text x="${f(tx)}" y="${f(ty)}" text-anchor="${anchor}" font-family="Fredoka, sans-serif" font-size="14" font-weight="600" fill="${col}">${txt}</text>`;
  };
  const dots = `<circle cx="${p1x}" cy="${p1y}" r="5.5" fill="${accent}"/>` + `<circle cx="${p2x}" cy="${p2y}" r="5.5" fill="${A2}"/>`;
  return svgGrid(gridBg() + arrow + dots + lbl(p1x, p1y, `A (${x1} ; ${y1})`, accent) + lbl(p2x, p2y, `A′ (${x2} ; ${y2})`, A2));
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
/* ---------- Feature 4 (2026-08-10): kleur per gemerkte hoek ----------
   Wanneer 'n figuur MEER AS EEN bekende hoek gelyktydig wys, kry elke
   hoek sy EIE kleur uit hierdie vaste palet (deterministies: hoek-
   indeks → palet-indeks), sodat 'n leerder elke gemerkte hoek se boog
   EN etiket as EEN ding kan volg. Die "?" (die gevraagde hoek) hou sy
   oranje behandeling ORAL — dis 'n gelaaide konvensie (kyk gerus na
   ander stellings-figure wat reeds oranje "?" gebruik) en verander nooit.
   Figure wat met 'n ENKELE bekende hoek gebruik word (bv. 'n gewone
   calc-vraag se "gegewe + ?") behou eenvoudig die aangebode `accent`. */
const MULTI_PALETTE = ["#16a34a", "#2563eb", "#7c3aed", "#0d9488"];
const ASK_COL = "#f59e0b", ASK_TXT = "#d97706";
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
/* parallel-merk (die ›/›› notasie) — `count` oop V-tjies (chevrons), ELK
   se punt OP die lyn self, gesentreer om (x,y) en geroteer sodat hulle in
   rigting `ang` grade wys. LET WEL: parMark gebruik die y-OP konvensie
   (dieselfde een as angleOfVec/arcPoly — punt(d,len) = middel + len·(cos d,
   −sin d)), NIE arrowHead se rou "y − sin"-patroon nie, want die roepers
   (quadFigure/quadPropsFigure) stuur hulle hoeke via angleOfVec. Vervang
   die ou swewende "›"-TEKSGLief wat nie op die lyn gelê het nie, en nie
   geroteer het met skuins sye nie (m3/m4 se ewewydig-figuur, en die
   vierhoek-dekorasies verderaan). */
function parMark(x, y, ang, count, col) {
  const a = rd(ang);
  const spacing = 9.5, armLen = 7.5, spread = 0.5;
  const stepX = Math.cos(a), stepY = -Math.sin(a);
  const start = -((count - 1) * spacing) / 2;
  let out = "";
  for (let i = 0; i < count; i++) {
    const off = start + i * spacing;
    const cx = x + off * stepX, cy = y + off * stepY;
    const b1 = [f(cx - armLen * Math.cos(a - spread)), f(cy + armLen * Math.sin(a - spread))];
    const b2 = [f(cx - armLen * Math.cos(a + spread)), f(cy + armLen * Math.sin(a + spread))];
    out += `<polyline points="${b1.join(",")} ${f(cx)},${f(cy)} ${b2.join(",")}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`;
  }
  return out;
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

/* ---------- m6/m7: hoeke op 'n reguitlyn (som = 180°) ----------
   opt.showAsk: label the second angle with its real value (180−givenDeg)
   i.p.v. "?" — vir ch6 se INTRO-rondtes waar alle waardes gewys word. */
export function straightLineFigure(givenDeg, accent = "#0d9488", opt = {}) {
  const OX = 130, OY = 120, L = 112;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const base = `<line x1="${OX - L}" y1="${OY}" x2="${OX + L}" y2="${OY}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`
    + arrowHead(OX - L, OY, 180, INK) + arrowHead(OX + L, OY, 0, INK);
  const ray = arm(givenDeg, L);
  const rayLine = `<line x1="${OX}" y1="${OY}" x2="${ray[0]}" y2="${ray[1]}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
  const askDeg = 180 - givenDeg;
  /* twee bekende hoeke gelyktydig gewys (showAsk, bv. ch6 se INTRO-rondtes)
     kry elk hulle eie kleur (Feature 4); 'n gewone enkel-bekend-vraag
     (die algemene geval, ook gedeel met ch3) behou net die accent. */
  const givenCol = opt.showAsk ? MULTI_PALETTE[0] : accent;
  const askCol = opt.showAsk ? MULTI_PALETTE[1] : ASK_COL;
  const givenArc = arcPoly(OX, OY, 30, 0, givenDeg, givenCol);
  const askArc = arcPoly(OX, OY, 30, givenDeg, 180, askCol);
  const givenLbl = txt(arm(givenDeg / 2, 48), `${givenDeg}°`, givenCol, 13);
  const askLbl = opt.showAsk
    ? txt(arm((givenDeg + 180) / 2, 48), `${askDeg}°`, askCol, 13)
    : txt(arm((givenDeg + 180) / 2, 48), "?", ASK_TXT, 16);
  return svgWrap(`${base}${rayLine}${givenArc}${askArc}${givenLbl}${askLbl}<circle cx="${OX}" cy="${OY}" r="4" fill="${INK}"/>`,
    "0 0 260 150", 260, "Hoeke op 'n reguitlyn");
}

/* ---------- ch6: DRIE hoeke op 'n reguitlyn (x = 180 − a − b) ----------
   angA, angB gegewe (in volgorde van links af); die derde (angC) is
   die verstek "onbekende" — opt.hide = "A"|"B"|"C" skuif watter een
   as "?" gewys word; opt.showAsk wys ALMAL (intro-rondtes). */
export function straightLineFigure3(angA, angB, accent = "#0d9488", opt = {}) {
  const angC = 180 - angA - angB;
  const OX = 130, OY = 120, L = 110;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const base = `<line x1="${OX - L}" y1="${OY}" x2="${OX + L}" y2="${OY}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`
    + arrowHead(OX - L, OY, 180, INK) + arrowHead(OX + L, OY, 0, INK);
  const r1 = arm(angA, L), r2 = arm(angA + angB, L);
  const rays = `<line x1="${OX}" y1="${OY}" x2="${r1[0]}" y2="${r1[1]}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`
    + `<line x1="${OX}" y1="${OY}" x2="${r2[0]}" y2="${r2[1]}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
  const hide = opt.hide || "C";
  const vals = { A: angA, B: angB, C: angC };
  const cols = { A: "#16a34a", B: "#2563eb", C: "#7c3aed" };
  const ranges = { A: [0, angA], B: [angA, angA + angB], C: [angA + angB, 180] };
  let arcs = "", labels = "";
  ["A", "B", "C"].forEach((key, i) => {
    const [d0, d1] = ranges[key];
    /* Feature 4: die "?" bly oranje ORAL, maar SLEGS wanneer dit werklik
       "?" wys — sodra showAsk die regte waarde wys, kry dit sy EIE
       palet-kleur soos die ander twee (nie meer altyd oranje nie). */
    const isAsk = key === hide && !opt.showAsk;
    const col = isAsk ? ASK_COL : cols[key];
    const r = 26 + i * 8;
    const mid = (d0 + d1) / 2;
    const showVal = key !== hide || opt.showAsk;
    arcs += arcPoly(OX, OY, r, d0, d1, col);
    labels += txt(arm(mid, r + 18), showVal ? `${vals[key]}°` : "?", isAsk ? ASK_TXT : col, showVal ? 13 : 16);
  });
  return svgWrap(`${base}${rays}${arcs}${labels}<circle cx="${OX}" cy="${OY}" r="4" fill="${INK}"/>`,
    "0 0 260 155", 260, "Hoeke op 'n reguitlyn (drie hoeke)");
}

/* ---------- m8: hoeke rondom 'n punt (3 strale, som = 360°) ----------
   opt.showAsk: label die derde hoek met sy werklike waarde (360−a−b)
   i.p.v. "?" — vir ch6 se INTRO-rondtes. */
export function aroundPointFigure(a, b, accent = "#0d9488", opt = {}) {
  const OX = 130, OY = 115, L = 95;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const rays = [0, a, a + b];
  const c = 360 - a - b;
  const lines = rays.map(d => { const p = arm(d, L); return `<line x1="${OX}" y1="${OY}" x2="${p[0]}" y2="${p[1]}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` + arrowHead(p[0], p[1], d < 90 || d > 270 ? 0 : 180, INK, 7); }).join("");
  const arcA = arcPoly(OX, OY, 30, 0, a, accent) + txt(arm(a / 2, 46), `${a}°`, accent, 13);
  const arcB = arcPoly(OX, OY, 38, a, a + b, "#2563eb") + txt(arm(a + b / 2, 54), `${b}°`, "#2563eb", 13);
  const arcC = arcPoly(OX, OY, 30, a + b, 360, opt.showAsk ? accent : "#f59e0b")
    + txt(arm((a + b + 360) / 2, 46), opt.showAsk ? `${c}°` : "?", opt.showAsk ? accent : "#d97706", opt.showAsk ? 13 : 16);
  return svgWrap(`${lines}${arcA}${arcB}${arcC}<circle cx="${OX}" cy="${OY}" r="4" fill="${INK}"/>`,
    "0 0 260 200", 250, "Hoeke rondom 'n punt");
}

/* ---------- ch6: hoeke rondom 'n punt met N (2-4) sektore ----------
   values = AL die sektor-grade rondom die punt (som = 360), in volgorde;
   hideIndex = watter een as "?" gewys word (null/opt.showAsk = wys almal —
   ch6 se INTRO-rondtes). Veralgemeen die 2-gegewe-hoek geval hierbo na
   1-3 gegewe hoeke (dus 2-4 hoeke totaal rondom die punt). */
export function aroundPointFigureN(values, hideIndex, accent = "#16a34a", opt = {}) {
  const OX = 130, OY = 115, L = 95;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const n = values.length;
  const rays = []; let cum = 0;
  for (let i = 0; i < n; i++) { rays.push(cum); cum += values[i]; }
  const palette = ["#16a34a", "#2563eb", "#7c3aed", "#0d9488", "#ea580c"];
  let lines = "";
  rays.forEach(d => { const p = arm(d, L); lines += `<line x1="${OX}" y1="${OY}" x2="${p[0]}" y2="${p[1]}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` + arrowHead(p[0], p[1], d < 90 || d > 270 ? 0 : 180, INK, 7); });
  let arcs = "", labels = "";
  for (let i = 0; i < n; i++) {
    const d0 = rays[i], d1 = i + 1 < n ? rays[i + 1] : 360;
    /* Feature 4: oranje bly gereserveer vir 'n werklike "?" — sodra
       showAsk die regte waarde wys, kry dit sy palet-kleur soos die res. */
    const isAsk = i === hideIndex && !opt.showAsk;
    const col = isAsk ? ASK_COL : palette[i % palette.length];
    const r = 24 + (i % 2) * 12;
    const mid = (d0 + d1) / 2;
    const showVal = i !== hideIndex || opt.showAsk;
    arcs += arcPoly(OX, OY, r, d0, d1, col);
    labels += txt(arm(mid, r + 20), showVal ? `${values[i]}°` : "?", isAsk ? ASK_TXT : col, showVal ? 13 : 16);
  }
  return svgWrap(`${lines}${arcs}${labels}<circle cx="${OX}" cy="${OY}" r="4" fill="${INK}"/>`,
    "0 0 260 200", 250, "Hoeke rondom 'n punt");
}

/* ---------- m9: regoorstaande (vertikaal-teenoorgestelde) hoeke ----------
   opt.showAsk: label die regoorstaande hoek met sy werklike (gelyke)
   waarde i.p.v. "?" — vir ch6 se INTRO-rondtes. */
/* opt.adjacent (Feature 2, 2026-08-10 traps): i.p.v. die REGOORSTAANDE
   hoek (oorkant die snypunt, dieselfde waarde) merk dit die hoek
   LANGSAAN die bekende een, op DIESELFDE reguit lyn (som = 180°) — vir
   st2/st3/st4 se "nie regoorstaande nie"-strikvrae. Dieselfde X-figuur,
   net 'n ander wig gemerk, sodat 'n leerder na die PRENTJIE moet kyk,
   nie net die woorde herken nie. */
export function verticalFigure(known, accent = "#0d9488", opt = {}) {
  const OX = 130, OY = 95, L = 105;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const line = d => { const p1 = arm(d, L), p2 = arm(d + 180, L); return `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`; };
  const adjacent = !!opt.adjacent;
  const askVal = adjacent ? 180 - known : known;
  const [askD0, askD1] = adjacent ? [known, 180] : [180, 180 + known];
  /* twee bekende hoeke gelyktydig gewys (showAsk) kry elk 'n eie kleur
     (Feature 4); die gewone enkel-bekend-vraag behou die accent. */
  const givenCol = opt.showAsk ? MULTI_PALETTE[0] : accent;
  const askCol = opt.showAsk ? MULTI_PALETTE[1] : ASK_COL;
  const givenArc = arcPoly(OX, OY, 26, 0, known, givenCol) + txt(arm(known / 2, 42), `${known}°`, givenCol, 13);
  const askArc = arcPoly(OX, OY, 26, askD0, askD1, askCol)
    + txt(arm((askD0 + askD1) / 2, 42), opt.showAsk ? `${askVal}°` : "?", opt.showAsk ? askCol : ASK_TXT, opt.showAsk ? 13 : 16);
  return svgWrap(`${line(0)}${line(known)}${givenArc}${askArc}<circle cx="${OX}" cy="${OY}" r="4" fill="${INK}"/>`,
    "0 0 260 190", 250, adjacent ? "Hoeke langsaan mekaar op 'n reguitlyn" : "Regoorstaande hoeke");
}

/* ---------- m11: refleks-hoek met sakrekenaar (twee arms, klein hoek + refleks-boog) ----------
   small = die gegewe (kleiner) hoek tussen die twee arms — geteken met sy
   eie boog en waarde in `accent`. Die REFLEKS-boog swaai die lang pad om
   die punt (van `small` tot 360°) en word ALTYD "?" gemerk, in die
   gelaaide oranje "?"-konvensie (sien Feature 4 hierbo — nooit verander). */
export function reflexFigure(small, accent = "#0d9488") {
  const OX = 130, OY = 120, L = 100;
  const arm = (d, len) => [f(OX + len * Math.cos(rd(d))), f(OY - len * Math.sin(rd(d)))];
  const a0 = arm(0, L), a1 = arm(small, L);
  const armLine = p => `<line x1="${OX}" y1="${OY}" x2="${p[0]}" y2="${p[1]}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
  const smallArc = arcPoly(OX, OY, 30, 0, small, accent) + txt(arm(small / 2, 46), `${small}°`, accent, 13);
  const reflexArc = arcPoly(OX, OY, 42, small, 360, ASK_COL) + txt(arm((small + 360) / 2, 60), "?", ASK_TXT, 16);
  return svgWrap(`${armLine(a0)}${armLine(a1)}${reflexArc}${smallArc}<circle cx="${OX}" cy="${OY}" r="4.5" fill="${INK}"/>`,
    "0 0 260 210", 250, "Refleks-hoek");
}

/* ---------- m3/m4: lyne & notasie ---------- */
export function lineFigure(kind, accent = "#0d9488") {
  const tick = (x, y, ang) => { const a = rd(ang + 90); const dx = 6 * Math.cos(a), dy = 6 * Math.sin(a); return `<line x1="${f(x - dx)}" y1="${f(y - dy)}" x2="${f(x + dx)}" y2="${f(y + dy)}" stroke="${accent}" stroke-width="2.4"/>`; };
  let inner = "";
  if (kind === "punt") {
    inner = `<circle cx="120" cy="92" r="7.5" fill="${accent}"/>`
      + `<text x="136" y="85" font-family="Fredoka, sans-serif" font-size="19" font-weight="700" fill="${INK}">A</text>`;
  } else if (kind === "ewewydig") {
    inner = [60, 110].map(y => `<line x1="24" y1="${y}" x2="236" y2="${y}" stroke="${INK}" stroke-width="3"/>` + arrowHead(24, y, 180, INK) + arrowHead(236, y, 0, INK) + parMark(130, y, 0, 1, accent)).join("");
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

/* ============================================================
   ch6: MEETKUNDE STELLINGS — op-skaal driehoek-geometrie
   ------------------------------------------------------------
   Anders as die TRIS-vorms hierbo (vaste, geskatte punte vir
   klassifiseer-vrae), word hierdie driehoeke uit werklike
   hoekwaardes BEREKEN (twee strale se snypunt), dan eenvormig
   geskaal om in die tekenboks te pas — die vorm bly dus altyd
   wiskundig korrek, ongeag hoe groot/klein die boks is.
   ============================================================ */
const angleOfVec = v => { const d = Math.atan2(-v[1], v[0]) * 180 / Math.PI; return d < 0 ? d + 360 : d; };
function rayIntersect(p1, d1, p2, d2) {
  const denom = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(denom) < 1e-9) return [p1[0] + d1[0], p1[1] + d1[1]];   // ontaarde rande — moet nie gebeur met geldige driehoek-hoeke nie
  const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
  const t = (dx * d2[1] - dy * d2[0]) / denom;
  return [p1[0] + t * d1[0], p1[1] + t * d1[1]];
}
/* pas 'n stel rou punte (arbitrêre skaal) in 'n teikenboks in met EENVORMIGE
   skaal (behou dus die ware hoeke — "op skaal"), plus padding vanaf die kante. */
function fitPoints(pts, boxW, boxH, padL, padT) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = Math.max(maxX - minX, 1e-6), h = Math.max(maxY - minY, 1e-6);
  const k = Math.min(boxW / w, boxH / h);
  return pts.map(([x, y]) => [f(padL + (x - minX) * k), f(padT + (y - minY) * k)]);
}
/* driehoek uit die twee basishoeke by B (links) en C (regs); unit-skaal, BC = 1 */
function triFromBaseAngles(angB, angC) {
  const dBA = [Math.cos(rd(angB)), -Math.sin(rd(angB))];
  const dCA = [Math.cos(rd(180 - angC)), -Math.sin(rd(180 - angC))];
  const A = rayIntersect([0, 0], dBA, [1, 0], dCA);
  return { A, B: [0, 0], C: [1, 0] };
}
/* die hoek-boog by punt p, tussen strale na q1 en q2. Gee { svg, mid } terug
   (mid = die middel-graad, vir label-plasing langs die halveerlyn). */
/* blokkie=true teken 'n regtehoek-hoekie (soos 'n vierkantjie se twee sye) i.p.v.
   'n boog, vir 90°-hoeke — presies dieselfde lo/hi-span (so verify se hoekmeting
   bly korrek: dit lees net die eerste + laaste punt van die polyline af). */
function vertexAngleArc(p, q1, q2, r, col, w = 2.4, blokkie = false) {
  const a1 = angleOfVec([q1[0] - p[0], q1[1] - p[1]]);
  const a2 = angleOfVec([q2[0] - p[0], q2[1] - p[1]]);
  const lo = Math.min(a1, a2), hi = Math.max(a1, a2);
  let svg;
  if (blokkie) {
    const s = Math.min(r, 15);
    const pt = d => [f(p[0] + s * Math.cos(rd(d))), f(p[1] - s * Math.sin(rd(d)))];
    const a = pt(lo), c = pt(hi);
    const b = [f(a[0] + c[0] - p[0]), f(a[1] + c[1] - p[1])];
    svg = `<polyline points="${a.join(",")} ${b.join(",")} ${c.join(",")}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
  } else {
    svg = arcPoly(p[0], p[1], r, lo, hi, col, w);
  }
  return { svg, mid: (lo + hi) / 2, span: hi - lo };
}
/* label-afstand: nou hoeke (< 40°) kry die etiket VERDER uit, anders sit die
   teks bo-op albei bene (die CQ nou-wig-les). Gewone hoeke bly naby (CQ 33–46-reël). */
const labelDist = (span, base = 36) => span >= 40 ? base : Math.min(58, base + (40 - span) * 1.4);
/* plaas 'n label 'n gegewe afstand van p af, in rigting midDeg (grade) — met 'n
   wit halo sodat dit leesbaar bly waar dit 'n lyn of boog raak */
function labelAt(p, midDeg, dist, s, col, size = 13) {
  const x = f(p[0] + dist * Math.cos(rd(midDeg))), y = f(p[1] - dist * Math.sin(rd(midDeg)));
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="${size}" fill="${col}" stroke="#fff" stroke-width="4" paint-order="stroke" stroke-linejoin="round">${s}</text>`;
}

/* ---------- ch6: driehoek met AL DRIE binnehoeke gemerk (binne-stelling) ----------
   angB, angC = die twee "basis"-hoeke wat die driehoek se vorm bepaal (soos
   triFromBaseAngles dit gebruik); angA = 180−angB−angC word BEREKEN (die
   tophoek). 'n hoek van presies 90° kry outomaties 'n regtehoek-blokkie
   i.p.v. 'n boog (die "180−90−a"-variant uit haar klasnotas — geen opt
   nodig nie, dit volg net uit die waarde). opt.hide: "A"|"B"|"C" — daardie
   hoek se etiket word "?" (opt.showAsk wys sy werklike waarde in plaas
   daarvan, kleur bly dieselfde soos die res — pas by die ch6-patroon). */
export function triAnglesFigure(angB, angC, accent = "#16a34a", opt = {}) {
  const angA = 180 - angB - angC;
  const { A, B, C } = triFromBaseAngles(angB, angC);
  const [pA, pB, pC] = fitPoints([A, B, C], 172, 126, 26, 20);

  const line = (p1, p2) => `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  const dot = p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.6" fill="${INK}"/>`;

  const vals = { A: angA, B: angB, C: angC };
  const pts = { A: pA, B: pB, C: pC };
  const others = { A: [pB, pC], B: [pA, pC], C: [pA, pB] };
  const hide = opt.hide || null;
  const showAll = opt.showAsk === true;
  const KEYS = ["A", "B", "C"];

  /* Feature 4: elke gemerkte hoek kry sy eie palet-kleur (deterministies
     via sy indeks); die gevraagde hoek ("?") bly ALTYD oranje. */
  let marks = "", labels = "";
  KEYS.forEach((key, i) => {
    const [q1, q2] = others[key];
    const isBlokkie = vals[key] === 90;
    const isAsk = key === hide && !showAll;
    const showVal = key !== hide || showAll;
    const col = isAsk ? ASK_COL : MULTI_PALETTE[i];
    const txtCol = isAsk ? ASK_TXT : col;
    const arc = vertexAngleArc(pts[key], q1, q2, isBlokkie ? 17 : 22, col, 2.4, isBlokkie);
    marks += arc.svg;
    labels += labelAt(pts[key], arc.mid, labelDist(arc.span, isBlokkie ? 30 : 32), showVal ? `${vals[key]}°` : "?", txtCol);
  });

  const inner = line(pA, pB) + line(pB, pC) + line(pA, pC) + marks + labels + dot(pA) + dot(pB) + dot(pC);
  return svgWrap(inner, "0 0 224 172", 210, "Driehoek — binnehoeke");
}

/* ---------- buitehoek van 'n driehoek (buitehoek-stelling) ----------
   angA, angB = die twee "ver" binnehoeke (by A en B) — hulle som is die
   buitehoek by C. Die sy BC word oor C verleng na D; die buitehoek word
   daar gemerk. opt.hide: "A" | "B" | "ext" (verstek "ext") — daardie
   hoek se etiket word "?" i.p.v. die syfer (vir die vraagrigting).
   opt.showAsk: wys die "hide"-hoek se WERKLIKE waarde in plaas van "?"
   (kleur bly onveranderd — soos die res van ch6 se figure).
   opt.markOnly: "A" | "B" | "C" | "ext" — wys NET daardie EEN hoek (geen
   ander booghoeke of etikette nie; die driehoek + verlengde sy bly wel
   sigbaar) — vir die "Binne of buite?"-herkenningsrondte (st24). "C" is
   die binnehoek by C, langsaan die buitehoek — die versoekendste afleier. */
export function buitehoekFigure(angA, angB, accent = "#16a34a", opt = {}) {
  const angC = 180 - angA - angB;      // binnehoek by C
  const ext = angA + angB;              // buitehoek by C
  const { A, B, C } = triFromBaseAngles(angB, angC);
  const D = [C[0] + (C[0] - B[0]) * 0.55, C[1] + (C[1] - B[1]) * 0.55];
  const [pA, pB, pC, pD] = fitPoints([A, B, C, D], 188, 116, 26, 24);

  const line = (p1, p2) => `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  const dot = p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.6" fill="${INK}"/>`;

  const base = line(pA, pB) + line(pB, pC) + line(pA, pC) + line(pC, pD)
    + arrowHead(pD[0], pD[1], -angleOfVec([pD[0] - pC[0], pD[1] - pC[1]]), INK) /* −1×: angleOfVec is y-op, arrowHead se hoek is y-af */
    + dot(pA) + dot(pB) + dot(pC);

  let marks, labels;
  if (opt.markOnly) {
    /* een enkele gemerkte hoek (st24 "Binne of buite?") — bly by die accent. */
    const specs = {
      A: { arc: vertexAngleArc(pA, pB, pC, 22, accent), p: pA, val: angA, base: 36 },
      B: { arc: vertexAngleArc(pB, pA, pC, 22, accent), p: pB, val: angB, base: 36 },
      C: { arc: vertexAngleArc(pC, pA, pB, 20, accent), p: pC, val: angC, base: 32 },
      ext: { arc: vertexAngleArc(pC, pD, pA, 27, accent), p: pC, val: ext, base: 42 },
    };
    const s = specs[opt.markOnly] || specs.ext;
    const markAsk = !!opt.markAsk;   // strik (2026-08-10 laat-aand): wys "?" i.p.v. die waarde
    marks = s.arc.svg;
    labels = labelAt(s.p, s.arc.mid, labelDist(s.arc.span, s.base), markAsk ? "?" : `${s.val}°`, markAsk ? ASK_TXT : accent);
  } else {
    /* Feature 4: A/B/ext elk hulle eie palet-kleur; die gevraagde hoek
       ("?") bly oranje — ongeag WATTER een (A, B of ext) versteek is. */
    const hide = opt.hide || "ext";
    const showAll = opt.showAsk === true;
    const isAskA = hide === "A" && !showAll, isAskB = hide === "B" && !showAll, isAskExt = hide === "ext" && !showAll;
    const colA = isAskA ? ASK_COL : MULTI_PALETTE[0];
    const colB = isAskB ? ASK_COL : MULTI_PALETTE[1];
    const colExt = isAskExt ? ASK_COL : MULTI_PALETTE[2];
    const arcA = vertexAngleArc(pA, pB, pC, 22, colA);
    const arcB = vertexAngleArc(pB, pA, pC, 22, colB);
    const arcExt = vertexAngleArc(pC, pD, pA, 27, colExt);
    const lblA = isAskA ? "?" : `${angA}°`;
    const lblB = isAskB ? "?" : `${angB}°`;
    const lblExt = isAskExt ? "?" : `${ext}°`;
    marks = arcA.svg + arcB.svg + arcExt.svg;
    labels = labelAt(pA, arcA.mid, labelDist(arcA.span), lblA, isAskA ? ASK_TXT : colA)
      + labelAt(pB, arcB.mid, labelDist(arcB.span), lblB, isAskB ? ASK_TXT : colB)
      + labelAt(pC, arcExt.mid, labelDist(arcExt.span, 42), lblExt, isAskExt ? ASK_TXT : colExt);
  }
  return svgWrap(base + marks + labels, "0 0 240 168", 230, "Buitehoek van 'n driehoek");
}

/* ---------- ch6 strik (2026-08-10 laat-aand): buitehoek "verbuigde-lyn" ----------
   Haar ontwerp: die ekstra lyn by C is NIE die sy se ware verlenging nie —
   'n ewekansige straal wat 15°-25° van die kollineêre rigting af BUIG
   (steeds op skaal getrek, met EGTE hoeke — geen skattings nie). Leer dat
   'n buitehoek NET op die verlengde sy bestaan, nooit op enige lyn wat
   naastenby daar lyk nie. Gee { svg, markedAngle } terug — markedAngle is
   die WERKLIKE hoek wat geteken is (tussen die gebuigde straal en CA),
   sodat _chk presies kan pas by wat verify-stellings MEET. */
export function buitehoekBentFigure(angA, angB, accent = "#16a34a", opt = {}) {
  const angC = 180 - angA - angB;
  const { A, B, C } = triFromBaseAngles(angB, angC);
  /* BELANGRIK: vertexAngleArc (wat werklik teken) gebruik 'n NAÏEWE
     lo=min(a1,a2)/hi=max(a1,a2)-spanwydte — GEEN "kort pad om die sirkel"-
     korreksie nie. As ons hier 'n "slimmer" wrap-veilige hoek gebruik om
     die bui te aanvaar, kan dit van wat werklik GETEKEN word verskil
     (die twee strale "oorspan" dan 0°/360°, en die boog swaai die LANG
     pad om — 'n growwe hoek soos 200°). Die wag hier MOET dus presies
     dieselfde hi-lo-som bereken as vertexAngleArc, sodat 'n aanvaarde
     buiging altyd 'n klein, sinvolle boog gee. */
  let bentDir = [0, 0], estAngle = 0, guard = 0;
  do {
    const bendSign = Math.random() < 0.5 ? 1 : -1;
    const bendDeg = bendSign * (15 + Math.random() * 10);        // 15°-25°, ewekansige kant
    const trueDir = [C[0] - B[0], C[1] - B[1]];
    const br = rd(bendDeg);
    bentDir = [
      trueDir[0] * Math.cos(br) - trueDir[1] * Math.sin(br),
      trueDir[0] * Math.sin(br) + trueDir[1] * Math.cos(br),
    ];
    const angCD = angleOfVec(bentDir), angCA = angleOfVec([A[0] - C[0], A[1] - C[1]]);
    estAngle = Math.max(angCD, angCA) - Math.min(angCD, angCA);   // presies vertexAngleArc se eie som
    guard++;
  } while ((estAngle < 25 || estAngle > 165) && guard < 60);

  const D = [C[0] + bentDir[0] * 0.55, C[1] + bentDir[1] * 0.55];
  const [pA, pB, pC, pD] = fitPoints([A, B, C, D], 188, 116, 26, 24);

  const line = (p1, p2) => `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  const dot = p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.6" fill="${INK}"/>`;

  const base = line(pA, pB) + line(pB, pC) + line(pA, pC) + line(pC, pD)
    + arrowHead(pD[0], pD[1], -angleOfVec([pD[0] - pC[0], pD[1] - pC[1]]), INK) /* −1×: angleOfVec is y-op, arrowHead se hoek is y-af */
    + dot(pA) + dot(pB) + dot(pC);

  const ask = !!opt.ask;
  const colA = MULTI_PALETTE[0], colB = MULTI_PALETTE[1], colBent = ask ? ASK_COL : MULTI_PALETTE[2];
  const arcA = vertexAngleArc(pA, pB, pC, 22, colA);
  const arcB = vertexAngleArc(pB, pA, pC, 22, colB);
  const arcBent = vertexAngleArc(pC, pD, pA, 27, colBent);
  const markedAngle = f(arcBent.span);   // die hoek soos GETEKEN — dieselfde getal wat verify sal meet
  /* Foreman-hersiening (2026-08-10): die ETIKET wys 'n heelgetal (leerders
     verwag nie "86.22°" nie) — maar markedAngle self (en dus _chk by die
     roeper) bly die PRESIESE geTEKENDE hoek, sodat verify-stellings steeds
     die WERKLIKE booghoek meet, nie die afgeronde etiket nie. */
  const marks = arcA.svg + arcB.svg + arcBent.svg;
  const labels = labelAt(pA, arcA.mid, labelDist(arcA.span), `${angA}°`, colA)
    + labelAt(pB, arcB.mid, labelDist(arcB.span), `${angB}°`, colB)
    + labelAt(pC, arcBent.mid, labelDist(arcBent.span, 42), ask ? "?" : `${Math.round(markedAngle)}°`, colBent);

  return { svg: svgWrap(base + marks + labels, "0 0 240 168", 230, "Buitehoek — strikvraag"), markedAngle };
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
/* kind === "gelykbenig" + opt.apex (getal, grade): op-skaal gelykbenige
   driehoek uit die WERKLIKE tophoek, met opsionele etikette + boogmerke
   ("Ek is verlore"-vriendelike (180−x)÷2-vrae). Sonder opt.apex bly die
   ou vaste-vorm gedrag (s1/s2 klassifiseer-vrae) ONVERANDERD.
   opt: { showApex=true, showBase=true, hide:"apex"|"base"|"baseL"|"baseR",
   showAsk=false }. "base" versteek BEIDE basishoeke (ou gedrag); "baseL"/
   "baseR" versteek NET DIE EEN (die ander bly sy waarde wys — st19: EEN
   basishoek gegee, die ander is die vraag). showAsk: wys die "hide"-hoek
   se WERKLIKE waarde ipv "?" (kleur bly dieselfde as die res). */
export function triangleFigure(kind, accent = "#ea580c", opt = {}) {
  if (kind === "gelykbenig" && typeof opt.apex === "number") {
    const apex = opt.apex, baseAng = (180 - apex) / 2;
    const half = Math.tan(rd(apex / 2));                 // unit-hoogte = 1
    const raw = [[0, 0], [-half, 1], [half, 1]];          // apex, basis-links, basis-regs
    const [pApex, pL, pR] = fitPoints(raw, 148, 128, 46, 18);
    const tri = `<polygon points="${[pApex, pL, pR].map(q => q.join(",")).join(" ")}" fill="${accent}" fill-opacity="0.13" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`;
    const dot = p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.6" fill="${INK}"/>`;
    let marks = sideTick(pApex, pL, 1, accent) + sideTick(pApex, pR, 1, accent) + dot(pApex) + dot(pL) + dot(pR);
    let labels = "";
    const hide = opt.hide || null;
    const showAll = opt.showAsk === true;
    /* Feature 4: apex/baseL/baseR elk hulle eie palet-kleur wanneer
       gewys; die gevraagde hoek ("?") bly oranje. 'n Enkele-bekend-hoek
       geval (bv. hide:"base" versteek BEIDE basishoeke, net apex bly
       oor) val outomaties op MULTI_PALETTE[0] terug — dieselfde as die
       accent wat hierdie hoofstuk deurgaans gebruik. */
    const [colApex, colL, colR] = MULTI_PALETTE;
    if (opt.showApex !== false) {
      const isAsk = hide === "apex" && !showAll;
      const col = isAsk ? ASK_COL : colApex;
      const a = vertexAngleArc(pApex, pL, pR, 22, col);
      marks += a.svg;
      labels += labelAt(pApex, a.mid, labelDist(a.span, 32), (hide === "apex" && !showAll) ? "?" : `${apex}°`, isAsk ? ASK_TXT : col);
    }
    if (opt.showBase !== false) {
      const isAskL = (hide === "base" || hide === "baseL") && !showAll;
      const isAskR = (hide === "base" || hide === "baseR") && !showAll;
      const colBL = isAskL ? ASK_COL : colL, colBR = isAskR ? ASK_COL : colR;
      const bL = vertexAngleArc(pL, pApex, pR, 19, colBL);
      const bR = vertexAngleArc(pR, pApex, pL, 19, colBR);
      marks += bL.svg + bR.svg;
      const lblL = ((hide === "base" || hide === "baseL") && !showAll) ? "?" : `${baseAng}°`;
      const lblR = ((hide === "base" || hide === "baseR") && !showAll) ? "?" : `${baseAng}°`;
      labels += labelAt(pL, bL.mid, labelDist(bL.span, 30), lblL, isAskL ? ASK_TXT : colBL)
        + labelAt(pR, bR.mid, labelDist(bR.span, 30), lblR, isAskR ? ASK_TXT : colBR);
    }
    return svgWrap(tri + marks + labels, "0 0 220 165", 210, "Gelykbenige driehoek");
  }

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
  (d.par || []).forEach(([i, j], k) => {
    const mx = (p[i][0] + p[j][0]) / 2, my = (p[i][1] + p[j][1]) / 2;
    const sideAng = angleOfVec([p[j][0] - p[i][0], p[j][1] - p[i][1]]);
    marks += parMark(mx, my, sideAng, k + 1, accent);
  });
  return svgWrap(poly + marks, "0 0 240 185", 230, "Vierhoek");
}

/* ---------- ch4 s11/s12: vierhoek met TIKBARE sye/hoeke + eienskap-simbole ----------
   Haar PDF "Eienskappe van veelhoeke": watter sye ewe lank is (merkies),
   watter sypare parallel is (pyltjies ›/››), en watter hoekpunte regte
   hoeke is (blokkie). Een bron van waarheid vir BEIDE die tekening hier
   ÉN die s11/s12-generators (wat QUAD_PROPS invoer om korrekte teikens
   — teenoorstaande/aangrensende/gelyk/parallel — te bereken).
     equalGroups: groepe sye wat ewe lank is (elke groep kry sy eie
       aantal strepies: groep 1 → een streep, groep 2 → twee strepe).
     parallelPairs: sy-pare wat parallel is (pyltjie-telling ›/›› per paar).
     rightCorners: hoekpunte wat presies 90° is (blokkie-merk).
   Geometrie is DIESELFDE punte as die ou s4 quadFigure — dekorasies is
   suiwer dekoratief, hulle skuif nooit die vorm nie. */
export const QUAD_PROPS = {
  vierkant:      { equalGroups: [["AB", "BC", "CD", "DA"]], parallelPairs: [["AB", "CD"], ["BC", "DA"]], rightCorners: ["A", "B", "C", "D"] },
  reghoek:       { equalGroups: [["AB", "CD"], ["BC", "DA"]], parallelPairs: [["AB", "CD"], ["BC", "DA"]], rightCorners: ["A", "B", "C", "D"] },
  parallelogram: { equalGroups: [["AB", "CD"], ["BC", "DA"]], parallelPairs: [["AB", "CD"], ["BC", "DA"]], rightCorners: [] },
  ruit:          { equalGroups: [["AB", "BC", "CD", "DA"]], parallelPairs: [["AB", "CD"], ["BC", "DA"]], rightCorners: [] },
  trapesium:     { equalGroups: [], parallelPairs: [["AB", "CD"]], rightCorners: [] },
  vlieer:        { equalGroups: [["AB", "DA"], ["BC", "CD"]], parallelPairs: [], rightCorners: [] },
};
const QP_SIDE_IDX = { AB: [0, 1], BC: [1, 2], CD: [2, 3], DA: [3, 0] };
const QP_CORNER_IDX = { A: 0, B: 1, C: 2, D: 3 };

/* opt: { tapSides=true, tapCorners=true, showSideLabels=true, showCornerLabels=true,
   highlightSide, highlightCorner ("AB".."A" ens.), highlightColor="#2563eb",
   decor: "all" (verstek — wys AL die vorm se eie eienskap-merke) | "none"
   (skoon vorm, geen merke) | {type:"tick", group:N} | {type:"par", pair:N} |
   {type:"right", corner:"A"} (wys NET DIÉ EEN simbool — vir s12 se
   "wat beteken dit?"-vrae, sodat die vraag ondubbelsinnig is). */
export function quadPropsFigure(kind, accent = "#ea580c", opt = {}) {
  const d = QUADS[kind] || QUADS.vierkant;
  const p = opt.pts || d.pts;   // opt.pts: eie koordinate (s13 se skoon figure) — verstek onveranderd
  const props = QUAD_PROPS[kind] || QUAD_PROPS.vierkant;
  const cx = (p[0][0] + p[1][0] + p[2][0] + p[3][0]) / 4, cy = (p[0][1] + p[1][1] + p[2][1] + p[3][1]) / 4;
  const poly = `<polygon points="${p.map(q => q.join(",")).join(" ")}" fill="${accent}" fill-opacity="0.13" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`;

  const decor = opt.decor ?? "all";
  const wantTick = gi => decor !== "none" && (decor === "all" || (decor.type === "tick" && decor.group === gi));
  const wantPar = pi => decor !== "none" && (decor === "all" || (decor.type === "par" && decor.pair === pi));
  const wantRight = c => decor !== "none" && (decor === "all" || (decor.type === "right" && decor.corner === c));

  let marks = "";
  props.equalGroups.forEach((group, gi) => {
    if (!wantTick(gi)) return;
    group.forEach(side => { const [i, j] = QP_SIDE_IDX[side]; marks += sideTick(p[i], p[j], gi + 1, accent); });
  });
  props.parallelPairs.forEach((pair, pi) => {
    if (!wantPar(pi)) return;
    pair.forEach(side => {
      const [i, j] = QP_SIDE_IDX[side];
      const mx = (p[i][0] + p[j][0]) / 2, my = (p[i][1] + p[j][1]) / 2;
      const sideAng = angleOfVec([p[j][0] - p[i][0], p[j][1] - p[i][1]]);
      marks += parMark(mx, my, sideAng, pi + 1, accent);
    });
  });
  props.rightCorners.forEach(c => {
    if (!wantRight(c)) return;
    const i = QP_CORNER_IDX[c];
    marks += rightAngle(p[i], p[(i + 1) % 4], p[(i + 3) % 4], accent, 13);
  });

  // tikbare sye + hoekpunte — ruim onsigbare tik-areas (vingers op 'n tablet)
  let taps = "";
  if (opt.tapSides !== false) {
    Object.entries(QP_SIDE_IDX).forEach(([side, [i, j]]) => {
      const isHi = opt.highlightSide === side;
      const col = isHi ? (opt.highlightColor || "#2563eb") : INK;
      const mx = (p[i][0] + p[j][0]) / 2, my = (p[i][1] + p[j][1]) / 2;
      const dx = mx - cx, dy = my - cy, dist = Math.hypot(dx, dy) || 1;
      const lp = [f(mx + dx / dist * 17), f(my + dy / dist * 17)];
      const fatLine = `<line x1="${p[i][0]}" y1="${p[i][1]}" x2="${p[j][0]}" y2="${p[j][1]}" stroke="transparent" stroke-width="24"/>`;
      const hiLine = isHi ? `<line x1="${p[i][0]}" y1="${p[i][1]}" x2="${p[j][0]}" y2="${p[j][1]}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>` : "";
      const label = (isHi || opt.showSideLabels !== false) ? txt(lp, side, col, isHi ? 15 : 12) : "";
      taps += `<g data-tap="${side}" style="cursor:pointer">${fatLine}${hiLine}${label}</g>`;
    });
  }
  if (opt.tapCorners !== false) {
    Object.entries(QP_CORNER_IDX).forEach(([corner, i]) => {
      const isHi = opt.highlightCorner === corner;
      const col = isHi ? (opt.highlightColor || "#2563eb") : INK;
      const dx = p[i][0] - cx, dy = p[i][1] - cy, dist = Math.hypot(dx, dy) || 1;
      const lp = [f(p[i][0] + dx / dist * 19), f(p[i][1] + dy / dist * 19)];
      const dot = isHi ? `<circle cx="${p[i][0]}" cy="${p[i][1]}" r="5" fill="${col}"/>` : "";
      const label = (isHi || opt.showCornerLabels !== false) ? txt(lp, corner, col, isHi ? 15 : 12) : "";
      taps += `<g data-tap="${corner}" style="cursor:pointer"><circle cx="${p[i][0]}" cy="${p[i][1]}" r="15" fill="transparent"/>${dot}${label}</g>`;
    });
  }

  return svgWrap(poly + marks + taps, "0 0 240 185", 230, "Vierhoek met sye en hoeke");
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
    "0 0 270 220", 260, "Sirkel — klik op die regte deel") ;
}
