/* ============================================================
   VRAAG-KOMPONENTE + reaktiewe hulp
   ------------------------------------------------------------
   mountQuestion(host, q, handlers) wys EEN vraag van enige tipe,
   hanteer die interaksie, en by die eerste antwoord:
     • wys reg/verkeerd
     • by 'n verkeerde antwoord: wys die uitgewerkte oplossing
     • bied "Gaan voort →" (reg) of "Probeer 'n soortgelyke een →"
   Hulp is reaktief: 'n 💡 Wenk (op aanvraag) en 'n 🆘 Ek is verlore
   konsepkaart (altyd beskikbaar).

   handlers = { accent, onResult(ok, chosen), onContinue(), onSibling(), onLost() }
   q.type: "mc" | "tf" | "calc" | "multi" | "coord" | "protractor" | "tap" |
           "reason" (kies-die-rede) | "calcReason" (waarde ÉN rede)
   ============================================================ */
import { el, clear } from "./ui.js";
import { mountKeypad } from "./keypad.js";
import { answerCorrect, fmtComma, parseNum } from "./check.js";
import { renderProtractor } from "./engine/protractor.js";
import { TOL } from "./config.js";
import { REDES } from "./redes.js";

export function mountQuestion(host, q, handlers = {}) {
  clear(host);
  const root = el("div", "q");
  if (handlers.accent) root.style.setProperty("--accent", handlers.accent);
  if (q.prompt) root.appendChild(el("p", "q-prompt", q.prompt));

  // optional figure (protractor / shape) drawn above the input
  if (q.type === "protractor") {
    const fig = el("div", "q-figure");
    fig.innerHTML = renderProtractor(q.angle, { accent: handlers.accent, baseSide: q.baseSide });
    root.appendChild(fig);
  } else if (q.figure) {
    const fig = el("div", "q-figure");
    fig.innerHTML = q.figure;
    root.appendChild(fig);
  }

  // optional always-visible tip (e.g. a calculator-order reminder)
  if (q.tip) {
    const tip = el("div", "tip-box");
    tip.innerHTML = `<span class="tip-ic">💡</span>${q.tip}`;
    root.appendChild(tip);
  }

  const inputHost = el("div", "q-input");
  root.appendChild(inputHost);

  // hint + I'm lost
  const hintBox = el("div", "hint-box"); hintBox.hidden = true;
  hintBox.innerHTML = `<span class="tag">WENK</span>${q.hint || "Werk die metode stap vir stap deur."}`;
  const helpRow = el("div", "help-row");
  const hintBtn = el("button", "btn ghost small", "💡 Wenk");
  hintBtn.addEventListener("click", () => { hintBox.hidden = false; hintBtn.disabled = true; });
  const lostBtn = el("button", "btn ghost small", "🆘 Ek is verlore");
  lostBtn.addEventListener("click", () => handlers.onLost && handlers.onLost());
  helpRow.appendChild(hintBtn); helpRow.appendChild(lostBtn);

  const feedback = el("div", "feedback"); feedback.hidden = true;

  let answered = false;
  /* parts (opsioneel) = { okVal, okReason } — vir calcReason se twee-deel terugvoer.
     meta (opsioneel) = { answerLabel, solution } — oorskryf q.answerLabel/q.solution
     vir 'n spesifieke terugvoer-pad (bv. Feature 2/3: 'n normale vraag se ontsnap-
     knoppie VERKEERD getik — die verduideliking daar is anders as die gewone
     "hoe bereken jy dit"-oplossing). */
  function commit(isCorrect, chosen, parts, meta) {
    if (answered) return;
    answered = true;
    handlers.onResult && handlers.onResult(isCorrect, chosen);

    hintBtn.style.display = "none";
    feedback.hidden = false;
    feedback.classList.add(isCorrect ? "good" : "bad");
    let html = `<div class="fb-head">${isCorrect ? "✓ Reg!" : "✗ Nie heeltemal nie"}</div>`;
    if (parts) html += `<div class="fb-parts">Waarde ${parts.okVal ? "✓" : "✗"} · Rede ${parts.okReason ? "✓" : "✗"}</div>`;
    const answerLabel = (meta && meta.answerLabel !== undefined) ? meta.answerLabel : q.answerLabel;
    if (answerLabel != null) html += `<div class="fb-answer"><b>Antwoord:</b> ${answerLabel}</div>`;
    const solution = (meta && meta.solution !== undefined) ? meta.solution : q.solution;
    if (!isCorrect && Array.isArray(solution) && solution.length) {
      html += `<div class="sol">` + solution.map(s =>
        `<div class="sol-step"><span class="s">${s.s}</span>${s.r ? `<span class="r">${s.r}</span>` : ""}</div>`).join("") + `</div>`;
    }
    feedback.innerHTML = html;
    const foot = el("div", "fb-foot");
    const next = el("button", "btn primary", isCorrect ? "Gaan voort →" : "Probeer 'n soortgelyke een →");
    next.addEventListener("click", () => (isCorrect ? handlers.onContinue : handlers.onSibling)());
    foot.appendChild(next);
    feedback.appendChild(foot);
    next.focus();
  }

  /* Feature 2 (2026-08-10): 'n ALTYD-teenwoordige, vol-breedte ontsnap-
     knoppie — q.escape = { label, isAnswer, wrongTapSolution }. isAnswer
     true = 'n strikvraag: TIK die knoppie is reg, enigiets getik is
     verkeerd. isAnswer false = 'n gewone vraag: die knoppie is verkeerd
     (wrongTapSolution verduidelik hoekom), tik werk soos gewoonlik.
     Gedeel deur "calc" ÉN "calcReason" (Feature 3) — EEN implementasie. */
  function mountEscapeButton(host, onClick) {
    const btn = el("button", "btn ghost big escape-btn", q.escape.label);
    btn.type = "button";
    btn.addEventListener("click", onClick);
    host.appendChild(btn);
    return btn;
  }

  // ---------- per-type input ----------
  if (q.type === "mc") {
    const opts = el("div", "q-options" + (q.layout === "grid2" ? " grid2" : ""));
    q.options.forEach((o, idx) => {
      const b = el("button", "opt", o.label);
      b.addEventListener("click", () => {
        if (answered) return;
        [...opts.children].forEach((x, i) => { x.disabled = true; if (q.options[i].correct) x.classList.add("is-correct"); });
        b.classList.add(o.correct ? "is-correct" : "is-wrong");
        commit(!!o.correct, o.label);
      });
      opts.appendChild(b);
    });
    inputHost.appendChild(opts);
  }

  else if (q.type === "tf") {
    const labels = q.labels || ["Waar", "Onwaar"];
    const opts = el("div", "q-options yesno");
    [[labels[0], true], [labels[1], false]].forEach(([label, val]) => {
      const b = el("button", "opt big", label);
      b.addEventListener("click", () => {
        if (answered) return;
        const ok = (val === !!q.yes);
        [...opts.children].forEach(x => x.disabled = true);
        b.classList.add(ok ? "is-correct" : "is-wrong");
        commit(ok, label);
      });
      opts.appendChild(b);
    });
    inputHost.appendChild(opts);
  }

  else if (q.type === "calc" || q.type === "protractor") {
    const isP = q.type === "protractor";
    const expected = isP ? q.angle : q.expected;
    const tol = isP ? (q.tol != null ? q.tol : TOL.graphRead) : q.tol;
    let escBtn = null;
    const kp = mountKeypad(inputHost, {
      unit: q.unit || (isP ? "°" : ""), allowNeg: !!q.allowNeg,
      onSubmit: (v) => {
        if (answered) return;
        if (!Number.isFinite(v)) return;
        kp.disable();
        if (escBtn) escBtn.disabled = true;
        // 'n strikvraag (escape.isAnswer) het GEEN geldige getikte antwoord nie —
        // die regte stap was die knoppie, so enigiets getik tel as verkeerd.
        const isTrap = !isP && q.escape && q.escape.isAnswer;
        const ok = !isTrap && answerCorrect(v, expected, { dp: q.dp, tol });
        commit(ok, fmtComma(v, q.dp));
      },
    });
    if (!isP && q.escape) {
      escBtn = mountEscapeButton(inputHost, () => {
        if (answered) return;
        kp.disable();
        escBtn.disabled = true;
        const ok = !!q.escape.isAnswer;
        commit(ok, q.escape.label, null, ok ? undefined : { solution: q.escape.wrongTapSolution });
      });
    }
  }

  else if (q.type === "multi") {
    if (q.instruction) inputHost.appendChild(el("p", "q-task", q.instruction));
    const wrap = el("div", "q-multi");
    const sel = new Set();
    q.chips.forEach((c, i) => {
      const chip = el("div", "chip", c.label);
      chip.addEventListener("click", () => {
        if (answered) return;
        if (sel.has(i)) { sel.delete(i); chip.classList.remove("sel"); }
        else { sel.add(i); chip.classList.add("sel"); }
      });
      wrap.appendChild(chip);
    });
    inputHost.appendChild(wrap);
    const foot = el("div", "q-multi-foot");
    const submit = el("button", "btn primary big", "Stuur ✓");
    submit.addEventListener("click", () => {
      if (answered) return;
      const correctIdx = new Set(q.chips.map((c, i) => c.correct ? i : -1).filter(i => i >= 0));
      const ok = sel.size === correctIdx.size && [...sel].every(i => correctIdx.has(i));
      [...wrap.children].forEach((chip, i) => {
        chip.classList.add("locked");
        if (correctIdx.has(i)) chip.classList.add("ok");
        else if (sel.has(i)) chip.classList.add("miss");
      });
      submit.remove();
      commit(ok, [...sel].join(","));
    });
    foot.appendChild(submit);
    inputHost.appendChild(foot);
  }

  else if (q.type === "coord") {
    mountCoord(inputHost, q, (ok, label) => commit(ok, label));
  }

  else if (q.type === "reason") {
    // kies-die-rede: een chip per aangebode REDES-kode (kort groot, vol klein)
    const grid = el("div", "reason-grid");
    q.options.forEach((o, idx) => {
      const r = REDES[o.code];
      const chip = el("button", "reason-chip");
      chip.type = "button";
      chip.innerHTML = `<span class="rc-kort">${r.kort}</span><span class="rc-vol">${r.vol}</span>`;
      chip.addEventListener("click", () => {
        if (answered) return;
        [...grid.children].forEach((x, i) => { x.disabled = true; if (q.options[i].correct) x.classList.add("is-correct"); });
        chip.classList.add(o.correct ? "is-correct" : "is-wrong");
        commit(!!o.correct, r.kort);
      });
      grid.appendChild(chip);
    });
    inputHost.appendChild(grid);
  }

  else if (q.type === "calcReason") {
    // sleutelbord (waarde) + rede-chips; EEN Stuur-knoppie toets albei saam.
    const valWrap = el("div", "q-input-sub");
    inputHost.appendChild(valWrap);
    const kp = mountKeypad(valWrap, { unit: q.unit || "°", allowNeg: !!q.allowNeg });
    const kpSubmit = valWrap.querySelector(".key.submit");
    if (kpSubmit) kpSubmit.style.display = "none";   // hierdie tipe stuur saam met die rede, nie apart nie

    // Feature 3 (st4): dieselfde ontsnap-knoppie as "calc", direk onder die
    // sleutelbord — op 'n strikvraag is 'n TIK hier VOLLEDIG genoeg (geen
    // waarde of rede nodig nie); op 'n gewone vraag is dit verkeerd.
    let escBtn = null;
    if (q.escape) {
      escBtn = mountEscapeButton(inputHost, () => {
        if (answered) return;
        kp.disable();
        crSubmit.disabled = true;
        [...grid.children].forEach(c => c.disabled = true);
        escBtn.disabled = true;
        const ok = !!q.escape.isAnswer;
        commit(ok, q.escape.label, null, ok ? undefined : { solution: q.escape.wrongTapSolution });
      });
    }

    const grid = el("div", "reason-grid cr");
    let chosenCode = null, chosenChip = null;
    q.options.forEach(o => {
      const r = REDES[o.code];
      const chip = el("button", "reason-chip");
      chip.type = "button";
      chip.innerHTML = `<span class="rc-kort">${r.kort}</span><span class="rc-vol">${r.vol}</span>`;
      chip.addEventListener("click", () => {
        if (answered) return;
        [...grid.children].forEach(x => x.classList.remove("sel"));
        chip.classList.add("sel");
        chosenCode = o.code; chosenChip = chip;
        crSubmit.disabled = false;
      });
      grid.appendChild(chip);
    });
    inputHost.appendChild(grid);

    const foot = el("div", "cr-foot");
    const crNudge = el("div", "cr-nudge"); crNudge.hidden = true;
    const crSubmit = el("button", "btn primary big", "Stuur ✓");
    crSubmit.disabled = true;   // eers aktief sodra 'n rede gekies is
    crSubmit.addEventListener("click", () => {
      if (answered) return;
      const v = kp.value;
      if (!Number.isFinite(v) || chosenCode == null) {
        // stil-dooie knoppie verwar 'n 12-jarige — sê wat kortkom
        crNudge.hidden = false;
        crNudge.textContent = !Number.isFinite(v) ? "💡 Tik eers die hoek se waarde in." : "💡 Kies eers 'n rede.";
        return;
      }
      crNudge.hidden = true;
      kp.disable();
      crSubmit.disabled = true;
      if (escBtn) escBtn.disabled = true;
      // 'n strikvraag (escape.isAnswer) het geen geldige getikte waarde+rede
      // nie — die regte stap was die ontsnap-knoppie, so tik-en-stuur tel
      // altyd as verkeerd, ongeag watter waarde/rede gekies is.
      const isTrap = q.escape && q.escape.isAnswer;
      const okVal = !isTrap && answerCorrect(v, q.expected, { dp: q.dp, tol: q.tol });
      const okReason = !isTrap && chosenCode === q.correctCode;
      [...grid.children].forEach((c, i) => {
        c.disabled = true;
        if (!isTrap && q.options[i].correct) c.classList.add("is-correct");
        else if (c === chosenChip) c.classList.add("is-wrong");
      });
      commit(okVal && okReason, `${fmtComma(v, q.dp)}${q.unit || ""} · ${REDES[chosenCode].kort}`, isTrap ? null : { okVal, okReason });
    });
    foot.appendChild(crNudge);
    foot.appendChild(crSubmit);
    inputHost.appendChild(foot);
  }

  else if (q.type === "tap") {
    // die figuur bevat [data-tap] areas; tik die regte een.
    // q.target mag 'n string wees (een regte area) OF 'n ARRAY (enige een tel).
    const figEl = root.querySelector(".q-figure");
    const zones = figEl ? [...figEl.querySelectorAll("[data-tap]")] : [];
    const isTarget = key => Array.isArray(q.target) ? q.target.includes(key) : key === q.target;
    zones.forEach(z => {
      z.addEventListener("click", () => {
        if (answered) return;
        const ok = isTarget(z.dataset.tap);
        zones.forEach(o => {
          o.style.pointerEvents = "none";
          if (isTarget(o.dataset.tap)) o.classList.add("tap-correct");
        });
        if (!ok) z.classList.add("tap-wrong");
        commit(ok, z.dataset.tap);
      });
    });
  }

  root.appendChild(hintBox);
  root.appendChild(helpRow);
  root.appendChild(feedback);
  host.appendChild(root);
}

/* ------------------------------------------------------------
   Koördinaat-invoer: twee selle (x ; y) wat 'n gedeelde
   sleutelbord deel. Tik in die aktiewe sel.
   ------------------------------------------------------------ */
function mountCoord(host, q, done) {
  const bufs = ["", ""];
  let active = 0;
  const row = el("div", "q-coord");
  row.innerHTML = `<span class="paren">(</span>`;
  const cellX = el("div", "coord-cell active", "0");
  const semi = el("span", "paren", ";");
  const cellY = el("div", "coord-cell", "0");
  const cells = [cellX, cellY];
  row.appendChild(cellX); row.appendChild(semi); row.appendChild(cellY);
  row.appendChild(el("span", "paren", ")"));
  host.appendChild(row);

  const paint = () => cells.forEach((c, i) => {
    c.textContent = bufs[i] === "" ? "0" : (bufs[i] === "-" ? "-" : bufs[i]);
    c.classList.toggle("active", i === active);
  });
  cells.forEach((c, i) => c.addEventListener("click", () => { active = i; paint(); }));

  const press = k => {
    let b = bufs[active];
    if (k === "del") b = b.slice(0, -1);
    else if (k === "neg") b = b.startsWith("-") ? b.slice(1) : "-" + b;
    else { if (b.replace("-", "").length < 3) b += k; }
    bufs[active] = b; paint();
  };

  const grid = el("div", "kgrid");
  const addKey = (label, cls, fn) => { const btn = el("button", "key" + (cls ? " " + cls : ""), label); btn.type = "button"; btn.addEventListener("click", fn); grid.appendChild(btn); return btn; };
  ["7","8","9","4","5","6","1","2","3"].forEach(d => addKey(d, "", () => press(d)));
  addKey("±", "", () => press("neg"));
  addKey("0", "", () => press("0"));
  addKey("⌫", "del", () => press("del"));
  const submit = addKey("Stuur ✓", "submit", () => {
    const x = parseNum(bufs[0]), y = parseNum(bufs[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    grid.querySelectorAll(".key").forEach(b => b.disabled = true);
    const ok = x === q.expected.x && y === q.expected.y;
    done(ok, `(${bufs[0] || 0} ; ${bufs[1] || 0})`);
  });
  host.appendChild(grid);
  paint();
}
