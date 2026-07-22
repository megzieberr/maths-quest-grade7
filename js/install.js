/* ============================================================
   "SIT DIT OP JOU FOON" — installeer die app op die tuisskerm.

   Twee oppervlakke, dieselfde inhoud:
     • maybeShowInstallPopup(app)  — 'n groot pop-up, een keer per leerder
     • installEntryButton(app)     — 'n knoppie (inteken + hub) om dit weer oop te maak

   Wat die leerder sien hang af van die foon:
     1. Chrome/Edge op Android  → EEN knoppie wat regtig installeer
        (die beforeinstallprompt-geleentheid wat index.html gestoor het).
     2. WhatsApp se ingeboude blaaier op Android → 'n knoppie wat die bladsy
        in Chrome oopmaak (installeer werk nie binne WhatsApp nie).
     3. iPhone → Apple laat geen installeer-knoppie toe nie; ons wys die
        Deel → "Voeg by Tuisskerm"-stappe.
   Alles versteek homself sodra die app klaar geïnstalleer is.
   ============================================================ */
import { el } from "./ui.js";

export function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
}
const UA = navigator.userAgent || "";
function isIOS() {
  return /iphone|ipad|ipod/i.test(UA) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);   // iPadOS
}
function isAndroid() { return /android/i.test(UA) && !isIOS(); }
/* WhatsApp/Facebook/Instagram se ingeboude blaaiers. Op Android is die
   "; wv"-merker betroubaar; op iOS is dit nie sigbaar nie — daar sê stap 1 dit. */
function isInApp() {
  return /; wv\)/i.test(UA) || /\bFBAN|FBAV|Instagram|Line\/|MicroMessenger/i.test(UA);
}
function hasPrompt() { return !!window.__installPrompt; }

/* Maak dieselfde bladsy in Chrome oop — werk vanuit WhatsApp se blaaier. */
function openInChrome() {
  const u = new URL(location.href);
  location.href = "intent://" + u.host + u.pathname + u.search +
    "#Intent;scheme=" + u.protocol.replace(":", "") + ";package=com.android.chrome;end";
}

const IPHONE_STEPS = [
  'As jy dit uit <b>WhatsApp</b> oopgemaak het: tik die <b>•••</b> (drie kolletjies, regs onder) en kies <b>“Open in Safari”</b>. Is jy reeds in Safari? Gaan na stap 2.',
  'Tik die <b>Deel</b>-knoppie onderaan die skerm — die <b>blokkie met \'n pyl ↑</b>.',
  'Rol af en tik <b>“Voeg by Tuisskerm”</b> (Add to Home Screen).',
  'Tik <b>“Voeg by”</b> (regs bo).',
  'Maak <b>Wiskunde Avontuur</b> oop met die nuwe 🚀-ikoon op jou tuisskerm.',
];
const ANDROID_STEPS = [
  'Maak hierdie bladsy in <b>Chrome</b> oop (nie binne WhatsApp nie).',
  'Tik die <b>⋮</b> kieslys, regs bo.',
  'Tik <b>“App installeer”</b> of <b>“Voeg by tuisskerm”</b>.',
  'Maak <b>Wiskunde Avontuur</b> oop met die nuwe 🚀-ikoon op jou tuisskerm.',
];

function stepList(steps) {
  const ol = el("ol", "inst-steps");
  steps.forEach(s => { const li = el("li"); li.innerHTML = s; ol.appendChild(li); });
  return ol;
}

/* Bou die binnekant van die pop-up. Word herbou wanneer Chrome se geleentheid
   laat opdaag (dan word die stappe 'n regte knoppie). */
function buildBody(host, close) {
  host.textContent = "";

  if (hasPrompt()) {
    host.appendChild(el("p", "inst-lead", "Tik die knoppie — die 🚀-ikoon gaan reguit op jou tuisskerm."));
    const b = el("button", "btn primary big inst-go", "📲 Installeer die app");
    const note = el("p", "inst-note small muted", "Jy hoef niks af te laai of aan te teken nie.");
    b.addEventListener("click", async () => {
      const ev = window.__installPrompt;
      if (!ev) return;
      b.disabled = true;
      try {
        ev.prompt();
        const res = await ev.userChoice;
        window.__installPrompt = null;
        if (res && res.outcome === "accepted") {
          host.textContent = "";
          host.appendChild(el("div", "inst-done", "✅ Klaar! Kyk op jou tuisskerm vir die 🚀-ikoon."));
          setTimeout(close, 2200);
        } else {
          b.disabled = false;
          b.textContent = "📲 Installeer die app";
          note.textContent = "Geen probleem — jy kan dit later doen met die “Sit dit op jou foon”-knoppie.";
        }
      } catch { b.disabled = false; }
    });
    host.appendChild(b);
    host.appendChild(note);
    return;
  }

  if (isAndroid() && isInApp()) {
    host.appendChild(el("p", "inst-lead", "Jy is nou binne WhatsApp se blaaier — 'n app kan nie hier geïnstalleer word nie. Maak dit eers in Chrome oop:"));
    const b = el("button", "btn primary big inst-go", "🌐 Maak in Chrome oop");
    b.addEventListener("click", openInChrome);
    host.appendChild(b);
    host.appendChild(el("p", "inst-note small muted", "Werk dit nie? Tik die <b>⋮</b> regs bo en kies “Open in browser”."));
    host.appendChild(stepList(ANDROID_STEPS.slice(1)));
    return;
  }

  if (isIOS()) {
    host.appendChild(el("p", "inst-lead", "Op 'n iPhone doen jy dit self met die Deel-knoppie — dit vat 20 sekondes:"));
    host.appendChild(stepList(IPHONE_STEPS));
    return;
  }

  host.appendChild(el("p", "inst-lead", "Voeg die app in drie tikke by jou tuisskerm:"));
  host.appendChild(stepList(ANDROID_STEPS));
}

/* ---------- die pop-up ---------- */
export function openInstallPopup() {
  if (isStandalone()) return;
  if (document.querySelector(".inst-scrim")) return;      // moenie op mekaar stapel nie

  const scrim = el("div", "inst-scrim");
  const modal = el("div", "inst-modal");
  modal.innerHTML = `
    <button class="link-btn inst-close" aria-label="Maak toe">✕</button>
    <div class="inst-icon">🚀</div>
    <h2>Sit Wiskunde Avontuur op jou foon</h2>
    <p class="muted small">Dan open jy dit met een tik — sonder om 'n skakel te soek.</p>`;
  const body = el("div", "inst-body");
  modal.appendChild(body);

  const close = () => {
    scrim.remove();
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("wq-install-ready", refresh);
    window.removeEventListener("wq-installed", close);
  };
  const onKey = e => { if (e.key === "Escape") close(); };
  const refresh = () => buildBody(body, close);

  buildBody(body, close);
  const dismiss = el("button", "btn ghost big inst-later", "Later");
  dismiss.addEventListener("click", close);
  modal.appendChild(dismiss);

  modal.querySelector(".inst-close").addEventListener("click", close);
  scrim.addEventListener("click", e => { if (e.target === scrim) close(); });
  document.addEventListener("keydown", onKey);
  window.addEventListener("wq-install-ready", refresh);   // Chrome se geleentheid kan laat wees
  window.addEventListener("wq-installed", close);

  scrim.appendChild(modal);
  document.body.appendChild(scrim);
  document.body.style.overflow = "hidden";
}

/* Een keer per leerder, die eerste keer wat hulle die hub sien. */
export function maybeShowInstallPopup(app) {
  if (isStandalone()) return;
  const sid = (app && app.state && app.state.student && app.state.student.id) || "anon";
  const key = "g7.installSeen." + sid;
  try {
    if (localStorage.getItem(key) === "1") return;
    localStorage.setItem(key, "1");
  } catch { /* privaat modus — wys dit dan maar elke keer */ }
  setTimeout(openInstallPopup, 700);      // laat die hub eers verskyn
}

/* Knoppie vir die inteken- en hub-skerms. Gee null terug as die app reeds
   geïnstalleer is, sodat die oproeper dit sommer net kan byvoeg. */
export function installEntryButton() {
  if (isStandalone()) return null;
  const b = el("button", "btn ghost small inst-entry", "📱 Sit dit op jou foon");
  b.addEventListener("click", openInstallPopup);
  return b;
}
