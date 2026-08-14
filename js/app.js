/* App-beheerder: dop, roetering, sessie-boot, agterkant-agnosties. */
import { api, PREVIEW } from "./api.js";
import { getSession, isLoggedIn, clearSession, setPreviewSession } from "./session.js";
import { el, clear } from "./ui.js";
import { renderLogin } from "./auth.js";
import { renderHub, renderChapter, renderResults } from "./screens.js";
import { renderPlay } from "./play.js";
import { maybeShowInstallPopup } from "./install.js";

const app = {
  root: null, state: null, screen: "login", params: {},

  async boot() {
    this.root = document.getElementById("app");

    // Onderwyser "voorskou as leerder" (oopgemaak vanaf die admin-dashboard,
    // ?preview=1): 'n in-geheue-alleen sessie, elke gebou rondte ontsluit,
    // die inteken-skerm heeltemal oorgeslaan. Niks word gestoor nie — sien
    // PreviewBackend in api.js.
    if (PREVIEW) {
      setPreviewSession("juffrou-voorskou", "voorskou");
      this.previewBanner();
      const ok = await this.refresh();
      this.go(ok ? "hub" : "login");
      return;
    }

    if (isLoggedIn()) { const ok = await this.refresh(); if (!ok) clearSession(); }
    this.go(isLoggedIn() ? "hub" : "login");
  },

  // 'n blywende strook wat onmiskenbaar maak dit is die onderwyser-voorskou
  // en dat niks hier gestoor word nie. "Sluit" maak net die voorskou-oortjie toe.
  previewBanner() {
    if (document.getElementById("preview-banner")) return;
    const bar = el("div", "preview-banner");
    bar.id = "preview-banner";
    bar.innerHTML = `<span>👁️ Juffrou-voorskou — alles oop, niks word gestoor nie</span>`;
    const close = el("button", "pv-close", "✕ Sluit");
    close.addEventListener("click", () => window.close());
    bar.appendChild(close);
    document.body.appendChild(bar);
    document.body.classList.add("has-preview-banner");
  },

  // trek die leerder se toestand (vordering, XP) van die agterkant af
  async refresh() {
    const s = getSession();
    if (!s) return false;
    try { const r = await api.getState(s.username, s.password); if (!r || !r.ok) return false; this.state = r; return true; }
    catch { return false; }
  },

  go(screen, params) { this.screen = screen; this.params = params || {}; window.scrollTo(0, 0); this.render(); },
  logout() { clearSession(); this.state = null; this.go("login"); },

  render() {
    clear(this.root);
    if ((this.screen === "hub" || this.screen === "chapter") && this.state) this.root.appendChild(chrome(this));
    const view = el("main", "view");
    this.root.appendChild(view);
    switch (this.screen) {
      case "login": renderLogin(this, view); break;
      // die "sit dit op jou foon"-nudge skryf 'n g7.installSeen.* localStorage-
      // sleutel by die eerste hub-besoek — nooit in voorskou nie (PREVIEW mag
      // glad niks skryf nie, sien die boot-kommentaar hierbo).
      case "hub": renderHub(this, view); if (!PREVIEW) maybeShowInstallPopup(this); break;
      case "chapter": renderChapter(this, view, this.params); break;
      case "play": renderPlay(this, view, this.params); break;
      case "results": renderResults(this, view, this.params); break;
      default: renderHub(this, view);
    }
  },
};

function chrome(app) {
  const c = el("div", "chrome");
  c.innerHTML = `<div class="brand"><span class="logo">🚀</span> Wiskunde Avontuur</div>
    <div class="chrome-right">
      <span class="xpchip"><span class="s">★</span> ${(app.state && app.state.totalXp) || 0}</span>
      <button class="link-btn logout" title="Teken uit" aria-label="Teken uit">⎋</button>
    </div>`;
  c.querySelector(".brand").addEventListener("click", () => app.go("hub"));
  c.querySelector(".logout").addEventListener("click", () => app.logout());
  return c;
}

app.boot();
window.__APP__ = app;
