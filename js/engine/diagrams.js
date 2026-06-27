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
