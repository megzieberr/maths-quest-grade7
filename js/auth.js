/* ============================================================
   REGISTREER / TEKEN IN  (self-registrasie)
   Leerders skep hul eie rekening: naam, gebruikersnaam, wagwoord.
   Om weer in te teken, het jy net gebruikersnaam + wagwoord nodig.
   As die onderwyser 'n wagwoord herstel het, vra die volgende
   inteken die leerder om 'n nuwe een te stel.
   ============================================================ */
import { api } from "./api.js";
import { setSession } from "./session.js";
import { el, clear } from "./ui.js";

const errMsg = c => ({
  wrong_password: "Daardie wagwoord is verkeerd. Probeer weer, of vra jou onderwyser om dit te herstel.",
  no_such_user: "Geen rekening met daardie gebruikersnaam nie. Nuut hier? Tik Registreer.",
  too_short: "Gebruik ten minste 4 karakters vir jou wagwoord.",
  username_taken: "Daardie gebruikersnaam is geneem — kies 'n ander.",
  username_short: "Gebruikersname benodig ten minste 3 karakters.",
  username_chars: "Gebruikersname mag net letters, syfers, punte en onderstrepies gebruik.",
  no_name: "Tik asseblief jou naam in.",
})[c] || "Iets het verkeerd geloop. Probeer weer.";

export function renderLogin(app, host) {
  clear(host);
  const wrap = el("div", "login");
  wrap.innerHTML = `<div class="login-head"><div class="login-logo">🚀</div><div><h1>Wiskunde Avontuur</h1><p class="muted small">Graad 7 · leerwerk</p></div></div>`;
  const body = el("div", "login-body");
  wrap.appendChild(body);
  host.appendChild(wrap);

  showLogin();

  function field(ph, type = "text") { const i = el("input", "login-input"); i.type = type; i.placeholder = ph; i.autocomplete = "off"; i.autocapitalize = "off"; return i; }
  function errBox() { const e = el("p", "login-err"); e.hidden = true; return e; }

  async function finishLogin(username, password, err, btn) {
    setSession(username, password);
    const ok = await app.refresh();
    if (!ok) { err.hidden = false; err.textContent = "Iets het verkeerd geloop. Probeer weer."; btn.disabled = false; return; }
    app.go("hub");
  }

  /* ---- TEKEN IN ---- */
  function showLogin() {
    clear(body);
    body.appendChild(el("p", "login-prompt", "Teken in"));
    const user = field("Gebruikersnaam");
    const pw = field("Wagwoord", "password");
    const err = errBox();
    const btn = el("button", "btn primary big", "Teken in");
    const swap = el("button", "login-swap", "Nuut hier? Registreer");
    [user, pw, err, btn, swap].forEach(n => body.appendChild(n));
    swap.addEventListener("click", showSignup);

    async function submit() {
      const u = user.value.trim(), p = pw.value;
      if (!u) { err.hidden = false; err.textContent = "Tik jou gebruikersnaam in."; return; }
      if (!p) { err.hidden = false; err.textContent = "Tik jou wagwoord in."; return; }
      err.hidden = true; btn.disabled = true;
      let r;
      try { r = await api.login(u, p); } catch { err.hidden = false; err.textContent = "Kan nie die bediener bereik nie."; btn.disabled = false; return; }
      if (r.ok) return finishLogin(u, p, err, btn);
      if (r.needsReset) { btn.disabled = false; return showReset(u); }
      err.hidden = false; err.textContent = errMsg(r.error); btn.disabled = false;
    }
    btn.addEventListener("click", submit);
    pw.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  }

  /* ---- REGISTREER ---- */
  function showSignup() {
    clear(body);
    body.appendChild(el("p", "login-prompt", "Registreer"));
    body.appendChild(el("p", "muted small", "Kies 'n naam om te wys, 'n gebruikersnaam om mee in te teken, en 'n wagwoord (4+ karakters)."));
    const name = field("Jou naam (bv. Jan S)");
    const user = field("Gebruikersnaam");
    const pw = field("Wagwoord", "password");
    const err = errBox();
    const btn = el("button", "btn primary big", "Skep rekening");
    const swap = el("button", "login-swap", "Het reeds 'n rekening? Teken in");
    [name, user, pw, err, btn, swap].forEach(n => body.appendChild(n));
    swap.addEventListener("click", showLogin);

    async function submit() {
      const nm = name.value.trim(), u = user.value.trim(), p = pw.value;
      if (!nm) { err.hidden = false; err.textContent = "Tik jou naam in."; return; }
      if (u.length < 3) { err.hidden = false; err.textContent = errMsg("username_short"); return; }
      if (p.length < 4) { err.hidden = false; err.textContent = errMsg("too_short"); return; }
      err.hidden = true; btn.disabled = true;
      let r;
      try { r = await api.signup(u, nm, p); } catch { err.hidden = false; err.textContent = "Kan nie die bediener bereik nie."; btn.disabled = false; return; }
      if (!r.ok) { err.hidden = false; err.textContent = errMsg(r.error); btn.disabled = false; return; }
      return finishLogin(u, p, err, btn);   // teken dadelik in
    }
    btn.addEventListener("click", submit);
    pw.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  }

  /* ---- STEL 'N NUWE WAGWOORD nadat die onderwyser dit herstel het ---- */
  function showReset(username) {
    clear(body);
    body.appendChild(el("p", "login-prompt", "Stel 'n nuwe wagwoord"));
    body.appendChild(el("p", "muted small", `Jou onderwyser het die wagwoord vir "${username}" herstel. Kies 'n nuwe een (4+ karakters).`));
    const pw = field("Nuwe wagwoord", "password");
    const pw2 = field("Bevestig nuwe wagwoord", "password");
    const err = errBox();
    const btn = el("button", "btn primary big", "Stoor & teken in");
    const back = el("button", "login-swap", "← Terug");
    [pw, pw2, err, btn, back].forEach(n => body.appendChild(n));
    back.addEventListener("click", showLogin);

    async function submit() {
      const p = pw.value;
      if (p.length < 4) { err.hidden = false; err.textContent = errMsg("too_short"); return; }
      if (pw2.value !== p) { err.hidden = false; err.textContent = "Die twee wagwoorde stem nie ooreen nie."; return; }
      err.hidden = true; btn.disabled = true;
      let r;
      try { r = await api.setPassword(username, p); } catch { err.hidden = false; err.textContent = "Kan nie die bediener bereik nie."; btn.disabled = false; return; }
      if (!r.ok) { err.hidden = false; err.textContent = errMsg(r.error); btn.disabled = false; return; }
      return finishLogin(username, p, err, btn);
    }
    btn.addEventListener("click", submit);
    pw2.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  }
}
