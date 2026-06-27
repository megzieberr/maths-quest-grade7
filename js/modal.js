/* Die "Ek is verlore"-konsepkaart. Herverduidelik die idee, en bring
   die leerder terug na 'n vars suster-vraag. */
import { el } from "./ui.js";
import { getConcept } from "./concepts.js";

export function openConcept(conceptId, accent, onClose) {
  const c = getConcept(conceptId);
  if (!c) { onClose && onClose(); return; }
  const scrim = el("div", "modal-scrim");
  const modal = el("div", "modal");
  if (accent) modal.style.setProperty("--accent", accent);
  modal.innerHTML = `
    <div class="mhead"><span class="meyebrow">Vinnige verduideliking</span><button class="link-btn close" aria-label="Maak toe">✕</button></div>
    <h2>${c.title}</h2>
    <div class="concept">${c.body}</div>`;
  const btn = el("button", "btn primary big", "Reg — terug na 'n vraag");
  modal.appendChild(btn);
  scrim.appendChild(modal);

  const close = () => { scrim.remove(); onClose && onClose(); };
  modal.querySelector(".close").addEventListener("click", close);
  btn.addEventListener("click", close);
  scrim.addEventListener("click", e => { if (e.target === scrim) close(); });
  document.body.appendChild(scrim);
}
