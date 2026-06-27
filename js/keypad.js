/* ============================================================
   GETAL-SLEUTELBORD  (die enigste getikte invoer in die spel)
   ------------------------------------------------------------
   Net skermsleutels. Syfers, 'n desimale KOMMA, 'n minus (waar
   negatiewe toegelaat word), vee uit, en stuur.
   mountKeypad(host, { unit, allowNeg, onSubmit }) -> { value, clear }
   ============================================================ */
import { el } from "./ui.js";
import { parseNum } from "./check.js";

export function mountKeypad(host, opts = {}) {
  const { unit = "", allowNeg = false, onSubmit } = opts;
  let buf = "";   // bv. "-8,5"

  const wrap = el("div", "keypad");
  const disp = el("div", "kdisp empty");
  disp.innerHTML = `<span class="kval">0</span>${unit ? `<span class="unit">${unit}</span>` : ""}`;
  const valEl = disp.querySelector(".kval");
  wrap.appendChild(disp);

  function paint() {
    valEl.textContent = buf === "" ? "0" : (buf === "-" ? "-" : buf);
    disp.classList.toggle("empty", buf === "");
  }
  function press(k) {
    if (k === "del") buf = buf.slice(0, -1);
    else if (k === "neg") buf = buf.startsWith("-") ? buf.slice(1) : "-" + buf;
    else if (k === ",") { if (!buf.includes(",") && buf !== "" && buf !== "-") buf += ","; }
    else { if (buf.replace("-", "").replace(",", "").length < 6) buf += k; }   // lengte-grens
    paint();
  }

  const grid = el("div", "kgrid");
  const addKey = (label, cls, fn) => { const b = el("button", "key" + (cls ? " " + cls : ""), label); b.type = "button"; b.addEventListener("click", fn); grid.appendChild(b); return b; };

  ["7","8","9","4","5","6","1","2","3"].forEach(d => addKey(d, "", () => press(d)));
  addKey(",", "", () => press(","));
  addKey("0", "", () => press("0"));
  addKey("⌫", "del", () => press("del"));
  if (allowNeg) addKey("±", "", () => press("neg"));
  const submit = addKey("Stuur ✓", "submit" + (allowNeg ? " wide" : ""), () => {
    const v = parseNum(buf);
    onSubmit && onSubmit(v, buf);
  });
  if (allowNeg) submit.style.gridColumn = "span 2";

  wrap.appendChild(grid);
  host.appendChild(wrap);
  paint();

  return {
    get value() { return parseNum(buf); },
    get raw() { return buf; },
    clear() { buf = ""; paint(); },
    disable() { grid.querySelectorAll(".key").forEach(b => b.disabled = true); },
  };
}
