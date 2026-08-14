/* ============================================================
   IN-APP CALCULATOR — Casio fx-991ZA Plus II (COMP arithmetic only)
   ------------------------------------------------------------
   A faithful, interactive replica of the calculator's COMP (basic
   arithmetic) screen, ported from Maths Homework Quest's stats
   version and stripped down: no STAT mode, no data table, no
   statlib. +−×÷ arithmetic works exactly as on the real device
   (× ÷ − glyphs, comma decimals, SHIFT/MODE/AC/DEL/CLR keys stay
   as the class's real device shows them).

   Fires an "eq" event { expr, value } whenever "=" successfully
   evaluates a COMP expression — the quest engine listens for this
   to check the learner's typed sum against the expected answer.
   A "=" that errors (Syntax ERROR / incomplete expression) fires
   nothing, so it never counts as an attempt.
   ============================================================ */
import { el } from "./ui.js";

/* keypad layout (id, label, optional shift-function label, css class) —
   unchanged from the source device replica, byte-for-byte. */
const KEYS = [
  [{ id: "shift", label: "SHIFT", cls: "k-shift" }, { id: "alpha", label: "ALPHA", cls: "k-alpha" }, { id: "up", label: "▲", cls: "k-nav" }, { id: "mode", label: "MODE", shift: "SETUP", cls: "k-fn" }, { id: "on", label: "ON", cls: "k-fn" }],
  [{ id: "left", label: "◀", cls: "k-nav" }, { id: "down", label: "▼", cls: "k-nav" }, { id: "right", label: "▶", cls: "k-nav" }, { id: "del", label: "DEL", cls: "k-fn" }, { id: "ac", label: "AC", cls: "k-ac" }],
  [{ id: "d7", label: "7" }, { id: "d8", label: "8" }, { id: "d9", label: "9", shift: "CLR" }, { id: "mult", label: "×", cls: "k-op" }, { id: "div", label: "÷", cls: "k-op" }],
  [{ id: "d4", label: "4" }, { id: "d5", label: "5" }, { id: "d6", label: "6" }, { id: "plus", label: "+", cls: "k-op" }, { id: "minus", label: "−", cls: "k-op" }],
  [{ id: "d1", label: "1", shift: "STAT" }, { id: "d2", label: "2" }, { id: "d3", label: "3" }, { id: "neg", label: "(−)" }, { id: "eq", label: "=", cls: "k-eq" }],
  [{ id: "d0", label: "0" }, { id: "dot", label: "," }, { id: "blankA", label: "", cls: "k-blank" }, { id: "blankB", label: "", cls: "k-blank" }, { id: "blankC", label: "", cls: "k-blank" }],
];

const escapeHtml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmtNum = v => (v == null ? "" : String(Math.round(v * 1e8) / 1e8).replace(".", ","));   // comma decimal (ZA locale, verified on the device)

export function mountCalculator(host, opts = {}) {
  // Optional milestone signal — lets the quest engine see when a learner
  // clears, or successfully evaluates a "=". Fire-and-forget; never
  // throws into the calc.
  const emit = (t, p) => { try { opts.onEvent && opts.onEvent(t, p); } catch { /* ignore */ } };

  const S = { shift: false, screen: "comp", line: "", result: null, menu: null };

  // ---- scaffold ----
  const wrap = el("div", "calc");
  const lcd = el("div", "calc-lcd");
  const ind = el("div", "calc-ind");
  const main = el("div", "calc-main");
  lcd.appendChild(ind); lcd.appendChild(main);
  wrap.appendChild(lcd);
  const pad = el("div", "calc-pad");
  KEYS.forEach(rowKeys => {
    const r = el("div", "calc-row");
    rowKeys.forEach(k => {
      const b = el("button", "calc-key " + (k.cls || ""), `${k.shift ? `<span class="ksh">${k.shift}</span>` : ""}<span class="kmain">${k.label}</span>`);
      b.type = "button";
      if (k.id.startsWith("blank")) b.classList.add("k-blank");
      else b.addEventListener("click", () => press(k.id));
      r.appendChild(b);
    });
    pad.appendChild(r);
  });
  wrap.appendChild(pad);
  host.appendChild(wrap);

  // ---- menus ----
  const openMenu = m => { S.menu = m; S.screen = "menu"; };
  const closeMenu = () => { if (S.menu && S.menu.parent) S.menu = S.menu.parent; else { S.screen = (S.menu && S.menu.ret) || "comp"; S.menu = null; } };

  // MODE: only "1: COMP" does anything — the other device modes (CMPLX,
  // STAT, BASE-N, EQN, MATRIX, TABLE) stay listed (that's what the real
  // device shows) but selecting them is a no-op here.
  function modeMenu() {
    openMenu({ items: [["1", "COMP"], ["2", "CMPLX"], ["3", "STAT"], ["4", "BASE-N"], ["5", "EQN"], ["6", "MATRIX"], ["7", "TABLE"]], ret: "comp",
      onNum(n) { if (n === 1) { S.line = ""; S.result = null; S.menu = null; S.screen = "comp"; } } });
  }
  // SHIFT+MODE (SETUP): display-only paging, matches the device's two
  // pages — nothing here is functional once STAT/frequency is stripped.
  function setupMenu() {
    const p1 = [["1", "MthIO"], ["2", "LineIO"], ["3", "Deg"], ["4", "Rad"], ["5", "Gra"], ["6", "Fix"], ["7", "Sci"]];
    const p2 = [["1", "ab/c"], ["2", "d/c"], ["3", "CMPLX"], ["4", "STAT"], ["5", "TABLE"], ["6", "APO"], ["7", "CONT"]];
    openMenu({ items: p1, page: 0, pages: 2, ret: "comp",
      onDown() { if (this.page === 0) { this.page = 1; this.items = p2; } },
      onUp() { if (this.page === 1) { this.page = 0; this.items = p1; } } });
  }
  // SHIFT+9 (CLR) → 3 (All) → = : the only functional clear-path; it only
  // clears the current line, nothing to lose.
  function clrMenu() {
    openMenu({ items: [["1", "Setup"], ["2", "Memory"], ["3", "All"]], ret: "comp",
      onNum(n) { if (n === 3) clrConfirm(); } });
  }
  function clrConfirm() {
    openMenu({ title: "Reset All?", items: [], note: "[=]:Yes   [AC]:Cancel", ret: "comp",
      onEq() { S.line = ""; S.result = null; S.menu = null; S.screen = "comp"; emit("clear"); } });
  }

  // ---- arithmetic ----
  function evalArith(s) {
    const expr = s.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/,/g, ".");
    if (!/^[-+*/.\d() ]+$/.test(expr)) throw 0;
    const v = Function('"use strict";return (' + expr + ")")();
    if (!Number.isFinite(v)) throw 0;
    return v;
  }

  // ---- key dispatch ----
  function press(id) {
    if (id === "shift") { S.shift = !S.shift; return render(); }
    let key = id;
    if (S.shift) {
      if (id === "d9") key = "clr"; else if (id === "d1") key = "stat"; else if (id === "mode") key = "setup";
      S.shift = false;
    }
    if (id === "on") { S.menu = null; S.line = ""; S.result = null; S.screen = "comp"; S.shift = false; return render(); }

    if (S.screen === "comp") compKey(key);
    else if (S.screen === "menu") menuKey(key);
    render();
  }

  const digit = id => (/^d[0-9]$/.test(id) ? +id[1] : null);
  const opChar = { plus: "+", minus: "−", mult: "×", div: "÷" };

  function compKey(key) {
    if (key === "mode") return modeMenu();
    if (key === "setup") return setupMenu();
    if (key === "clr") return clrMenu();
    if (key === "stat") return;   // SHIFT-1 (STAT) does nothing in COMP-only mode
    if (key === "ac") { S.line = ""; S.result = null; return; }
    if (key === "del") { S.line = S.line.slice(0, -1); return; }
    if (key === "eq") {
      if (!S.line) return;
      try {
        const v = evalArith(S.line);
        S.result = fmtNum(v);
        emit("eq", { expr: S.line, value: v });   // successful "=" — the hook the quest engine watches
      } catch {
        S.result = "Syntax ERROR";                // errors never emit — never counts as an attempt
      }
      return;
    }
    const d = digit(key);
    if (d != null) { S.line += d; return; }
    if (key === "dot") { S.line += ","; return; }
    if (key === "neg") { S.line += "−"; return; }
    if (opChar[key]) { S.line += opChar[key]; return; }
  }

  function menuKey(key) {
    const m = S.menu;
    if (key === "ac") return closeMenu();
    if (key === "down" && m.onDown) return m.onDown();
    if (key === "up" && m.onUp) return m.onUp();
    if (key === "eq" && m.onEq) return m.onEq();
    const d = digit(key);
    if (d != null && m.onNum) m.onNum(d);
  }

  // ---- render ----
  function render() {
    ind.textContent = S.shift ? "S" : "";

    if (S.screen === "comp") {
      main.innerHTML = `<div class="lcd-expr">${escapeHtml(S.line || "")}</div><div class="lcd-res">${S.result != null ? escapeHtml(S.result) : (S.line ? "" : "0")}</div>`;
    } else if (S.screen === "menu") {
      const m = S.menu;
      let html = m.title ? `<div class="lcd-title">${m.title}</div>` : "";
      if (m.items && m.items.length) html += `<div class="lcd-menu">` + m.items.map(([n, l]) => `<span class="lcd-mi">${n}:${l}</span>`).join("") + `</div>`;
      if (m.note) html += `<div class="lcd-note">${m.note}</div>`;
      if (m.pages && m.page < m.pages - 1) html += `<div class="lcd-more">▼</div>`;
      main.innerHTML = html;
    }
  }

  render();
  const api = { press, state: () => S };
  host.__CALC__ = api;
  return api;
}
