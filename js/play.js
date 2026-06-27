/* ============================================================
   SPEEL-LUS (meester-lus + XP). Tellings + sukkel-vlae gaan na die
   agterkant via die api, gekoppel aan die ingetekende leerder.
   ============================================================ */
import { XP } from "./config.js";
import { api } from "./api.js";
import { getSession } from "./session.js";
import { mountQuestion } from "./questions.js";
import { openConcept } from "./modal.js";
import { el, clear, mount } from "./ui.js";

export function renderPlay(app, host, params) {
  const { chapter, quest, def, accent } = params;
  const skills = def.skills;
  const sess = getSession();

  clear(host);
  const screen = el("div", "play");
  screen.style.setProperty("--accent", accent);
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit" aria-label="Los">✕</button>
    <div class="ptitle">${quest.title}</div>
    <div class="pcount"></div>`;
  top.querySelector(".quit").addEventListener("click", () => app.go("chapter", { chapterId: chapter.id }));
  const bar = el("div", "pbar"); bar.appendChild(el("i"));
  const xpPop = el("div", "xp-pop");
  const qhost = el("div", "q-host");
  mount(screen, top, bar, xpPop, qhost);
  host.appendChild(screen);

  const logStruggle = (concept) => { try { sess && api.logStruggle(sess.username, sess.password, concept).catch(() => {}); } catch { /* fire and forget */ } };

  const st = { i: 0, firstTry: 0, xp: 0, streak: 0, total: skills.length };
  let attempt = 0;

  function showSkill() {
    attempt = 0;
    top.querySelector(".pcount").textContent = `${st.i + 1} / ${st.total}`;
    bar.querySelector("i").style.width = Math.round((st.i / st.total) * 100) + "%";
    xpPop.textContent = ""; xpPop.className = "xp-pop";
    present();
  }

  function present() {
    attempt++;
    const skill = skills[st.i];
    const q = skill.gen();
    window.__Q__ = q;
    mountQuestion(qhost, q, {
      accent,
      onResult(ok) {
        if (ok) {
          const ft = attempt === 1;
          if (ft) st.firstTry++;
          st.streak++;
          const gained = XP.perCorrect * Math.min(st.streak, XP.streakCap) + (ft ? XP.firstTryBonus : 0);
          st.xp += gained;
          xpPop.className = "xp-pop good";
          xpPop.textContent = `+${gained} XP${ft ? " · eerste keer!" : ""}`;
        } else {
          st.streak = 0;
          xpPop.className = "xp-pop bad";
          xpPop.textContent = "Kom ons probeer 'n soortgelyke een";
          if (attempt >= 2) logStruggle(skill.concept);      // herhaalde misser op hierdie vaardigheid
        }
      },
      onContinue() { st.i++; window.scrollTo(0, 0); (st.i < st.total) ? showSkill() : finish(); },
      onSibling() { window.scrollTo(0, 0); xpPop.textContent = ""; xpPop.className = "xp-pop"; present(); },
      onLost() { logStruggle(skills[st.i].concept); openConcept(skills[st.i].concept, accent, () => { window.scrollTo(0, 0); present(); }); },
    });
  }

  async function finish() {
    bar.querySelector("i").style.width = "100%";
    const score = st.total ? st.firstTry / st.total : 0;
    let res = { badgeEarned: false, alreadyPassed: false };
    try { res = await api.submitQuest(sess.username, sess.password, quest.id, { score, xp: st.xp, total: st.total, correct: st.firstTry }); }
    catch { /* vanlyn — wys steeds plaaslike uitslag */ }
    await app.refresh();
    app.go("results", { chapter, quest, accent, score, xp: st.xp, firstTry: st.firstTry, total: st.total,
      badgeEarned: !!(res && res.badgeEarned), alreadyPassed: !!(res && res.alreadyPassed) });
  }

  showSkill();
}
