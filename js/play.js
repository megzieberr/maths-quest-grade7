/* ============================================================
   SPEEL-LUS (meester-lus + XP). Tellings + sukkel-vlae gaan na die
   agterkant via die api, gekoppel aan die ingetekende leerder.
   ============================================================ */
import { XP } from "./config.js";
import { api } from "./api.js";
import { getSession } from "./session.js";
import { mountQuestion } from "./questions.js";
import { openConcept } from "./modal.js";
import { el, clear, mount, shuffled } from "./ui.js";
import { REDES } from "./redes.js";
import { isChainLocked } from "./chain.js";
import { poolFromDiceId } from "./dice.js";

/* collapsible "Watter rede? 🧭" gids — 'n rondte kies in via def.guide = [kodes].
   Lys elke rede se kort + vol bewoording; toe by verstek, oop met 'n tik. */
function guideCard(def) {
  if (!Array.isArray(def.guide) || !def.guide.length) return null;
  const d = el("details", "card guide-card");
  const rows = def.guide.map(code => {
    const r = REDES[code];
    if (!r) return "";
    return `<div class="gd-row"><span class="gd-kort">${r.kort}</span><span class="gd-vol">${r.vol}</span></div>`;
  }).join("");
  d.innerHTML = `<summary>🧭 Watter rede?</summary><div class="gd-body">${rows}</div>`;
  return d;
}

/* big, ALTYD-oop leerkaart bo-aan 'n INTRO-rondte — def.lesson = {title,
   figure, body, code}. figure + reasonkode is opsioneel. 'n Rondte kies
   in deur def.lesson te verskaf (nie 'n toggle nie — "pinned open"). */
function lessonCard(def) {
  const L = def.lesson;
  if (!L) return null;
  const card = el("div", "card lesson-card");
  const fig = L.figure ? `<div class="lesson-figure">${L.figure}</div>` : "";
  const rede = L.code && REDES[L.code];
  const redeHtml = rede
    ? `<div class="reason-chip lesson-rede is-correct"><span class="rc-kort">${rede.kort}</span><span class="rc-vol">${rede.vol}</span></div>`
    : "";
  card.innerHTML = `<div class="lesson-eyebrow">📖 Leer</div>
    ${L.title ? `<h3 class="lesson-title">${L.title}</h3>` : ""}
    ${fig}
    ${L.body ? `<div class="lesson-body">${L.body}</div>` : ""}
    ${redeHtml}`;
  return card;
}

export function renderPlay(app, host, params) {
  const { chapter, quest, def, accent } = params;
  /* Navigasie-wag: 'n verouderde teël, browser-terug of diep skakel mag nooit
     'n geargiveerde hoofstuk (bv. Uitdrukkings, Vergelykings) laat speel nie —
     dieselfde "terug hub toe, geen crash nie"-reël as die hoofstuk-rooster. */
  if (chapter && chapter.archived) { app.go("hub"); return; }
  /* Navigasie-wag: 'n verouderde teël of 'n diep skakel mag nie die
     sekwensiële slot (chapter 6 "Meetkunde Stellings" ALLEEN) omseil nie —
     dieselfde reël as die hoofstuk-rooster se teël-slot (chain.js). */
  if (chapter && isChainLocked(app, chapter, quest.id)) {
    app.go("chapter", { chapterId: chapter.id });
    return;
  }
  /* strik-rondtes skommel hul vaardigheids-VOLGORDE elke speelslag, anders
     leer 'n kind by herspeel "vraag 3 is die knoppie-een" i.p.v. die
     diagram te lees (die skills-lys word net EEN keer by laai geskommel). */
  const skills = def.shuffleSkills ? shuffled([...def.skills]) : def.skills;
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
  const guide = guideCard(def);
  if (guide) screen.insertBefore(guide, qhost);
  const lesson = lessonCard(def);
  if (lesson) screen.insertBefore(lesson, guide || qhost);
  host.appendChild(screen);

  const logStruggle = (concept) => { try { sess && api.logStruggle(sess.username, sess.password, concept).catch(() => {}); } catch { /* fire and forget */ } };

  const st = { i: 0, firstTry: 0, xp: 0, streak: 0, total: skills.length };
  let attempt = 0;

  // hou tred met vrae wat reeds in hierdie quest-lopie gewys is, sodat
  // ons nie dieselfde vraag (selfde getalle/antwoord) herhaal nie.
  const seen = new Set();
  const sig = (q) => [q.type, q.prompt || "", q.answerLabel ?? "",
    q.expected != null ? JSON.stringify(q.expected) : "", q.angle ?? ""].join("¦");
  function freshQuestion(skill) {
    let q = skill.gen(), guard = 0;
    while (guard++ < 25 && seen.has(sig(q))) q = skill.gen();
    seen.add(sig(q));
    return q;
  }

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
    const q = freshQuestion(skill);
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

  /* dubbel-stuur-wet: finish() mag NOOIT twee keer indien nie. Vir gewone
     rondtes vang die bediener se was_passed-hek 'n tweede stuur (0 XP), maar
     g7_submit_dice het DOELBEWUS geen so 'n hek nie (Dice Quest betaal elke
     speel) — 'n dubbel-tik op die laaste "Gaan voort →" sou dubbel betaal. */
  let finishing = false;
  async function finish() {
    if (finishing) return;
    finishing = true;
    bar.querySelector("i").style.width = "100%";
    const score = st.total ? st.firstTry / st.total : 0;
    let res = { badgeEarned: false, alreadyPassed: false };
    // Dice Quest ("dice-m"/"dice-s"/"dice-t"/"dice-st") gaan deur 'n APARTE
    // RPC-pad: betaal ELKE speel (nie net eerste-keer-slaag soos g7_submit_quest
    // nie), en die bedrag word BEDIEN-SIEKANT bereken, nie deur die kliënt
    // genoem nie — anders sou onbeperkte herspeel onbeperkte XP kon "aanvra"
    // (sien supabase/migration-dice.sql). Alles anders (rondtes + Daaglikse
    // Quest) bly presies soos dit was.
    const dicePool = poolFromDiceId(quest.id);
    try {
      res = dicePool
        ? await api.submitDice(sess.username, sess.password, dicePool, { score, total: st.total, correct: st.firstTry })
        : await api.submitQuest(sess.username, sess.password, quest.id, { score, xp: st.xp, total: st.total, correct: st.firstTry });
    } catch { /* vanlyn — wys steeds plaaslike uitslag */ }
    await app.refresh();
    app.go("results", { chapter, quest, def, accent, score, xp: st.xp, firstTry: st.firstTry, total: st.total,
      badgeEarned: !!(res && res.badgeEarned), alreadyPassed: !!(res && res.alreadyPassed),
      xpAwarded: res && typeof res.xpAwarded === "number" ? res.xpAwarded : undefined });
  }

  showSkill();
}
